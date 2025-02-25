const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const {Usermodel} = require('./models/mainModel');
require('dotenv').config();
const app = express();
const Routes = require('./routes/userRoutes');

const secretKey = "supersecret";

mongoose.connect(process.env.DBURL)
.then((result) =>{ 
  console.log("Connected to MongoDB");
  app.listen(process.env.PORT);
})
.catch(err => console.error("Connection error:", err));

app.use(cookieParser()); 
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(cors({
//   origin: "http://localhost:5173", 
//   credentials: true 
// }));


app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  try{
    // Check if user exists
    const user = await Usermodel.findOne({ username });
    if(user) return res.status(400).json({message:"User already exists"});
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Save user
    const newuser = new Usermodel({username , password: hashedPassword});
    const User =  await newuser.save();
    console.log("signup success");
    res.status(200).json(User);

  }catch(err){
    res.status(500).json({message:err.message});
  }
  
});

// 🔹 LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try{
      
    // Find user
    const user = await Usermodel.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });
    console.log("logging in");
    // Generate JWT
    const token = jwt.sign({username,userId:user._id}, secretKey, { expiresIn: "1h" });

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "Strict", 
      maxAge: 60 * 60 * 1000, 
    });
    res.status(200).json(user);  

  }catch(err){
    res.status(500).json({message:err.message});
  }
});

app.post("/logout", (req, res) => {
  try{
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  
  if (!token) return res.status(401).json({ message: "Login required" });
  
  try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded;
      next();
  } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
  }

};


app.use(verifyToken);


app.use(Routes);


