const mongoose=require('mongoose');
const productschema=new mongoose.Schema({
    title:
    {
type:String,
required:true,
index:true
    },
    description:
    {
        type:String,
        required:true
    },
    category:
    {
        type:String,
        required:true
    },
    price:{
     type:Number,
     required:true
    },
    imageUrl: {
        type: String,  // Assuming storing image URL
        required: true
    }
    
});
// Create a text index on the title field

const Product= new  mongoose.model("Product",productschema);
module.exports=Product;