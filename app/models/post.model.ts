import mongoose from "mongoose"
import { PostDocument } from "../interfaces/post.interface"

const postSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        featured_image: String,
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

export const postModel = mongoose.model<PostDocument>(
    "posts",
    postSchema
)
