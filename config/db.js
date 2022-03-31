import mongoose from "mongoose"

const dbConnect = async () => {
    try {
        
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })

        const url = `${conn.connection.host}:${conn.connection.port}`
        console.log(url)

    } catch (error) {
        console.log(`Error connecting to DB: ${error.message}`)
        process.exit(1)
    }
}


export default dbConnect


