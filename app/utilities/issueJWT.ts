import * as dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
dotenv.config()
const ACCESS_TOKEN_SECRET: any = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET: any = process.env.REFRESH_TOKEN_SECRET

const issueJWt = (user: any) => {
    const _id = user._id
    const expiresIn = "1d"
    const refreshTokenExpiresIn = "30d"
    const payload = {
        sub: _id,
        // iat: Date.now()
    }
    const signedToken = jsonwebtoken.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: expiresIn,
        algorithm: "HS256",
    })
    const signedRefreshToken = jsonwebtoken.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: refreshTokenExpiresIn,
        algorithm: "HS256",
    })
    return {
        token: "Bearer " + signedToken,
        expires: expiresIn,
        refreshToken: signedRefreshToken,
        refreshTokenExpiresIn: refreshTokenExpiresIn,
    }
}

export default issueJWt
