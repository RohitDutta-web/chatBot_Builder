import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { dbConnect } from "./config/db.js";
import logRouter from "./routes/log.routes.js";
import chatFlowRouter from "./routes/chatFlow.routes.js";
dotenv.config();


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));


//chatflow router
app.use("/chatFlow", chatFlowRouter);
app.use("/logs", logRouter);


app.listen(process.env.PORT, () => {
  dbConnect();
  console.log("Server is live")

})