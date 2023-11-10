const express = require('express');
const router = express.Router();
const multer = require("multer")
const Blog = require('../Models/blog');
// const User = require('../Models/users');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+Date.now()+file.originalname)
    },
});

var upload = multer({
    storage:storage,
}).single('uploadPicture')


router.get("/", (req, res)=>{

    res.render("index", {title:"HOME"} )

})

router.get('/blogs', (req, res)=>{
    Blog.find()
    .then((result)=>{
        res.render("blog", {title:"Blogs", blogs: result })
    }).catch((err)=>{
        console.log(err)
    })

});
// about blog

router.get('/about', (req, res)=>{
    res.render('about', {title: "About"})
 });
 


//create new blog
router.get("/create", (req, res) =>{
    res.render("addpost", {title:"Create Post"});
})


router.post("/create", upload , function(req, res){
    const blog = new Blog({
        title: req.body.title,
        body: req.body.body,
        Image:req.file.filename
    });

    blog.save()
    .then((result)=> {
        res.redirect("/");

    })
    .catch((err) => {
        console.log(err)
    })
})

//single page

router.get("/:id", function(req, res){
    const Id = req.params.id;
 
    Blog.findById(Id)
    .then((result)=>{
     console.log(result)
     res.render("details", {title: "About", blogs: result})
    }) 
    .catch((err) =>{
     console.log(err)
    });
 
 });
 
 
 //Delete post
 router.post("/delete/:id", (req, res)=>{
     const Id = req.params.id;
     Blog.findByIdAndDelete(Id)
     .then((result)=>{
     }).catch((err) =>{
         console.log(err)
     }).finally(()=>{
         res.redirect("/")
     })
 
 });
 
 
 //updatepost
 router.get("/edit/:id", function(req, res){
     const Id = req.params.id;
     console.log(Id)
     Blog.findByIdAndUpdate(Id)
     .then((result)=>{
         // console.log(result)
         res.render('edit',{blogs : result , title :"Update"})
     }).catch((error)=>console.log(error))
     
 });





module.exports = router