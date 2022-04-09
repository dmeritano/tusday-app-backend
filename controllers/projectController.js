import mongoose from "mongoose"
import Project from "../models/Project.js"
import Task from "../models/Task.js"
import User from "../models/User.js"

// CRUD - Basics
//Create
const createProject = async (req, res) => {

    try {        
        const project = new Project(req.body)
        project.creator = req.user._id        
        const storedProject = await project.save()
        res.json(storedProject)
    } catch (error) {
        console.log(`Error creating project: ${error.message}`)
        res.status(400).json({ msg: "Error creating project" })     
    }

}

//Read
const getProjects = async (req, res) => {

    const projects = await Project.find().where("creator").equals(req.user).select("-tasks")

    res.json(projects)

}
const getProject = async (req, res) => {

    const { id } = req.params
    
    try {
        const isValidId = mongoose.Types.ObjectId.isValid(id)
        if (!isValidId){
            throw new Error('MongoDB _id is invalid')
        }

        const project = await Project.findById(id)
                .populate("tasks")
                .populate("collaborators", "name email") //select only name and email.  "_id" comes by default

        if (!project) {
            const error = new Error("Project not found!")
            return res.status(404).json({ msg: error.message })               
        }else if (project.creator.toString() !== req.user._id.toString()){
            const error = new Error("Invalid action!")
            return res.status(400).json({msg:error.message})
        }
        //IMPORTANT: consider that collaborators also can get a proyect        
        res.json(project)
        
            
    } catch (error) {
        console.log(`Getting project with id ${id} - Error: ${error.message}`)
        res.status(400).json({ msg: "Error getting project"})   
    }    
}

//Update
const updateProject = async (req, res) => {

    const { id } = req.params
    
    try {
        const isValidId = mongoose.Types.ObjectId.isValid(id)
        if (!isValidId){
            throw new Error('MongoDB _id is invalid')
        }

        const project = await Project.findById(id)        
        if (!project) {
            const error = new Error("Project not found!")
            return res.status(404).json({ msg: error.message })               
        }else if (project.creator.toString() !== req.user._id.toString()){
            const error = new Error("Invalid action!")
            return res.status(400).json({msg:error.message})
        }
        
        //Update
        project.name = req.body.name || project.name
        project.description = req.body.description || project.description
        project.deliveryDate = req.body.deliveryDate || project.deliveryDate
        project.client = req.body.client || project.client
        const updated = await project.save()
        
        res.json(updated)                    

    } catch (error) {
        console.log(`Updating project with id ${id} - Error: ${error.message}`)
        res.status(400).json({ msg: "Error Updating project"})   
    }    

}
//Delete
const deleteProject = async (req, res) => {

    const { id } = req.params    
    
    try {
        const isValidId = mongoose.Types.ObjectId.isValid(id)
        if (!isValidId){
            throw new Error('MongoDB _id is invalid')
        }

        const project = await Project.findById(id)        
        if (!project) {
            const error = new Error("Project not found!")
            return res.status(404).json({ msg: error.message })               
        }else if (project.creator.toString() !== req.user._id.toString()){
            const error = new Error("Invalid action!")
            return res.status(400).json({msg:error.message})
        }
        
        //Delete
        const deletedInfo = await Project.deleteOne({_id:id})        
        //Response eg: { acknowledged: true, deletedCount: 1 }
        res.json({msg:`Project -${project.name}- deleted`})

    } catch (error) {
        console.log(`Deleting project with id ${id} - Error: ${error.message}`)
        res.status(400).json({ msg: "Error Deleting project"})   
    }   
}

//Other functions
const findCollaborator = async (req, res) => {
    
    const { email } = req.body    
    
    try {

        const user = await User.findOne({email:email}).select("_id email name")
        if (!user) {
            const error = new Error("Email address not found!")
            return res.status(404).json({ msg: error.message })               
        }
        
        res.json(user)

    } catch (error) {
        console.log(`Finding user with email ${email} - Error: ${error.message}`)
        res.status(400).json({ msg: "Error finding user"})   
    }  
}

const addCollaborator = async (req, res) => { //post
    
    const { id } = req.params   
    const {email} = req.body
    
    try {
        const project = await Project.findById(id)        
        if (!project) {
            const error = new Error("Project not found!")
            return res.status(404).json({ msg: error.message })               
        }else if (project.creator.toString() !== req.user._id.toString()){
            const error = new Error("Invalid action!")
            return res.status(400).json({msg:error.message})
        }
        
        const user = await User.findOne({email:email}).select("_id")
        if (!user) {
            const error = new Error("Email address not found!")
            return res.status(404).json({ msg: error.message })               
        }

        if (project.creator.toString() === user._id.toString()){
            const error = new Error("Creator of the project cannot be added as a collaborator")
            return res.status(400).json({ msg: error.message })               
        }

        if (project.collaborators.includes(user._id)){
            const error = new Error("Selected user is already a collaborator of the project")
            return res.status(400).json({ msg: error.message })               
        }

        //Ready!
        project.collaborators.push(user._id)
        await project.save()
        res.json({msg:"Collaborator successfully added to the project"})

    } catch (error) {
        console.log(`Adding collaborator ${email} to project ${id} - Error: ${error.message}`)
        res.status(400).json({ msg: "Error adding collaborator to project"})   
    } 
}

const removeCollaborator = async (req, res) => {

    const { id: idProject } = req.params    
    const { id: idCollaborator } = req.body

    try {
        const project = await Project.findById(idProject)        
        if (!project) {
            const error = new Error("Project not found!")
            return res.status(404).json({ msg: error.message })               
        }else if (project.creator.toString() !== req.user._id.toString()){
            const error = new Error("Invalid action!")
            return res.status(400).json({msg:error.message})
        }
 
        //Ready!
        project.collaborators.pull(idCollaborator)
        await project.save()
        res.json({msg:"Collaborator successfully removed from project"})

    } catch (error) {
        console.log(`Removing collaborator ${email} from project ${id} - Error: ${error.message}`)
        res.status(400).json({ msg: "Error removing collaborator from project"})   
    }     

}


export { createProject, getProjects, getProject, updateProject, deleteProject, findCollaborator, addCollaborator, removeCollaborator }