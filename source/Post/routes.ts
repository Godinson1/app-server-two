import express from "express";
import { likePost, unlikePost, getAllPost, getPost } from "./index";
const router = express.Router();

router.get("/post/:id/like", likePost);
router.get("/post/:id/unlike", unlikePost);
router.get("/", getAllPost);
router.get("/post/:id", getPost);

export { router };
