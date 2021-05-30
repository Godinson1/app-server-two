import express from "express";
import { likePost } from "./index";
const router = express.Router();

router.get("/post/:id/like", likePost);

export { router };
