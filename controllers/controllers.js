const upload = require('../multer');
const cloudinary = require('../cloudinary');
const fs = require('fs');
const dbfunc = require('../db/db');

async function uploadImage(req){
  if (!req.file){
    throw new Error("No image uploaded");
  }
    
  console.log("uploading image to cloudinary")
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "Blog Project",
    resource_type: "auto" // Cloudinary folder
  })
  console.log(result)
  if(!result) throw new Error("cloudinary upload failed" )
  fs.unlinkSync(req.file.path)
  return result.secure_url;
}



exports.createBlog = async(req,res)=>{
    try {
      const url = await uploadImage(req);
      console.log(req.body);
      const newblog = {
        title: req.body.title,
        imageurl : url,
        content: req.body.content,
        userId: req.user.userId,
        likes: 0,
        // category : req.body.category,
        views: 0,
      }

      const blog = await dbfunc.addBlog(newblog);
      console.log(blog);
      return res.status(201).json(blog);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
}

exports.getBlogs = async(req,res)=>{
  try{
    const blogs = await dbfunc.getAllBlogs();
    //if(blogs.length==0) return res.status(400).json({error:"No blogs present"})
    return res.status(200).json(blogs);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:err.message});
  }
}

exports.getUserBlogs = async(req,res)=>{
  try{
    const blogs = await dbfunc.getBlogsByUser(req.params.id);
    if(blogs.length==0) return res.status(400).json({message:"No blogs present"})
    return res.status(200).json(blogs);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:err.message});
  }
}

exports.getBlog=async(req,res)=>{
  try{
    const blog = await dbfunc.getBlogById(req.params.id);
    if(!blog) return res.status(404).json({message:"No such Blog exists"});
    return res.status(200).json(blog);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:err.message});
  }
}

exports.updateBlog=async(req,res)=>{
  try{
    const blog = await dbfunc.updateBlogById(req.params.id,req.body);
    return res.status(200).json(blog);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:err.message});
  }
}

exports.updateBlogImg=async(req,res)=>{
  try{
    const url = await uploadImage(req);
    const blog = await dbfunc.updateBlogById(req.params.id,{imageurl:url});
    return res.status(200).json(blog);
  }catch(err){
    console.error(err);
    return res.status(500).json({message: err.message});
  }
}

function getPublicId(url) {
  const parts = url.split("/");
  return parts.slice(-2).join("/").replace(/\.[^/.]+$/, ""); // Removes file extension
}

exports.delBlog=async(req,res)=>{
  try{
    const blog = await dbfunc.deleteBlogById(req.params.id);
    const publicId = getPublicId(blog.imageurl);
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" })
    console.log(result);
    return res.status(200).json(blog);
  }catch(err){
    console.error(err);
    return res.status(500).json({message: err.message});
  }
}

exports.getComments = async(req,res)=>{
  try{
    const comments = await dbfunc.getCommentsByBlogId(req.params.id);
    return res.status(200).json(comments);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:err.message});
  }
}

exports.createComment = async(req,res)=>{
  try{
    const comment = await dbfunc.addComment({...req.body,userId:req.user.userId,blogId:req.params.id});
    return res.status(200).json(comment);
  }catch(err){
    console.error(err);
    return res.status(500).json({message:err.message});
  }
}

exports.updateComment = async(req,res)=>{
  try{
    const comment = await dbfunc.updateCommentById(req.params.id1,req.body);
    return res.status(200).json(comment);
  }catch(error){
    console.log(error);
    return res.status(500).json({message:error.message});
  }
}

exports.delComment = async(req,res)=>{
  try{
    const comment = await dbfunc.deleteCommentById(req.params.id1);
    return res.status(200).json(comment);
  }catch(error){
    console.log(error);
    return res.status(500).json({message:error.message});
  }
}