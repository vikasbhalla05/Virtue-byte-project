import { HttpStatusCode } from "axios"
import { Request, Response } from "express"
import postService from "../services/post.service";
import mongoose from "mongoose";

const apiCreateNewPost = async (req: Request, res: Response) => {
    try {
        const user: any = req?.user;

        if (
            req.body &&
            req.body.title &&
            req.body.description &&
            req.body.featured_image
        ) {
            const { title, description, featured_image } = req.body;
            const publishedPost: any = await postService.createNewPost(title, description, featured_image, user._id)
            return res.status(HttpStatusCode.Ok).json({
                status: true,
                data: publishedPost,
                message: "Post Live",
            })
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Please provide request parameters",
            })
        }
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}

const apiDisplayUserPosts = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Not valid user Id"
            })
        }

        const getAllUserPosts: any = await postService.getUserPostsById(userId)

        return res.status(HttpStatusCode.Ok).json({
            status: true,
            data: getAllUserPosts,
            message: "Posts from user" + userId,
        })
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}

const apiDeletePost = async (req: Request, res: Response) => {
    try {
        const { postId } = req.params;
        const user: any = req.user;

        if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Not valid post Id"
            })
        }

        const _deletePost: any = await postService.deletePostsById(postId, user?._id)

        return res.status(HttpStatusCode.Ok).json({
            status: true,
            message: "Posts deleted successfully " + postId,
        })
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}


export default {
    apiCreateNewPost,
    apiDisplayUserPosts,
    apiDeletePost
}