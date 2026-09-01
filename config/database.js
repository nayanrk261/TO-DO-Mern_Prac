const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://nayankhandelwal261_db_user:MsFKqbEWMrf1fmMD@cluster0.lrty2pu.mongodb.net/?appName=Cluster0"
    );
};

module.exports = connectDB;

    