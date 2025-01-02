import { Router } from "express";

import { addStory, getStories, getStory, updateStory, deleteStory,likeStory,addComment,deleteComment,replyComment } from "../controller/story.controller.js";


const router = Router()

router.get('/get-stories', getStories)
router.post('/add-story', addStory)
router.get('/get-story/:id', getStory)
router.put('/update-story/:id', updateStory)
router.delete('/delete-story/:id', deleteStory)
router.post('/like-story/:id', likeStory)
router.post('/reply-comment/:id/:commentId', replyComment)
router.post('/add-comment/:id', addComment)
router.delete('/delete-comment/:id/:commentId', deleteComment)



export default router