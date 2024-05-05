import { parsePhoneNumber } from "libphonenumber-js"
import { usersModel } from "../models/user.model"
const { ObjectId } = require("mongodb")


const findUserByEmail = async (email: string) => {
    try {
        if (!email || typeof email !== "string") {
            return []
        }

        let userEmail = await usersModel
            .find({ email: email.toString(), isDeleted: false })
            .exec()
        return userEmail
    } catch (error: any) {
        throw new Error(error)
    }
}

const findUserByPhone = async (phone: string) => {
    try {
        if (!phone) {
            return [] // Return an empty array if phone is not a number
        }
        const phoneNumberWithPrefix = "+" + phone
        const phoneNumber: any = parsePhoneNumber(phoneNumberWithPrefix)?.nationalNumber

        let userPhone = await usersModel
            .find({ phone: { $regex: phoneNumber }, isDeleted: false })
            .exec()
        return userPhone
    } catch (error: any) {
        throw new Error(error)
    }
}


const changePassword = async (id: string, password: string): Promise<any> => {
    try {

        console.log(id, password)
        let changepwd = await usersModel
            .updateOne(
                { _id: id.toString(), isDeleted: false },
                {
                    $set: {
                        password: password.toString(),
                        is_password_reset: true
                    },
                }
            )
            .exec()
        return changepwd
    } catch (error: any) {
        throw new Error(error)
    }
}

export default {
    findUserByEmail,
    findUserByPhone,
    changePassword
}