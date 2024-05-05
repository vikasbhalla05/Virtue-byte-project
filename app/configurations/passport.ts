import * as dotenv from "dotenv"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"

import { usersModel } from "../models/user.model"
dotenv.config()
const options: any = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    algorithms: ["HS256"],
}

const strategy = new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await usersModel.findOne({ id: jwt_payload.sub }).exec();

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        console.error('Error finding user:', err);
        return done(err, false);
    }
});

export default strategy
