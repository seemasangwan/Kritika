const mongoose=require("mongoose");
const bcryptjs=require("bcryptjs");
const jwt=require("jsonwebtoken");
const customerschema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

customerschema.methods.generateAuthToken=async function(){
  try{
const token= jwt.sign({_id:this._id.toString()},"iamdbofcustomerfromflikartandamzon");
this.tokens=this.tokens.concat({token:token});
await this.save();
return token;
  }
  catch(error){
res.send("error is occur"+error);
  } 
};
customerschema.pre("save",async function(next){
    if(this.isModified("password")){
this.password= await bcryptjs.hash(this.password,10);
this.confirmpassword=await bcryptjs.hash(this.confirmpassword,10);
}
next();
});
// now we need to creater collection
const Register= new  mongoose.model("Register",customerschema);
module.exports=Register;