import { postModel } from "../models/post.model"

const { ObjectId } = require("mongodb")


const createNewPost = async (title: string, description: string, featured_image: string, user_id: string) => {
    try {

        const postDetails = new postModel({ title, description, featured_image, user_id: new ObjectId(user_id) })
        let publishedPost = await postDetails.save();

        return publishedPost
    } catch (error: any) {
        throw new Error(error)
    }
}

const getUserPostsById = async (id: string) => {
    try {
        const getUserPosts = await postModel.find({ user_id: new ObjectId(id) }).exec();
        return getUserPosts;
    } catch (error: any) {
        throw new Error(error)
    }
}

const deletePostsById = async (id: string, userId: string) => {
    try {
        const deletedPost = await postModel.deleteOne({ _id: new ObjectId(id), user_id: new ObjectId(userId) }).exec();
        return deletedPost;
    } catch (error: any) {
        throw new Error(error)
    }
}

export default {
    createNewPost,
    getUserPostsById,
    deletePostsById
}