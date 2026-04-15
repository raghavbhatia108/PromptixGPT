import express from 'express';
import Thread from '../models/thread.js';
import SharedChat from '../models/SharedChat.js';

const router = express.Router();

// Helper for sharing a thread
async function shareThreadById(threadId, res) {
  const existingShared = await SharedChat.findOne({ threadId });
  if (existingShared) {
    return res.status(400).json({ message: 'Thread already published' });
  }

  const thread = await Thread.findOne({ threadId });
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }

  const sharedChat = new SharedChat({
    threadId: thread.threadId,
    title: thread.title,
    messages: thread.messages,
  });

  await sharedChat.save();
  return res.status(201).json({ message: 'Thread published successfully' });
}

// POST /api/community/share/:threadId
router.post('/share/:threadId', async (req, res) => {
  const { threadId } = req.params;
  try {
    await shareThreadById(threadId, res);
  } catch (err) {
    console.error('Error publishing thread:', err);
    res.status(500).json({ error: 'Failed to publish thread' });
  }
});

// Backwards-compat route: POST /api/community/:threadId (old path if used by mistake)
router.post('/:threadId', async (req, res) => {
  const { threadId } = req.params;
  try {
    await shareThreadById(threadId, res);
  } catch (err) {
    console.error('Error publishing thread (legacy path):', err);
    res.status(500).json({ error: 'Failed to publish thread' });
  }
});

// GET /api/community
router.get('/', async (req, res) => {
  try {
    const sharedChats = await SharedChat.find({})
      .sort({ createdAt: -1 })
      .select('threadId title messages createdAt');
    res.json(sharedChats);
  } catch (err) {
    console.error('Error fetching shared chats:', err);
    res.status(500).json({ error: 'Failed to fetch shared chats' });
  }
});

// GET /api/community/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const sharedChat = await SharedChat.findById(id);
    if (!sharedChat) {
      return res.status(404).json({ error: 'Shared chat not found' });
    }
    res.json(sharedChat);
  } catch (err) {
    console.error('Error fetching shared chat:', err);
    res.status(500).json({ error: 'Failed to fetch shared chat' });
  }
});

export default router;