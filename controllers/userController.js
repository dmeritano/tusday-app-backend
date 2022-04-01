import User from "../models/User.js"
import { generateId, generateJWT, sendEmailUserRegister, sendEmailResetPassword } from "../helpers/index.js"

const register = async (req, res) => {
  try {
    //Duplicate user (by email) treatment
    const { email } = req.body
    const registeredUsr = await User.findOne({ email })
    if (registeredUsr) {
      const error = new Error(
        "Email account already registered"
      )
      return res.status(400).json({ msg: error.message })
    }

    //Create new user
    const user = new User(req.body)
    user.token = generateId()
    await user.save()

    //Confirm email
    sendEmailUserRegister({
      email:user.email,
      name:user.name,
      token:user.token
    })

    res.json({ msg: "Account created successfully. Check your email to activate it" })
  
  } catch (error) {
    console.log(`Error creating user: ${error.message}`)
    res.json({ msg: "User cannot be created" })
  }
}

const authenticate = async (req, res) => {

  try {

    console.log(req.body)
    
    const { email, password } = req.body

    const registeredUsr = await User.findOne({ email }) 
    if (!registeredUsr){
      const error = new Error("User not registerd")
      return res.status(404).json({ msg: error.message })
    }

    if (!registeredUsr.confirmed){
      const error = new Error("User not confirmed")
      return res.status(403).json({ msg: error.message })
    }

    
    if (!await registeredUsr.passwordMatch(password)){
      const error = new Error("Credentials doesn't match")
      return res.status(403).json({ msg: error.message })
    }else{
      return res.json({
        _id : registeredUsr._id,
        name : registeredUsr.name,
        email : registeredUsr.email,
        token: generateJWT(registeredUsr._id)
      })
    }
    
  } catch (error) {
    console.log(`Error authenticating user: ${error.message} User: ${email}`)
    res.json({ msg: "Error authenticating user" })    
  }
}

const confirm = async (req, res) => {
  
  try {

    const { token } = req.params
    const registeredUsr = await User.findOne({ token }) 
    if (!registeredUsr){
      const error = new Error("Invalid token")
      return res.status(403).json({ msg: error.message })
    }

    //Confirming user
    registeredUsr.confirmed = true
    registeredUsr.token = ""

    await registeredUsr.save()

    return res.json({msg:"Account validated!"})

      
  } catch (error) {
    console.log(`Error confirming user account: ${error.message}`)
    res.status(400).json({ msg: "Error confirming user account" })        
  }
}

const reset = async (req, res) => {
  try {
    const { email } = req.body
    const registeredUsr = await User.findOne({ email }) 
    if (!registeredUsr){
      const error = new Error("User not registered")
      return res.status(403).json({ msg: error.message })
    }    
    registeredUsr.token = generateId()
    registeredUsr.save()

    //Send email
    sendEmailResetPassword({
      email:registeredUsr.email,
      name:registeredUsr.name,
      token:registeredUsr.token
    })


    return res.json({msg:"Reset token generated. Check your email for instructions"})
  } catch (error) {
    console.log(`Error reseting user password: ${error.message}`)
    res.status(400).json({ msg: "Error reseting user password" })            
  }
}

const validateToken = async (req, res) => {

  try {
    const { token } = req.params
    const registeredUsr = await User.findOne({ token }) 
    if (!registeredUsr){
      const error = new Error("Invalid token")
      return res.status(404).json({ msg: error.message })
    }
    
    res.json({msg:"Token validated!"})


  } catch (error) {
    console.log(`Error validating token: ${error.message}`)
    res.status(404).json({ msg: "Error validating token" })                
  }
}

const updatePassword = async (req, res) => {

  try {
    const { token } = req.params
    console.log("eq6au19tnt81fviph9lb", token)

    const { password } = req.body
    const registeredUsr = await User.findOne({ token })
    if (!registeredUsr){
      const error = new Error("Invalid token id")
      return res.status(404).json({ msg: error.message })      
    }

    console.log("usuario encontrado por token")
    registeredUsr.password = password
    registeredUsr.token = ""
    registeredUsr.save()
  
    res.json({msg:"Password updated!"})
      
  } catch (error) {
    console.log(`Error updating user password: ${error.message}`)
    res.status(400).json({ msg: "Error updating user password" })                    
  }  
}


const profile = async (req, res) => {
  
  const { user } = req
  res.json(user)
  
}

export { register, authenticate, confirm, reset, validateToken, updatePassword, profile}
