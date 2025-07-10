import dotenv from "dotenv"
import connectDB from "./config/db.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 8003

connectDB()
.then(() => {
    app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚙️ Server is running at port : ${PORT}`);
});
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})
