import express from "express"
import { isAuthorizedUser } from "../middlewares/auth.middleware"
import userController from "../controllers/user.controller"
const userRouter = express.Router()


userRouter.get(
    "/list-users",
    isAuthorizedUser,
    (_request, response) => {
        (async () => {
            await userController.apiListAllUsers(_request, response)
            response.status(200).end()
        })()
    }
)

export default userRouter;