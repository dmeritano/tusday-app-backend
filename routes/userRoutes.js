import express from "express"
import { register, authenticate, confirm, reset, validateToken, updatePassword, profile } from "../controllers/userController.js"
import checkAuth from "../middleware/checkAuth.js"
const router = express.Router()


//User Registration, Authentication and Confirmation
router.post("/", register)
router.post("/login", authenticate)
router.get("/confirm/:token", confirm)
router.post("/reset-password",reset)
router.route("/reset-password/:token")
        .get(validateToken)
        .post(updatePassword)

//Protected routes - Using middleware
router.get("/profile", checkAuth, profile)


export default router


