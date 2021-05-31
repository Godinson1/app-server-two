import express from "express";
import { likePost, getAllPost, getPost } from "./index";
const router = express.Router();

router.get("/post/:id/like", likePost);
router.get("/", getAllPost);
router.get("/post/:id", getPost);

export { router };
