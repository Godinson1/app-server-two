import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success, error, handleResponse } from "../utilities";
import { IPost } from "./interface";
import axios from "axios";

//Destructure status codes
const { OK, INTERNAL_SERVER_ERROR } = StatusCodes;

//Set Post Model
//const Post = db.Post;

/*
 * NAME - deletePost
 * AIM - Delete single post
 */
const deletePost = (data: string): void => {
  //delete data from database
  console.log(data);
};

/*
 * NAME - createPost
 * AIM - Create new post
 */
const createPost = (data: IPost): void => {
  //Save data to database
  console.log(data);
};

/*
 * NAME - editPost
 * AIM - Edit existing post
 */
const editPost = async (data: IPost) => {
  //Save data to database
  console.log(data);
};

/*
 * NAME - likePost
 * REQUEST METHOD - GET
 * AIM - Like existing post
 */
const likePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    //Send internal request to app server one.
    const data = await axios.get(
      `http://localhost:5000/posts/post/${req.params.id}/like`
    );
    return res.status(OK).json({
      status: success,
      message: "Post liked successfully",
      data: data.data,
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

export { createPost, likePost, editPost, deletePost };
