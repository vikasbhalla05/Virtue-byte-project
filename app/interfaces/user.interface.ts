import mongoose from "mongoose"

export interface UserDocument extends mongoose.Document {
    name: string;
    phone: number;
    email: string;
    profile_picture: string;
    occupation: string;
    password: string;
}
