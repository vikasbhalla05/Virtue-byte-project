import { usersModel } from "../models/user.model"
import issueJWt from "../utilities/issueJWT"
const { ObjectId } = require("mongodb")


const findUserById = async (id: string) => {
    try {
        let userData = await usersModel
            .findOne({ _id: new ObjectId(id), isDeleted: false })
            .exec()
        return userData
    } catch (error: any) {
        throw new Error(error)
    }
}

const createNewUser = async (payload: Object) => {
    try {
        let createdUser = new usersModel(payload)
        const jwt = issueJWt(createdUser)
        let createdUserData: any = await createdUser.save()

        return {
            jwt,
            createdUserData,
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

const listAllUser = async (payload: any) => {
    try {
        let query: any = {}
        let selectFields = {
            phone: 1,
            email: 1,
            name: 1,
            profile_picture: 1,
            occupation: 1
        }

        let filter: any = {}

        if (payload.search) {
            let searchRegex = new RegExp(payload.search, "i")
            filter.$or = [
                { email: { $regex: searchRegex } },
                { name: { $regex: searchRegex } },
                { phone: { $regex: searchRegex } },
            ]
        }

        let filterMatch: any = {
            $match: filter,
        }

        let commonPipe: any = [
            {
                $match: query,
            },
            {
                $project: selectFields,
            }
        ]

        // to store the count of users
        let userCountPipe: any = [
            ...commonPipe,
            filterMatch,
            {
                $count: "count",
            },
        ]

        let sortStage: any = { created_at: -1 }

        let usersPipe: any = [
            ...commonPipe,
            filterMatch,
            // Skip and limit the results for pagination
            {
                $sort: sortStage,
            },
            {
                $skip: (payload.pageNo - 1) * payload.perPage,
            },
            {
                $limit: Number(payload.perPage),
            },
        ]

        let foundUsers: any = await usersModel
            .aggregate([
                {
                    $facet: {
                        totalCount: userCountPipe,
                        users: usersPipe,
                    },
                },
            ], { collation: { locale: 'en', strength: 2 } })
            .exec()

        let totalCount: number = foundUsers[0]?.totalCount[0]?.count
        let users: any = foundUsers[0]?.users
        let totalPages: number = Math.ceil(totalCount / Number(payload.perPage))

        return {
            users,
            totalPages,
            totalUsers: totalCount,
        }
    } catch (error: any) {
        throw new Error(error)
    }
}

export default {
    findUserById,
    createNewUser,
    listAllUser
}