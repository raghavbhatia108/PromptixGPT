import express from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';
import communityRoutes from "./routes/community.js";
import authRoutes from "./routes/auth.js";
import statRoutes from './routes/stats.js'

const app =express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use((req, res, next) => {
  console.log(`[Backend Request] ${req.method} ${req.originalUrl}`);
  next();
});

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
    }
    catch(err){
        console.error("MongoDB connection error:", err);
    }
}

app.use('/api', chatRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stats', statRoutes);

// app.post("/test", async (req, res) =>{
//     const options = {
//         method: "POST", 
//         headers:{
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model: "gpt-4o-mini",
//             messages : [{
//                 role: "user",
//                 content: req.body.message
//                 }]
//         })
//     }
//     try{
//        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//        const data =  await response.json();
//        console.log(data.choices[0].message);
//        res.send(data);
//     }
//     catch(error){
//         console.error("Error:", error);
//     }
// })

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})