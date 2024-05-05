import * as dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"

dotenv.config()

const ACCESS_TOKEN_SECRET: any = process.env.ACCESS_TOKEN_SECRET
const REFRESH_TOKEN_SECRET: any = process.env.REFRESH_TOKEN_SECRET

const issueJWTRefreshToken = (refreshToken: any) => {
    const expiresIn = "1d"
    const refreshTokenExpiresIn = "30d"
    try {
        const decoded: any = jsonwebtoken.verify(
            refreshToken.toString(),
            REFRESH_TOKEN_SECRET
        )
        const signedToken = jsonwebtoken.sign(
            { sub: decoded.sub, isAdmin: decoded.isAdmin },
            ACCESS_TOKEN_SECRET,
            { expiresIn: expiresIn, algorithm: "HS256" }
        )
        const signedRefreshToken = jsonwebtoken.sign(
            { sub: decoded.sub, isAdmin: decoded.isAdmin },
            REFRESH_TOKEN_SECRET,
            { expiresIn: refreshTokenExpiresIn, algorithm: "HS256" }
        )

        return {
            token: "Bearer " + signedToken,
            expires: expiresIn,
            refreshToken: signedRefreshToken,
            refreshTokenExpiresIn: refreshTokenExpiresIn,
        }
    } catch (err: any) {
        // Handle expired refresh token
        return {
            token: "expired",
            expires: "0d",
            refreshToken: "expired",
            refreshTokenExpiresIn: "0d",
        }
    }
}

export default issueJWTRefreshToken
