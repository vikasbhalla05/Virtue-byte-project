import express from "express"
import { getUserfromToken, isAuthorizedUser } from "../middlewares/auth.middleware"
import authController from "../controllers/auth.controller"
const authRouter = express.Router()


authRouter.post("/register", (_request, response) => {
    (async () => {
        await authController.registerUserController(_request, response)
        response.status(200).end()
    })()
})

authRouter.post("/login", (_request, response) => {
    (async () => {
        await authController.loginUserController(_request, response)
        response.status(200).end()
    })()
})

authRouter.post("/refresh-token", (_request, response) => {
    (async () => {
        await authController.refreshTokenController(_request, response)
        response.status(200).end()
    })()
})

authRouter.post("/change-password", isAuthorizedUser, getUserfromToken, (_request, response) => {
    (async () => {
        await authController.changePasswordController(_request, response)
        response.status(200).end()
    })()
})

export default authRouter;