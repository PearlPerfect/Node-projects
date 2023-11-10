const PORT = 8000;
const express = require("express");
const ejs = require ("ejs");
const path = require("path");
const bodyParser = require("body-parser");
const { body, validationResult, checkSchema, matchedData } = require("express-validator");
const session = require("express-session");





const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static("static-Folder"))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "Views"));



//default route ...get
app.get('', function (req, res) {
    let err = " ";
    const data = "";
    const session = req.session
    res.render("login", { err, data });

});

app.use(session({
    secret: "SECRET",
cookie:{
    name:"sid",
},
// user:{}
}));
const schmea = {
    USERNAME: { 
        trim: true, 
        isAlpha: {
             options: ['en-US', { ignore: [" "] }], 
             errorMessage: '**Number Input Not Needed**' } },
    PASSWORD: {trim: true, 
        isStrongPassword: { 
        errorMessage: '**Must contain Upper and lowercases with Number and Special Character**' } },
}
//default route ...post
app.post("", checkSchema(schmea),
       function (req, res) {
        const result = validationResult(req);
        const Error = result.errors
        const details = require("./data.json");
        let err = {};
        

        Error.forEach(item => {
            err[item.path] = item.msg
        });
        const data = req.body;
        const x = matchedData(req);
        req.session.user = {
            Username: data.USERNAME,
            time : new Date().toLocaleString(),
        };
         const session = req.session;
         const user = {}
          user.Username = data.USERNAME;
          user.time = new Date().toLocaleDateString();
          session.user = user;
         console.log(result.isEmpty(), x)
         
        if (result.isEmpty()) {
             return res.redirect('dashboard')
           
        }

        res.render("login", { err, data });



    })

//sign up 

app.get('/signup', function (req, res) {
    let err = " "
    const data = " "
    res.render("signup", { err, data })
})

app.post("/signup",

    body("FIRSTNAME").trim().isAlpha().withMessage("** Input Correct Name**"),
    body("USERNAME").trim().isAlphanumeric().withMessage("** Choose  A UserName **"),
    body("EMAIL").trim().isEmail().withMessage("**Use A Valid Email**"),
    body("PASSWORD").trim().isStrongPassword().withMessage("** **Must contain Upper and lowercases with Numbers and Special Characters** **"),


    function (req, res) {
        const result = validationResult(req);
        const Error = result.errors
        let err = {}
        Error.forEach(item => {
            err[item.path] = item.msg
        });
        const data = req.body;

        if (result.isEmpty()) {
            res.redirect("login")
        }

        else {
            res.render("signup", { err, data });
           
        }


    });


    app.get("/dashboard", function(req, res){
            const details = require("./data.json");
            const result = details.results

            const session = req.session.user;
        
           
                res.render("dashboard", {result, session})
    });

      //get addtoblog
      
      app.get("/addPost", function(req, res){
        const eachPost = new Blog({
            title:"new post",
            body: "It is about to go down"
        });


        eachPost.save().then((result)=>{
                    res.send(result)
        }).catch((err)=>{
            console.log(err)
        });
        let err = " "
        const data = " "
        res.render("addPost", {err, data})
      })
  //post addtoblog

  app.post("/addPost", function(req, res){
    let err = " "
    const data = " "
    res.render("addPost", {err, data})
  })


  //getAllBlogPost

  app.get("/allPost", function(req, res){
    
    Blog.find()
    .then((results)=>{
        res.send(results)
    })
    .catch((err)=>{
        console.log(err)
    })

  });


  //getSingleblogPost
  app.get("/singlepage", (req, res)=>{
    Blog.findById()
    .then(()=>{})
    .catch(()=>{})
  }); 
      //singlePage
    app.get("/:id", function(req, res){
        const data = require("./data.json");
        const ID = req.params.id;
        
     let itemOnDisplay = data.results.find((items)=>{
            return items.id == ID;
        });

        if(itemOnDisplay){
            res.render("singlepage", itemOnDisplay)
        }

        else{
            res.status(404).send( "OOPS! page not found")
        }
        
    })

  
app.listen(PORT, function () {
    console.log(`Server is up on port: ${PORT}`)
})