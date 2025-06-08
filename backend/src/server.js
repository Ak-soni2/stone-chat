// import express from 'express'; // is a web framework for Node.js that simplifies the process of building web applications and APIs.
// import authRoutes from './routes/auth.routes.js';
// import "dotenv/config"; // This line imports the dotenv package and immediately invokes its config method to load environment variables from a .env file into process.env.
// // The dotenv package is commonly used to manage configuration settings and sensitive information, such as API keys and database connection strings, in a secure manner.
// import { connectDB } from './db/db.js'; // This line imports the connectDB function from the db.js file located in the db directory.
// // The connectDB function is responsible for establishing a connection to the MongoDB database using Mongoose, a popular ODM (Object Data Modeling) library for MongoDB and Node.js.
// import cookieParser from 'cookie-parser'; // This line imports the cookie-parser middleware, which is used to parse cookies attached to the client request object.
// import userRoutes from './routes/user.routes.js'; // This line imports the userRoutes router from the user.routes.js file located in the routes directory.
// import chatRoutes from './routes/chat.routes.js'; // This line imports the chatRoutes router from the chat.routes.js file located in the routes directory.

// const app = express();
// const PORT = process.env.PORT|| 5000; // The PORT variable is set to the value of the environment variable PORT, or defaults to 5000 if not set.

// app.use(express.json()); // This line tells the Express application to use the built-in JSON middleware, which parses incoming JSON requests and makes the parsed data available in req.body.
// app.use(cookieParser()); // This line tells the Express application to use the cookie-parser middleware, which parses cookies attached to the client request object.
// app.use('/api/auth',authRoutes);
// app.use('/api/user',userRoutes); // This line mounts the authRoutes router on the /api/auth path, meaning that all routes defined in authRoutes will be prefixed with /api/auth.
// app.use('/api/chat',chatRoutes); // This line mounts the userRoutes router on the /api/user path, meaning that all routes defined in userRoutes will be prefixed with /api/user.

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     connectDB();
// });

import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import { connectDB } from "./db/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // allow frontend to send cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});