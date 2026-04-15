import express from "express";
import Thread from "../models/thread.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) =>{
    try{
        const userId = req.user.userId;
        const threads = await Thread.find({userId});
        const totalChats = threads.length;
        let totalMessages = 0;
        threads.forEach(thread =>{
            totalMessages += thread.messages.length;
        });
        const lastActive = threads.length > 0 ? threads[threads.length - 1].updatedAt : "No chats yet";
        res.json({totalChats, totalMessages, lastActive});
    }
    catch(err){
        res.status(500).json({error:"Failed to fetch stats"});
    }
})

export default router;