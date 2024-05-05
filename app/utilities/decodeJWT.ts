import * as dotenv from "dotenv"
import jsonwebtoken from "jsonwebtoken"
dotenv.config()
const ACCESS_TOKEN_SECRET: any = process.env.ACCESS_TOKEN_SECRET

const decodeToken = (Token: any) => {
    try {
        const decoded = jsonwebtoken.verify(
            Token.substring(7),
            ACCESS_TOKEN_SECRET
        )
        return decoded
    } catch (err: any) {
        throw new Error("Invalid token")
    }
}

export default decodeToken