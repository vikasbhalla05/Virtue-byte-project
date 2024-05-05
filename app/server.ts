import http from "http"

import bodyParser from "body-parser"
// import cors from "cors"
import express, { Request, Response } from "express"
import mongoose from "mongoose"
import passport from "passport"
import config from "./configurations/config"
import strategy from "./configurations/passport"
import { isAuthorizedUser } from "./middlewares/auth.middleware"
import authRouter from "./routes/auth.route"
import userRouter from "./routes/user.route"
// import authRouter from "./routes/auth.passport.route"

const NAMESPACE = "Campr Server"
const app = express()

// set the view engine to ejs
app.set('view engine', 'ejs')

app.get('/T&C', (req, res) => {
    res.render('t&c.ejs')
})

/* passport middleware */
passport.use(strategy)
app.get("/middleware", isAuthorizedUser, (req, res) => {
    res.send("Route is open")
})
/* passport middleware */

/** Connect to Mongo */
mongoose.set("strictQuery", true)
/** Connect to Mongo */
mongoose
    .connect(config.mongo.url /* , config.mongo.options */) // useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options
    .then(() => {
        console.log(NAMESPACE, "Campr DB Connected")
    })
    .catch((error: any) => {
        console.error(NAMESPACE, error.message, error)
    })
mongoose.Promise = global.Promise

// app.use(
//     cors({
//         origin: (origin: any, callback: any) => {
//             const originsQuery = SupportedOriginModel.find({}, "url").exec()
//             originsQuery
//                 .then((result: any) => {
//                     const allowedOrigins = result.flatMap((o: any) => {
//                         return o.url
//                     })
//                     allowedOrigins.push("http://localhost:3000")
//                     allowedOrigins.push("https://campr-admin-staging.vercel.app")
//                     allowedOrigins.push("https://campr-staging.vercel.app") // Add localhost to allowed origins
//                     allowedOrigins.push(
//                         "https://campr-frontend-git-staging-ellingsen-platforms.vercel.app"
//                     )
//                     callback(null, allowedOrigins)
//                 })
//                 .catch((error: any) => {
//                     callback(new Error(error))
//                 })
//         },
//     })
// )

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

const httpServer = http.createServer(app)

httpServer.listen(config.server.port, () =>
    console.info(
        NAMESPACE,
        `Server is running on ${config.server.hostname}:${config.server.port}`
    )
)