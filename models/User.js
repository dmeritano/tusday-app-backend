import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    token:{
        type: String        
    },
    confirmed:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true //created_at & updated_at 
})

//Pre Hook - Middleware - Before saving
userSchema.pre("save", async function(next){

    if (!this.isModified("password")){
        //"this" is the user instance, passed automatically to this function
        //That's why we use function declaration instead arrow function
        next()
    }
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

//Custom method
userSchema.methods.passwordMatch = async function(formPwd) {
    return await bcrypt.compare(formPwd, this.password)
}

const User = mongoose.model("User", userSchema)

export default User


