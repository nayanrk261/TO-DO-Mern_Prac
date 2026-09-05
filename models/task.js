const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 20
    },
    description : {
        type : String,
        required : true,
        minlength : 3,
        maxlength : 100
    },
    completed : {
        type : Boolean,
        default : false
    },
    user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
       required: true
    }
})

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;