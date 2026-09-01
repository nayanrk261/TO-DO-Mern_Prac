const express = require("express");
const connectDB = require("./config/database");
const Task = require("./models/task");

const app = express();
app.use(express.json());

app.get("/app",(req,res) => {
    res.send("Server started");
})

app.get("/hello",(req,res) => {
    res.send("hello world");
})

app.get("/about",(req,res) => {
    res.send("this is about page");
})

app.get("/user/:name", (req, res) => {
    const username = req.params.name;
    const age = req.query.age;
    const city = req.query.city;

    res.send(`username is ${username}, age is ${age}, city is ${city}`);
});

app.post("/test",(req,res) => {
    res.send("testing the route");
})

app.post("/api/tasks",async (req,res) => {
    try{
        const newTask = await Task.create({
            title : req.body.title,
            description : req.body.description,
            completed : req.body.completed
        })
        res.status(201).json(newTask);
    }
    catch(error){
        res.status(400).json({error : error.message});
    }
})

app.get("/api/tasks", async(req,res) => {
    try{
        const task = await Task.find({});
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).send({error : error.message});
    }
})

app.get("/api/tasks/:id", async(req,res) => {
    try{
        const id = req.params.id;
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})

app.put("/api/tasks/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const update = req.body;
        const task = await Task.findByIdAndUpdate(id,update,{
            new : true,
            runValidators : true
        });
        if(!task){
            return res.status(404).json({error: "Task not found"});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({error : error.message});
    }
})

app.delete("/api/tasks/:id", async(req,res) => {
    try{
        const id = req.params.id;
        const task = await Task.findByIdAndDelete(id)
        if(!task){
            return res.status(404).json({error : "Task not found"});
        }
        res.status(200).json(task);
    }
    catch(error){
        res.status(500).json({error: error.message});
    }
})










const startServer = async () => {
    try{
        await connectDB();
        console.log("database connected");
        app.listen(3000, () => {
        console.log("server...");
        })
    }
    catch(error){
        console.log(error);
    }
};

startServer();
