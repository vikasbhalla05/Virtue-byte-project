import { HttpStatusCode } from "axios"
import { NextFunction, Request, Response } from "express"
import _ from "lodash"
import passport from "passport"
import decodeToken from "../utilities/decodeJWT"
import userService from "../services/user.service"
const jwt = require("jsonwebtoken")
const { TokenExpiredError } = jwt

const isAuthorizedUser = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    passport.authenticate(
        "jwt",
        { session: false },
        function (err: any, user: any, info: any) {
            if (err) {
                console.log(err)
                return res.json({
                    status: false,
                    message: "Authentication error",
                })
            }

            if (!user || _.isEmpty(user)) {
                if (info instanceof TokenExpiredError) {
                    return res.status(HttpStatusCode.Unauthorized).json({
                        status: false,
                        message: "Token Expired",
                    })
                } else {
                    return res.status(HttpStatusCode.Unauthorized).json({
                        status: false,
                        message: "User is not authorized",
                    })
                }
            }
            next()
        }
    )(req, res, next)
}

const getUserfromToken = function (
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const header = req.headers.authorization

        console.log(header)
        let decodeTokenValue: any = decodeToken(header)
        userService
            .findUserById(decodeTokenValue.sub)
            .then((user: any) => {
                if (user) {
                    req.user = user
                    next()
                } else {
                    return res.status(HttpStatusCode.Forbidden).json({
                        status: false,
                        message: "User not found",
                    })
                }
            })
            .catch((err: any) => {
                console.log(err)
                return res.status(HttpStatusCode.Ok).json({
                    status: false,
                    message: "Token decoding failed",
                })
            })
    } catch (err: any) {
        return res.status(HttpStatusCode.Ok).json({
            status: false,
            message: "Token decoding failed",
        })
    }
}

export { getUserfromToken, isAuthorizedUser }