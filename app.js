const express       = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        expressSanitizer = require("express-sanitizer"),
        methodOverride = require("method-override"),
        port = process.env.PORT || 3000;
        ;
      
//App cong
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))
mongoose.connect("mongodb+srv://muku:muku123@myblog-ac2ir.mongodb.net/test?retryWrites=true",
{ useNewUrlParser: true }, 
        function(err){
            if(err){
                console.log(err)
        } else {
                console.log("Database connection successful")  
        }
});

//Mongoose model config 
let blogSchema = new mongoose.Schema({
        title: String,
        image: String,
        body: String,
        created: {type:Date, default: Date.now }
});
const Blog = mongoose.model("Blog",blogSchema)

// Blog.create({
//   title: "Test information" ,
//   image:"https://farm9.staticflickr.com/8002/7299820870_e78782c078.jpg",
//   body:"Hello This is post blog"
// });

//RESTful ROUTES

//landing page
app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

//all information INDEX ROUTE
app.get("/blogs", (req, res)=>{
     Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index", {blogs: blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

//SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id, function(err, aBlog){
        if(err){
            res.render("/blogs");
        }else{
            res.render("show", {blog:aBlog});
        }
    });
});

//CREATE ROUTE
app.post("/blogs",(req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
         res.render("new");
        }else{
            res.redirect("/blogs");
        }
    })
});

//edit ROUTE
app.get("/blogs/:id/edit",(req, res)=>{
   Blog.findById(req.params.id, function(err, aBlog){
       if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog:aBlog});
        }
   });
});

//UPDATE ROUTE
app.put("/blogs/:id",(req, res)=>{
   Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updateBlog){
       if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
   });
});

//  DELETE ROUTE
app.delete("/blogs/:id",(req, res)=>{
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(port, function(){
console.log("Your server started...." + port);
});