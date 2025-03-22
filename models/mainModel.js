const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//user schema

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }

},{timestamps:true});

const Usermodel = mongoose.model('User',userSchema);

//blog schema 

const blogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    imageurl:{
        type:String,
        requires:true,
    },
    content:{
        type:String,
        required:true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    author:{
        type:String,
        required:true,
    },
    likes:{
        type:Number,
        required:true,
    },
    // category:{
    //     type:String,
    //     required:true,
    // },
    views:{
        type:Number,
        required:true,  
    }
},{timestamps:true});

const Blogmodel = mongoose.model('Blog',blogSchema);



//comments schema 

const commentSchema = new Schema({
    content: {
        type:String,
        required:true,
    },
    author: {
        type:String,
        required:true,
    },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" }, 
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },  
},{timestamps:true});

const Commentmodel = mongoose.model('Comment',commentSchema);


module.exports={Usermodel,Blogmodel,Commentmodel};