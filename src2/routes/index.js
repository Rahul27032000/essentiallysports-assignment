import { Router } from 'express';

const router = Router();


router.get('/search', async (req, res, next) => {
  try {
    const q = req.query.q;
    console.log("we are huiy")
    if (!q) return res.status(400).json({ error: 'Missing q param' });
    const result = await searchBestChunk(q);
    res.json(result);
  } catch (err) {
    console.log(err)
    next(err);
  }
});

 
router.post('/videos/:videoId/transcript', ingestTranscriptHandler);
router.post('/videos/youtube', ingestFromYouTube);
router.post('/videos/manual', ingestWithTranscriptBody);
export default router;
