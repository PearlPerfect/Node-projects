const PORT = 8001
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser")
const mongoose  = require("mongoose");
const Blog = require("./Models/blog");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb){
       cb(null, "./Pictures")
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname+Date.now()+file.originalname)
    },
});

var upload = multer({
    storage:storage,
}).single('uploadPicture')



mongoose.connect("mongodb+srv://perfectpearl2030:futurelabs@futurelabsblogsite.xsm2e9p.mongodb.net/", {})
.then(()=> {
    console.log("connection successful");
}).catch(()=>{
    console.log("connection fail")
});




const app = express();

app.set("views", "Templates");
app.set("view engine", "ejs");

app.use("/public", express.static("Asserts"));
app.use("/pictures",express.static("Pictures"))
app.use(bodyParser.urlencoded({ extended: true }));


//get all post
app.get("/", function(req, res){
    Blog.find().sort({updatedAt: 1})
    .then((result)=>{
        res.render('index',{title:"Home", blogs:result})
    })
    .catch((err)=>{
        console.log(err)
    })
});

//create new blog
app.post("/create", upload , function(req, res){
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


//get resquest create new blog
app.get("/create", (req, res) =>{

    res.render("addpost", {title:"Create Post"});
})



//display single page
app.get("/:id", function(req, res){
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
app.post("/delete/:id", (req, res)=>{
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
app.get("/edit/:id", function(req, res){
    const Id = req.params.id;
    console.log(Id)
    Blog.findByIdAndUpdate(Id)
    .then((result)=>{
        // console.log(result)
        res.render('edit',{blogs : result , title :"Update"})
    }).catch((error)=>console.log(error))
    
})



app.post("/edit/:id", function(req, res){
    const Id=  req.params.id ;
    Blog.findByIdAndUpdate(Id,{...req.body},{new:true})
    // const blogs = Blog(req.body);
    // blogs.save()
    .then((result)=>{
   console.log(result)
 
    
    res.render('details', {title: "updated", blogs:result })
    }).catch((error)=>console.log(error))
    // const blogs = req.body;

    // res.render("",{blogs,  title :"Home" })

    // Blog.findById(Id)
    // .then((result)=>{
    //     console.log(result)
    // }).catch((err) =>{
    //     console.log(err)
    // }).finally(()=>{
    //     res.render("details")
    //     // res.redirect("/")
    // })

})
app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
    // console.log("Server Running");
});