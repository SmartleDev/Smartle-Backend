import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/config"
import trialRouter from "./routes/routeTrial"
import studentRouter from './routes/studentRoutes';
import coursesRouter from './routes/coursesRoutes';
import parentRouter from './routes/parentRoutes';
import authRoutes from './routes/authRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import courseProgressRoutes from './routes/courseProgressRoutes';

const app = express()
dotenv.config()

app.use(express.json({limit : "30mb"}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors())

db.connect((err : any) => {
  if(err) console.log(err);
  console.log(`MYSQL Database connected`);
})

// app.use(MainRouters)
app.use('/trial', trialRouter);
app.use('/', studentRouter);
app.use('/', coursesRouter);
app.use('/', parentRouter);
app.use('/', authRoutes);
app.use('/', enrollmentRoutes);
app.use('/', courseProgressRoutes);

app.get("/", (req: Request, res: Response): void => {
  res.json({ message: "Smartle Backend" });
});

app.listen("8000", (): void => {
  console.log("Server Running!");
});