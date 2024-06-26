import path from "path"

import * as dotenv from "dotenv"
dotenv.config({ path: path.join(__dirname, "../../.env") })

const MONGO_OPTIONS = {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}

const MONGO_USERNAME = process.env.MONGO_USERNAME || ""
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ""
const MONGO_HOST = process.env.MONGO_URL || ""

const MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url:
        MONGO_USERNAME !== "" && MONGO_PASSWORD !== ""
            ? `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}`
            : `${MONGO_HOST}`,
}

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost"
const SERVER_PORT = process.env.SERVER_PORT || 3000

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
}

const JWT = {
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_SECRET || "secret",
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_LIFE,
    refreshTokenPrivateKey: process.env.REFRESH_TOKEN_SECRET || "secret",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_LIFE,
}

const verifyEmailOnSignupServerUrl =
    process.env.VERIFY_EMAIL_ON_SIGNUP_SERVER_URL || ""

const routePermission = {
    onlyAdmin: ["admin"],
    onlyUser: ["user"],
}

const server_url = process.env.SERVER_URL || ""

const config = {
    server: SERVER,
    mongo: MONGO,
    jwt: JWT,
    verifyEmailOnSignupServerUrl,
    routePermission,
    server_url,
}

export default config
