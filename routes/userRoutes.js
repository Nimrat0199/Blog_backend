const express = require('express');
const Routes = express.Router();
const func = require('../controllers/controllers')
const upload = require('../multer');


Routes.get('/userBlogs/:id',func.getUserBlogs);
//Routes.get('/blogs',func.getBlogs)
Routes.post('/blogs',upload.single('file'),func.createBlog)
//Routes.get('/blogs/:id',func.getBlog)
Routes.put('/blogs/:id/img',upload.single('file'),func.updateBlogImg)
Routes.put('/blogs/:id/',func.updateBlog)
Routes.delete('/blogs/:id',func.delBlog)
//Routes.get('/blogs/:id/comments',func.getComments)
Routes.post('/blogs/:id/comments',func.createComment)
Routes.put('/blogs/:id/comments/:id1',func.updateComment)
Routes.delete('/blogs/:id/comments/:id1',func.delComment)
//Routes.post('/search',func.searchBlogs)

module.exports = Routes;