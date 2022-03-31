import express from "express"
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
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

router.post("/add-collaborator", checkAuth, addCollaborator)
router.post("/remove-collaborator", checkAuth, removeCollaborator) // using "post" beacause "delete" it used for eliminate a whole resource, not part of it.

export default router
