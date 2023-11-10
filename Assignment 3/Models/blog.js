const mongoose  = require("mongoose");
const Schema = mongoose.Schema;


const blogSchema = new Schema({
    title: {type: String,
        require: true},
    body : {type: String,
            require: true}, 
    Image:{type: String,
            require: false},
    
  },{timestamps:true});

  const Blog = mongoose.model('Blog', blogSchema);

  module.exports = Blog;