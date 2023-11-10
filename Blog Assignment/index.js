const PORT = 8001
const express = require("express");
const ejs = require("ejs");



const app = express();

app.set("views", "Templates");
app.set("view engine", "ejs");

app.use("/public", express.static("Asserts"));


app.get("", function(req, res){
    const data = require("./script.json");
    res.render("blog", data);
});




app.get("/:id", function(req, res){
    const data = require("./script.json");
    const result = data.results
   const Id = req.params.id;

   let display = result.find((item)=>{
    
    return item.id == Id;
    

   })

   if(display){
    res.render("details", display)
   }
   
    else{
        res.status(404).send("Not Found")
    }
    
});

app.listen(PORT, function(err){
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
    // console.log("Server Running");
});