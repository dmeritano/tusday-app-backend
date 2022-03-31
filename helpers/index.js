//Helpers functions
import jwt from "jsonwebtoken"

const generateId = () => {
    const rnd = Math.random().toString(32).substring(2)
    const date = Date.now().toString(32)
    return rnd +  date
}

const generateJWT = (id) => {

    return jwt.sign( { id }, process.env.JWT_SECRET,{ expiresIn:'30d' })

}



export { generateId, generateJWT }