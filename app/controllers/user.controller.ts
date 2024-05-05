import { HttpStatusCode } from "axios"
import { Request, Response } from "express"
import userService from "../services/user.service"

const apiListAllUsers = async (req: Request, res: Response) => {
    try {
        const pageNo: number = req.body.pageNo ? req.body.pageNo : 1
        const perPage: number = req.body.perPage ? req.body.perPage : 5

        let allUser: any = await userService.listAllUser({
            pageNo,
            perPage,
            ...req.body,
        })

        return res.status(HttpStatusCode.Ok).json({
            status: true,
            message: "All Users Fetched",
            allUser
        })
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).json({
            status: false,
            message: error.message
        })
    }
}

export default {
    apiListAllUsers,
}