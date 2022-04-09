import express from "express"
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  findCollaborator,
  addCollaborator,
  removeCollaborator,
} from "../controllers/projectController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()

router.route("/").get(checkAuth, getProjects).post(checkAuth, createProject)

router
  .route("/:id")
  .get(checkAuth, getProject)
  .put(checkAuth, updateProject)
  .delete(checkAuth, deleteProject)

router.post("/collaborators", checkAuth, findCollaborator)
router.post("/collaborators/:id", checkAuth, addCollaborator)
router.post("/delete-collaborator/:id", checkAuth, removeCollaborator) 

export default router
