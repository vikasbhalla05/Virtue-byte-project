import jwt from 'jsonwebtoken'
import { HttpStatusCode } from "axios"
import { Request, Response } from "express"
import issueJWt from '../utilities/issueJWT'
import { bcryptFunctions } from '../utilities/bcrypt'
import issueJWTRefreshToken from '../utilities/issueJWTRefreshToken'
import authService from '../services/auth.service'
import userService from '../services/user.service'
import { UserDocument } from '../interfaces/user.interface'

const registerUserController = async (req: Request, res: Response) => {
    try {
        if (
            req.body &&
            req.body.email &&
            req.body.phone &&
            req.body.name &&
            req.body.password &&
            req.body.profile_picture &&
            req.body.occupation
        ) {
            const email = req.body.email ? req.body.email.trim() : null
            const phoneNo = req.body.phone ? req.body.phone : null
            let results: any
            if (email && phoneNo) {
                results = await registerbyEmailandPhone(req, res)
            } else if (email && !phoneNo) {
                results = await registerbyEmail(req, res)
            } else if (!email && phoneNo) {
                results = await registerbyPhone(req, res)
            }
            return results
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Please provide request parameters",
            })
        }
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}


const loginUserController = async (req: Request, res: Response) => {
    let email: string = req.body.email ? req.body.email : undefined
    let phone: number = req.body.phone ? req.body.phone : undefined
    let password: string = req.body.password ? req.body.password : undefined

    if ((email === undefined && phone === undefined) || password === undefined) {
        return res.status(HttpStatusCode.BadRequest).json({
            status: false,
            message: "Ensure the correct body!",
        })
    }

    try {
        const userExists: any =
            phone === undefined
                ? await authService.findUserByEmail(req.body.email)
                : await authService.findUserByPhone(req.body.phone)

        if (userExists.length) {
            const isPwdCorrect = await bcryptFunctions.decryptPWD(
                req.body.password,
                userExists[0].password
            )
            if (isPwdCorrect) {
                const jwt = issueJWt(userExists[0])
                return res.status(HttpStatusCode.Ok).json({
                    status: true,
                    message: "Logged in successfully",
                    data: {
                        ...userExists[0].toObject(),
                        token: jwt.token,
                        tokenExpiresIn: jwt.expires,
                        refreshToken: jwt.refreshToken,
                        refreshTokenExpiresIn: jwt.refreshTokenExpiresIn,
                    },
                })
            } else {
                return res.status(HttpStatusCode.Ok).json({
                    status: false,
                    message: "Password is not correct!",
                })
            }
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: !phone
                    ? "Email is not found. Please register!"
                    : "Phone Number not found. Please register!",
            })
        }
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}


const changePasswordController = async (req: Request, res: Response) => {
    try {
        if (req.body.current_password === req.body.password) {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Your new password is same as old password.",
            })
        }

        const user: any = req.user;

        if (req.body.password === req.body.confirm_password) {

            const isPasswordVerified = await bcryptFunctions.decryptPWD(
                req.body.current_password,
                user.password
            )
            if (isPasswordVerified) {
                const encryptedpwd = await bcryptFunctions.encryptPWD(
                    req.body.password
                )
                const isPasswordChanged = await authService.changePassword(
                    user._id,
                    encryptedpwd
                )
                if (isPasswordChanged) {
                    return res.status(HttpStatusCode.Ok).json({
                        status: true,
                        message: "Your password is successfully changed.",
                    })
                }
            } else {
                return res.status(HttpStatusCode.Ok).json({
                    status: false,
                    message: "Your current password is wrong.",
                })
            }
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Password is not matched with confirm password.",
            })
        }
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}

const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken
        const refreshJWT: any = issueJWTRefreshToken(refreshToken)
        if (refreshJWT.token === "expired" && refreshJWT.expires === "0d") {
            return res.status(HttpStatusCode.ExpectationFailed).json({
                status: false,
                message: "Token Refresh Failed",
                data: {
                    token: refreshJWT.token,
                    tokenExpiresIn: refreshJWT.expires,
                    refreshToken: refreshJWT.refreshToken,
                    refreshTokenExpiresIn: refreshJWT.refreshTokenExpiresIn,
                },
            })
        }
        return res.status(HttpStatusCode.Ok).json({
            status: true,
            message: "Token Refreshed Successfully",
            data: {
                token: refreshJWT.token,
                tokenExpiresIn: refreshJWT.expires,
                refreshToken: refreshJWT.refreshToken,
                refreshTokenExpiresIn: refreshJWT.refreshTokenExpiresIn,
            },
        })
    } catch (error: any) {
        return res.status(HttpStatusCode.BadRequest).send({
            status: false,
            message: error.message,
        })
    }
}

const registerbyEmailandPhone = async (req: Request, res: Response) => {
    let isEmailExists = await authService.findUserByEmail(
        req.body.email.trim()
    )
    let isPhoneExists = await authService.findUserByPhone(
        req.body.phone
    )
    if (isPhoneExists?.length > 0) {
        return res.status(HttpStatusCode.Ok).json({
            status: false,
            message: "Phone no is already exists.",
        })
    } else if (isEmailExists?.length > 0) {
        return res.status(HttpStatusCode.Ok).json({
            status: false,
            message: "Email is already exists.",
        })
    } else {
        if (req.body.password) {
            let dataFromCreateUser: any = await userService.createNewUser(
                { ...req.body }
            )
            await returnSuccessfullRegisteredUserData(res, dataFromCreateUser)
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Password not found",
            })
        }
    }
}

const registerbyEmail = async (req: Request, res: Response) => {
    let isEmailExists = await authService.findUserByEmail(
        req.body.email
    )
    if (isEmailExists?.length > 0) {
        return res.status(HttpStatusCode.Ok).json({
            status: false,
            message: "Email is already exists.",
        })
    } else {
        if (req.body.password) {
            let dataFromCreateUser: any = await userService.createNewUser(
                { ...req.body }
            )
            await returnSuccessfullRegisteredUserData(res, dataFromCreateUser)
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Password not found",
            })
        }
    }
}

const registerbyPhone = async (req: Request, res: Response) => {
    let isExists = await authService.findUserByPhone(req.body.phone)
    if (isExists?.length > 0) {
        return res.status(HttpStatusCode.Ok).json({
            status: false,
            message: "Phone no is already exists.",
        })
    } else {
        if (req.body.password) {
            let dataFromCreateUser: any = await userService.createNewUser(
                { ...req.body, login_source: "phone" }
            )
            await returnSuccessfullRegisteredUserData(res, dataFromCreateUser)
        } else {
            return res.status(HttpStatusCode.Ok).json({
                status: false,
                message: "Password not found",
            })
        }
    }
}

const returnSuccessfullRegisteredUserData = async (
    res: Response,
    dataFromCreateUser: any
) => {

    console.log(dataFromCreateUser)
    return res.status(HttpStatusCode.Ok).json({
        status: true,
        message: "User is registered successfully",
        data: {
            ...dataFromCreateUser.jwt,
            ...dataFromCreateUser.createdUserData.toObject(),
        },
    })
}

export default {
    registerUserController,
    loginUserController,
    refreshTokenController,
    changePasswordController
}