import http from "http"

import bodyParser from "body-parser"
import express, { Request, Response } from "express"
import mongoose from "mongoose"
import passport from "passport"
import config from "./configurations/config"
import strategy from "./configurations/passport"
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
import postRouter from "./routes/post.route"

const NAMESPACE = "Admin Server"
const app = express()


/* passport middleware */
passport.use(strategy)
/* passport middleware */

/** Connect to Mongo */
mongoose.set("strictQuery", true)
/** Connect to Mongo */
mongoose
    .connect(config.mongo.url)
    .then(() => {
        console.log(NAMESPACE, "Admin DB Connected")
    })
    .catch((error: any) => {
        console.error(NAMESPACE, error.message, error)
    })
mongoose.Promise = global.Promise


/** Log the request */
app.use((req, res, next) => {
    /** Log the req */
    console.info(
        NAMESPACE,
        `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    )

    res.on("finish", () => {
        /** Log the res */
        console.info(
            NAMESPACE,
            `METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`
        )
    })

    next()
})

/** Parse the body of the request */
app.use((req, res, next) => {
    if (req.originalUrl === "/webhook") {
        next()
    } else {
        express.json()(req, res, next)
    }
})
/** Parse the body of the request */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))

// simple route
app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Welcome to Virtuebyte-Backend Applications." })
})

app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/post", postRouter)

const httpServer = http.createServer(app)

httpServer.listen(config.server.port, () =>
    console.info(
        NAMESPACE,
        `Server is running on ${config.server.hostname}:${config.server.port}`
    )
)