const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/Registration").then(()=>{
    console.log("connection successfull")
}).catch((err)=>{
    console.log("connection fail")
});
