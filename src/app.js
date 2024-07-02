const express=require('express')
const path=require('path');
const hbs=require('hbs');
require('./db/conn');
const Register=require('./models/registers');
const Product=require('./models/products');
const bcryptjs=require('bcryptjs')
const jwt=require("jsonwebtoken");
const app=express();
const port=process.env.PORT||3000;
const static_path=path.join(__dirname,"../public");
// check .html file  and show it static website
app.use(express.static(static_path));
//
const templates_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.set("view engine","hbs")
app.set("views",templates_path);
hbs.registerPartials(partials_path);
app.use(express.json());
// to get data from form page
app.use(express.urlencoded({extended:false}));
app.get('/',(req,res)=>
{
    res.render("hero");
})
app.get('/category',(req,res)=>{
    res.render('categories')
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/contact',(req,res)=>{
    res.render('contact')
})
app.get('/shop',(req,res)=>{
    res.render('shop')
})
app.get('/login',(req,res)=>{
    res.render("login")
})
app.get('/sellitem',(req,res)=>{
    res.render("sellitem")
})
app.get('/signup',(req,res)=>{
    res.render("register")
})
app.get('/category/jewelry',(req,res)=>{
    res.render('jewelrys')
})
app.get('/category/home-decor',(req,res)=>{
    res.render('homedecors')
})
app.get('/category/art-crafts',(req,res)=>{
    res.render('artcrafts')
})
app.get('/category/clay',(req,res)=>{
    res.render('clay')
})
app.get('/category/painting',(req,res)=>{
    res.render('painting')
})
app.get('/category/ceramics',(req,res)=>{
    res.render('ceramics')
})
/* *************REGISTRATION************* */
app.post('/signup',async(req,res)=>{
    try{
       const password=req.body.password;
       const confirmpassword=req.body.confirmpassword;
       if(password===confirmpassword)
        {
          const registercustomer=new Register({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword

          });
  
            /**Middle ware to generate token */
          // generateAuthToken defined in register.js
          const token= await registercustomer.generateAuthToken();
          /**middle ware hash the password  in model register.js file  */
            await registercustomer.save();
                  
         res.status(201).render("hero");
        }
        else
        {
            res.send("Invalid Login Details");
        }
    }  
    catch(err){
      res.status(400).send("yahan error h");
    }
});

/****************LOGIN VALIDDATION**************** */
app.post('/login',async(req,res)=>{
    try{
        
       const email=req.body.email;
       const password=req.body.password;
      const useremail= await Register.findOne({email:email});
      if(useremail){
        
        const ismatch=await bcryptjs.compare(password,useremail.password);
        if(ismatch)
        {
            res.status(201).render("hero");
        }
        else
        {
            res.send("Password are not matching");
        }
    }
        else{
            res.send("Email not found");
        }
    }catch(error){
           res.status(400).send("error occur ");
    }
});
/*** sell item send to db */
app.post('/sellitem', async (req, res) => {
    try {
        

        // Create a new product instance using your Product model
        const newProduct = new Product({
            title:req.body.title,
            description:req.body.description,
            category:req.body.category,
            price:req.body.price,
            imageUrl:req.body.imageUrl
        });

        // Save the product to the database
        await newProduct.save();

        // Redirect to a success page or home page
        res.status(201).render("hero");// Redirect to home page or another relevant page
    } catch (err) {
        console.error('Error submitting product:', err);
        res.status(500).send('Error submitting product');
    }
});
/** Search products */
app.get('/search',async (req,res)=>{
    const query=req.query.query;
    Product.find({$text:{$search:query}}).then(
        products=>{
            res.render('searchresult',{products});
        }
    ).catch(err=>{
        res.status(400).send("not found");
    })
})

/********************AUTHENTICATION***************************** */
app.listen(port,()=>
{
  console.log(`listening at port ${port}`)
});