import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success, error, handleResponse } from "../utilities";
import { IPost } from "./interface";
import pool from "../database/db";
import axios from "axios";

//Destructure status codes
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

//Set Post Model
const Post = pool;

/*
 * NAME - getAllPost
 * AIM - Get all posts in database
 */
const getAllPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await Post.query(`SELECT * from posts`);
    return res.status(OK).json({
      status: success,
      message: "Posts retieved successfully",
      data: data.rows,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - getAllPost
 * AIM - Get single post in database
 */
const getPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await Post.query(`SELECT * from posts WHERE id = $1`, [
      req.params.id,
    ]);
    if (data.rowCount === 0)
      return handleResponse(res, error, NOT_FOUND, "Post not found!");
    return res.status(OK).json({
      status: success,
      message: "Post retieved successfully",
      data: data.rows[0],
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - deletePost
 * AIM - Delete single post
 */
const deletePost = async (data: string) => {
  //delete data from database
  try {
    await Post.query(`DELETE FROM posts WHERE admin_id = $1`, [parseInt(data)]);
  } catch (err) {
    console.log(err);
  }
};

/*
 * NAME - createPost
 * AIM - Create new post
 */
const createPost = async (data: IPost): Promise<any> => {
  //Save/Insert data into database
  try {
    await Post.query(
      `INSERT INTO posts (admin_id, fullname, handle, content, photoUrl, likes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [data.id, data.name, data.handle, data.content, data.photoUrl, data.likes]
    );
  } catch (err) {
    console.log(err);
  }
};

/*
 * NAME - editPost
 * AIM - Edit existing post
 */
const editPost = async (data: IPost) => {
  //Update data in database
  try {
    await Post.query(
      `UPDATE posts SET content = $1, photoUrl = $2 WHERE admin_id = $3`,
      [data.content, data.photoUrl, data.id]
    );
  } catch (err) {
    console.log(err);
  }
};

/*
 * NAME - likePost
 * REQUEST METHOD - GET
 * AIM - Like existing post in main server and admin server
 */
const likePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    //Update data
    const result = await Post.query(
      `UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rowCount === 0)
      return handleResponse(res, error, NOT_FOUND, "Post not found!");

    //Send internal request to app server one.
    await axios.get(
      `http://localhost:5000/posts/post/${result.rows[0].admin_id}/like`
    );

    return res.status(OK).json({
      status: success,
      message: "Post liked successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === NOT_FOUND)
      return handleResponse(
        res,
        error,
        NOT_FOUND,
        "Post liked successfully but not found in admin server!"
      );
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - unlikePost
 * REQUEST METHOD - GET
 * AIM - Unlike existing post in main server and admin server
 */
const unlikePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    //Update data
    const result = await Post.query(
      `UPDATE posts SET likes = likes - 1 WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    if (result.rowCount === 0)
      return handleResponse(res, error, NOT_FOUND, "Post not found!");

    //Send internal request to app server one.
    await axios.get(
      `http://localhost:5000/posts/post/${result.rows[0].admin_id}/like`
    );

    return res.status(OK).json({
      status: success,
      message: "Post unliked successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    if (err.response.status === NOT_FOUND)
      return handleResponse(
        res,
        error,
        NOT_FOUND,
        "Post unliked successfully but not found in admin server!"
      );
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};
export {
  createPost,
  likePost,
  editPost,
  deletePost,
  getAllPost,
  getPost,
  unlikePost,
};
