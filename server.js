require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const Task = require("./models/task");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/auth");

const app = express();
app.use(express.json());

// app.get("/app",(req,res) => {
//     res.send("Server started");
// })

// app.get("/hello",(req,res) => {
//     res.send("hello world");
// })

// app.get("/about",(req,res) => {
//     res.send("this is about page");
// })

app.get("/user/:name", authMiddleware, (req, res) => {
    const username = req.params.name;
    const age = req.query.age;
    const city = req.query.city;

    res.send(`username is ${username}, age is ${age}, city is ${city}`);
});

// app.post("/test",(req,res) => {
//     res.send("testing the route");
// })

app.post("/api/tasks",authMiddleware,async (req,res) => {
    try{
        const newTask = await Task.create({
            title : req.body.title,
            description : req.body.description,
            completed : req.body.completed,
            user : req.user.id
        })
        res.status(201).json(newTask);
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
})

app.get("/api/tasks",authMiddleware, async(req,res) => {
    try{
        const task = await Task.find({user: req.user.id});
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).send({error : error.message});
    }
})

app.get("/api/tasks/:id",authMiddleware, async(req,res) => {
    try{
        const id = req.params.id;
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        if(task.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to access this task" });
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})

app.put("/api/tasks/:id",authMiddleware, async (req,res) => {
    try{
        const id = req.params.id;
        const update = req.body;
        const existingtask = await Task.findById(id);
        if(!existingtask){
            return res.status(404).json({error: "Task not found"});
        }
        if(existingtask.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to access this task" });
        }
        const updatedtask = await Task.findByIdAndUpdate(id,update,{
            new : true,
            runValidators : true
        });
        res.status(200).json(updatedtask);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})

app.delete("/api/tasks/:id",authMiddleware, async(req,res) => {
    try{
        const id = req.params.id;
        const existingtask = await Task.findById(id);
        if(!existingtask){
            return res.status(404).json({error : "Task not found"});
        }
        if(existingtask.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Not authorized to access this task" });
        }
        const deletedTask = await Task.findByIdAndDelete(id);
        res.status(200).json(deletedTask);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})

app.post("/api/auth/register", async (req,res) => {
    try{
        const {name, email, password} = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password,salt);
        console.log(hashedpassword);

        const newUser = await User.create({
            name,
            email,
            password : hashedpassword
        });

        res.status(201).json({
            _id : newUser._id,
            name : newUser.name,
            email : newUser.email
        });

    }
    catch(error){
        if(error.code === 11000){
            return res.status(400).json({error : "Email Already registered"});
        }
        res.status(500).json({error : error.message});
    }
})

app.post("/api/auth/login", async (req,res) => {
    try{
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error : "Invalid Email or Password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({error: "invalid email or password"});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({
            token,
            _id : user._id,
            name : user.name,
            email : user.email
        });
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})

const startServer = async () => {
    try{
        await connectDB();
        console.log("database connected");
        app.listen(process.env.PORT, () => {
        console.log("server...");
        })
    }
    catch(error){
        console.log(error);
    }
};

startServer();
