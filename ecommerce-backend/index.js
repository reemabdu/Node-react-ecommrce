const port = 4000;
const express = require ("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require ("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error} = require("console");
const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database Connections With ManogoDB
mongoose.connect("mongodb+srv://rabdu8361:wKbZhsRRacSloF2O@cluster0.ss0lwa3.mongodb.net/e-ecommerce")

//API Creation 
app.get("/",(req,res)=>{
    res.send("Express App is Running ")
   

})

// Image Storage Engine 
const storage = multer.diskStorage({
    destination: './upload/images' ,
    filename:(req,file,cb)=>{
     return cb(null,`${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
    }
 })
const upload =multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images')) 

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })

})

//  Schema For Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    avilable:{
        type:Boolean,
        default:true,
    },
})
app.post('/addproduct',async (req,res)=>{
    const product = new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API For deleting Products
app.post('/removeproduct',async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating API for getting all products
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({});
    console.log("All Producht Fetched");
    res.send(products);
})

//Shema creating for user model 
const User = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        Unique:true,
    },
    password:{
        type:String,
    },
    carData:{
        type:Object,
        default:Date.now,
    }
})


//Creating Endpoint for registering the user
app.post('/signup',async(req,res)=>{
    let check = await User.findOne({email:req.body.email});
    if (check){
        return res.status(4000).json({success:false,error:"existing user found with email addres"})
    }
    let cart = {};
    for (let i = 0; i < 3000; i++) {
      cart[i]=0;
        
    }
    const user = new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        carData:cart,
    })
    await user.save();


    const date ={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(date,'secret_ecom');
    res.json({success:true,token})
})

//Creating endpoint for user login 
app.post('/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email Id"})
    }
})





app.listen(port,(error)=>{
    if (!error) {
        console.log("Server Running On Port" + port)

    }
    else
    {
        console.log("Error : " + error)
    }

})
