import express from "express"
import { getUserfromToken, isAuthorizedUser } from "../middlewares/auth.middleware"
import postController from "../controllers/post.controller"
const postRouter = express.Router()


postRouter.post(
    "/create-post",
    isAuthorizedUser,
    getUserfromToken,
    (_request, response) => {
        (async () => {
            await postController.apiCreateNewPost(_request, response)
            response.status(200).end()
        })()
    }
)

postRouter.get(
    "/user/:userId",
    isAuthorizedUser,
    (_request, response) => {
        (async () => {
            await postController.apiDisplayUserPosts(_request, response)
            response.status(200).end()
        })()
    }
)

postRouter.delete(
    "/:postId",
    isAuthorizedUser,
    getUserfromToken,
    (_request, response) => {
        (async () => {
            await postController.apiDeletePost(_request, response)
            response.status(200).end()
        })()
    }
)

export default postRouter;