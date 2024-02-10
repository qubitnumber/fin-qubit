import * as dotenv from 'dotenv';
import config from 'config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import connectDB from './utils/connectDB.js';
import userRouter from './routes/user.js';
import authRouter from './routes/auth.js';
import kpiRoutes from "./routes/kpi.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  credentials: true
}));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

/* ROUTES */
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use("/api/kpi", kpiRoutes);

app.get(
  '/api/healthChecker', (req, res, next) => {
    res.status(200).json({
      status: 'success',
      message: 'Welcome 😂😂👈👈',
    });
  }
);

app.all('*', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

const port = config.util.getEnv('port');
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
  connectDB();
});
