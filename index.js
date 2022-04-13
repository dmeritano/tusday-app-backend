import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import dbConnect from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"


const app = express()
app.use(express.json())
dotenv.config()


dbConnect();

//Settings CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin:function(origin, callback) {
        if(!origin){//for bypassing postman req with no origin
            return callback(null, true)
        }else if (whitelist.includes(origin)){
            callback(null, true)
        }else{
            callback(new Error("TusDay Backend - Cors Error"))
        }
    }
}
app.use(cors(corsOptions))



//Routing
app.use("/api/users",userRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks",taskRoutes)

//(*) Variable automatically inserted by the server (Heroku, for example), so it is not necessary to define it in the .env file
const PORT = process.env.PORT || 4000


const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})


//Socket IO
import { Server } from "socket.io"
const io = new Server(server, {
    pingTimeout:60000,
    cors:{
        origin: process.env.FRONTEND_URL        
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
})
io.on('connection', (socket) => {
    console.log("Connected to socket.io")

    socket.on("open-project", (idProject) => {
        socket.join(idProject) //created room for this project ( 'project-room' )
    })

    socket.on("new-task", (task) => {     
        //emit message to people connected to 'project-room'
        //project property of task is de ._id of the project
        const idProject = task.project      //only comes the project ID
        socket.to(idProject).emit("task-created", task)        
    })

    socket.on("delete-task", (task) => {
    const idProject = task.project          //only comes the project ID
        socket.to(idProject).emit("task-deleted", task)
    })

    socket.on("update-task", (task) => {
        const idProject = task.project._id  // here comes complete project object, with all its attributes
        socket.to(idProject).emit("task-updated", task)
    })

    socket.on("change-status", (task) => {
        const idProject = task.project._id  // here comes complete project object, with all its attributes
        socket.to(idProject).emit("task-status-updated", task)
    })

    //Room for project list. => "/projects" url
    const LIST_PROJECTS_ROOM = "list-of-projects-room"
    socket.on("list-of-projects", () => {
        console.log("connected to room list of projects")
        socket.join(LIST_PROJECTS_ROOM)
    })
    socket.on("delete-project", (project) => {     
        socket.to(LIST_PROJECTS_ROOM).emit("project-deleted", project)
    })    
    socket.on("update-project", (project) => {     
        socket.to(LIST_PROJECTS_ROOM).emit("project-updated", project)
    })      

})