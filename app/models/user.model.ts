import mongoose from "mongoose"

import { UserDocument } from "../interfaces/user.interface"
import { bcryptFunctions } from "../utilities/bcrypt"

const usersSchema = new mongoose.Schema(
    {
        phone: { type: String, default: null, trim: true },
        email: { type: String, lowercase: true, default: null, trim: true },
        name: { type: String, default: null },
        password: String,
        profile_picture: String,
        occupation: String,
    },
    {
        timestamps: true,
    }
)

usersSchema.pre("save", async function () {
    if (this.password) {
        const encryptedpwd = await bcryptFunctions.encryptPWD(this.password)
        this.password = encryptedpwd
        // this.confirm_password = encryptedpwd
    }
})

usersSchema.index({
    fullname: "text",
    email: "text",
})

export const usersModel = mongoose.model<UserDocument>(
    "users",
    usersSchema
)
