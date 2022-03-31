import jwt from "jsonwebtoken"
import User from "../models/User.js"

const checkAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1]
            
            const verifiedToken = 
                jwt.verify(token,process.env.JWT_SECRET) // verify() throws exception with invalid tokens                                    
            //Adding variables to request
            //const dbUser = await User.findById(verifiedToken.id).select("-password -__v -confirmed -token -createdAt -updatedAt")
            const dbUser = await User.findById(verifiedToken.id).select("_id name email")            
            req.user = dbUser

            //Jump to next step, after this middleware
            return next()
        }
        else{
            console.log("Invalid token!")
            const error = new Error("Invalid token!")
            return res.status(401).json({msg:error.message})
            
        }
    } catch (error) {
        console.log("checkAuth fn error: " + error.message)
        return res.status(404).json({msg:"An error occurred in token verification"})
    }

    next()
   
    

}

export default checkAuth