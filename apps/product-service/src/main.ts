import express from 'express';
import cors from 'cors';
// // Global handlers to avoid process exit on unhandled promise rejections / exceptions
// process.on('unhandledRejection', (reason) => {
//     console.error('Unhandled Rejection at:', reason);
// });
// process.on('uncaughtException', (err) => {
//     console.error('Uncaught Exception thrown:', err);
// });
// Use a relative path for the local workspace package so webpack can resolve it reliably
import { errorMiddleware } from '../../../packages/error-handler/error-middleware';
import cookieParser from 'cookie-parser';
// import swaggerUi from "swagger-ui-express"
// const swaggerDocument = require('./swagger-output.json');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ 'message': 'Hello API' });
});

// Swagger Documentation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get("/docs-json", (req, res) => {
//     res.json(swaggerDocument);
// });

// Routes 
// app.use('/api', router);

app.use(errorMiddleware);

const port = process.env.PORT || 6002;
const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});