import mongoose from "mongoose"

export interface PostDocument extends mongoose.Document {
    title: string;
    description: number;
    featured_image: string;
    user_id?: string;
}
