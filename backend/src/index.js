import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import vuRouter from "./routes/verifyUser/route.js";


const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

app.use("/api", vuRouter);



const PORT = process.env.PORT || 8080


app.get("/health", (req, res)=>{
    console.log("Health check");
    res.json({ status: "OK", message: "Server is running" });
});

app.get("/", (req, res)=>{
    console.log("Hello World");
    res.json({ message: "Hello World from Novilized API" });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})