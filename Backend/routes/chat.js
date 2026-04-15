import express from 'express';
import Thread from '../models/thread.js';
import  getOpenAIApiResponse  from '../utils/openai.js';
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post('/test', async(req, res)=>{
    try{
        const thread = new Thread({
            threadId: "abc12",
            title: "Sample Thread"
        });
        const response = await thread.save();
        res.status(200).json(response);
    }
    catch(err){
        console.error("Error:", err);
        res.status(500).json({error:"Failed to save in DB"});
    }
});

router.get("/threads", verifyToken, async(req, res)=>{
    try{
        const threads = await Thread.find({
            userId: req.user.userId
        }).sort({updatedAt: -1});
        res.json(threads);
    }
    catch(err){
        console.error("Error:", err);
        res.status(500).json({error:"failed to fetch threads"});
    }
});

router.get("/threads/:threadId", verifyToken, async(req, res) =>{
   
        const {threadId} = req.params;
         try{
        const thread = await Thread.findOne({
            threadId,
            $or: [
                { userId: req.user.userId },
                { userId: { $exists: false } }
            ]
        });
        if(!thread){
            return res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    }
    catch(err){
        console.error("Error:", err);
        res.status(500).json({error: "failed to fetch thread"});
    }
});

router.delete("/threads/:threadId", verifyToken, async(req,res)=>{
    const {threadId} = req.params;

    try{
        const deletedThread = await Thread.findOneAndDelete({
            threadId,
            $or: [
                { userId: req.user.userId },
                { userId: { $exists: false } }
            ]
        });

        if(!deletedThread){
            return res.status(404).json({error: "Thread not found"});
    }
    res.status(200).json({message:"Thread deleted successfully"});  
}
    catch(err){
        console.error("Error:", err);
        res.status(500).json({error: "failed to delete thread"});
    }
});

router.post("/chat", verifyToken, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" });
  }

  try {
    let thread = await Thread.findOne({
      threadId,
      userId: req.user.userId,
    });

    // 🧠 If new thread
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message.substring(0, 50),
        userId: req.user.userId,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // 🤖 Get AI reply
    const assistantReply = await getOpenAIApiResponse(message);

    // ✅ Save assistant reply in DB
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();
    await thread.save();

    // 🚀 Send reply to frontend (for typing)
    res.json({ reply: assistantReply });

  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "failed to process chat message" });
  }
});

export default router;