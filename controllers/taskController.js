import mongoose from "mongoose"
import Project from "../models/Project.js"
import Task from "../models/Task.js"

//Create
const addTask = async (req, res) => {
  const { project: projectId } = req.body //project id

  try {
    const isValidId = mongoose.Types.ObjectId.isValid(projectId)
    if (!isValidId) {
      throw new Error("MongoDB _id is invalid")
    }

    const projectFound = await Project.findById(projectId)
    if (!projectFound) {
      const error = new Error("Project not found!")
      return res.status(404).json({ msg: error.message })
    } else if (projectFound.creator.toString() !== req.user._id.toString()) {
      const error = new Error("User does not have permissions to add tasks!")
      return res.status(403).json({ msg: error.message })
    }

    //Great! Add task
    const storedTask = await Task.create(req.body)
    //Set Task ID in Project
    projectFound.tasks.push(storedTask._id)
    await projectFound.save()

    res.json(storedTask)
  } catch (error) {
    console.log(`Adding task to project with id ${projectId} - Error: ${error.message}`)
    res.status(400).json({ msg: "Error adding task to project!" })
  }
}

//Update
const updateTask = async (req, res) => {
  const { id } = req.params
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) {
      throw new Error("MongoDB _id is invalid")
    }
    const task = await Task.findById(id).populate("project").populate("completedBy")
    if (!task) {
      const error = new Error("Task not found!")
      return res.status(404).json({ msg: error.message })
    } else if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Invalid action!")
      return res.status(403).json({ msg: error.message })
    }

    //Update
    task.name = req.body.name || task.name
    task.description = req.body.description || task.description
    task.priority = req.body.priority || task.priority
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate
    const updated = await task.save()
    res.json(updated)
  } catch (error) {
    console.log(`Updating task with id ${id} - Error: ${error.message}`)
    res.status(400).json({ msg: "Error Updating task" })
  }
}

//Read
const getTask = async (req, res) => {
  const { id } = req.params
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) {
      throw new Error("MongoDB _id is invalid")
    }
    const task = await Task.findById(id).populate("project")
    if (!task) {
      const error = new Error("Task not found!")
      return res.status(404).json({ msg: error.message })
    }

    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Invalid action!")
      return res.status(403).json({ msg: error.message })
    }
    res.json(task)
  } catch (error) {
    console.log(`Getting task with id ${id} - Error: ${error.message}`)
    res.status(400).json({ msg: "Error getting task" })
  }
}

//Delete
const deleteTask = async (req, res) => {
  const { id } = req.params
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) {
      throw new Error("MongoDB _id is invalid")
    }
    const task = await Task.findById(id).populate("project")
    if (!task) {
      const error = new Error("Task not found!")
      return res.status(404).json({ msg: error.message })
    } else if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("Invalid action!")
      return res.status(403).json({ msg: error.message })
    }
    //Delete
    const project = await Project.findById(task.project)
    project.tasks.pull(task._id)
    await Promise.allSettled([await project.save(), await task.deleteOne()])
    res.json({ msg: `Task -${task.name}- deleted` })
  } catch (error) {
    console.log(`Deleting Task with id ${id} - Error: ${error.message}`)
    res.status(400).json({ msg: "Error Deleting task" })
  }
}

//Other functions
const changeStatus = async (req, res) => {
  const { id } = req.params
  try {
    const isValidId = mongoose.Types.ObjectId.isValid(id)
    if (!isValidId) {
      throw new Error("MongoDB _id is invalid")
    }

    const task = await Task.findById(id).populate("project")
    if (!task) {
      const error = new Error("Task not found!")
      return res.status(404).json({ msg: error.message })
    } else if (
      task.project.creator.toString() !== req.user._id.toString() &&
      !task.project.collaborators.some( (c) => c._id.toString() === req.user._id.toString())) 
    {
      const error = new Error("Invalid action!")
      return res.status(400).json({ msg: error.message })
    }

    //Change
    task.completed = !task.completed
    task.completedBy = req.user._id
    await task.save()

    const updated = await Task.findById(id).populate("project").populate("completedBy")

    res.json(updated)
    
  } catch (error) {
    console.log(`Change status of task with id ${id} - Error: ${error.message}`)
    res.status(400).json({ msg: "Error changing status of task" })
  }
}

export { addTask, updateTask, getTask, deleteTask, changeStatus }
