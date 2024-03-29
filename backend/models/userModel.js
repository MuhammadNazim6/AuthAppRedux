import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
  name:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required: true,
    unique:true
  },
  password:{
    type:String,
    required: true,
  },
  isBlocked:{
    type: Boolean,
    required: true,
    default: false
  },
  mobile: {
    type: Number,
    require: true,
  },
  profile:{
    type:String,
    require:true
  }
},
{
  timestamps:true
}
)

userSchema.pre('save',async function(next){
  if(!this.isModified('password')){
    next()
  }else{
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
  }
})

userSchema.methods.matchPassword = async function (enteredPassWord ){
  return bcrypt.compare(enteredPassWord,this.password)
}


const User = mongoose.model('User',userSchema)

export default User