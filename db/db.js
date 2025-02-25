const { Blogmodel, Commentmodel } = require("../models/mainModel");
const mongoose = require("mongoose");

class dbfunc{

    

   // Get all blogs
    async getAllBlogs() {
        try {
            return await Blogmodel.find();
        } catch (error) {
            throw new Error("Error retrieving blogs: ");
        }
    }
    
    // Get a single blog by ID
    async getBlogById(blogId) {
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            throw new Error("Invalid Blog ID format");
        }
        try {
            return await Blogmodel.findById(blogId);
        } catch (error) {
            throw new Error("Error retrieving blog: ");
        }
    }
    
    // Add a new blog
    async addBlog(blogData) {
        try {
            const newBlog = new Blogmodel(blogData);
            return await newBlog.save();
        } catch (error) {
            throw new Error("Error adding blog: ",error.message);
        }
    }

    // Update a blog by ID
    async updateBlogById(blogId, updateData) {
    try {
        return await Blogmodel.findByIdAndUpdate(blogId, updateData, { new: true });
    } catch (error) {
        throw new Error("Error updating blog: ");
    }
    }

    // Delete a blog by ID
    async deleteBlogById(blogId) {
    try {
        return await Blogmodel.findByIdAndDelete(blogId);
    } catch (error) {
        throw new Error("Error deleting blog: ");
    }
    }



    // Get all comments of a blog by blog ID
    async getCommentsByBlogId(blogId) {
    try {
        return await Commentmodel.find({ blogId });
    } catch (error) {
        throw new Error("Error retrieving comments: ");
    }
    }

    // Add a new comment
    async addComment(commentData) {
    try {
        const newComment = new Commentmodel(commentData);
        return await newComment.save();
    } catch (error) {
        throw new Error("Error adding comment: " );
    }
    }    

    // Update a comment by ID
    async updateCommentById(commentId, updateData) {
    try {
        return await Commentmodel.findByIdAndUpdate(commentId, updateData, { new: true });
    } catch (error) {
        throw new Error("Error updating comment: ");
    }
    }

    // Delete a comment by ID
    async deleteCommentById(commentId) {
    try {
        return await Commentmodel.findByIdAndDelete(commentId);
    } catch (error) {
        throw new Error("Error deleting comment: ");
    }
    }
}

module.exports = new dbfunc();
