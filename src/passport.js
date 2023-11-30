import passport from "passport";
import { usersManager } from "./managers/usersManager.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "./db/models/users.model.js";
const SECRETJWT = "jwtSecret";

// local

passport.use(
    "signup",
    new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
        const { first_name, last_name ,age} = req.body;
        if (!first_name || !last_name || !age|| !email || !password) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData(password);
            const createdUser = await usersManager.createOne({
            ...req.body,
            password: hashedPassword,
            });
            done(null, createdUser);
        } catch (error) {
            done(error);
        }
        }
    )
);

passport.use(
    "login",
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
        if (!email || !password) {
          return done(null, false, { message: "All fields are required" });
        }
        try {
            const user = await usersManager.findByEmail(email);
            if (!user) {
              return done(null, false, { message: "Incorrect email or password." });
            }

            const isPasswordValid = await compareData(password, user.password);
            if (!isPasswordValid) {
              return done(null, false, { message: "Incorrect email or password." });
            }
            
            done(null, user);
        } catch (error) {
            done(error);
        }
        }
    )
);

//githubnp
passport.use(
    "github",
    new GithubStrategy(
        {
        clientID: "Iv1.c6eed0abb0907725",
        clientSecret: "c513e28deda1695f7bd659026ff02599247e5c26",
        callbackURL: "http://localhost:8080/api/sessions/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
        try {
            const userDB = await usersManager.findByEmail(profile._json.email);
            // login
            if (userDB) {
            if (userDB.isGithub) {
                return done(null, userDB);
            } else {
                return done(null, false);
            }
        }
        // signup
        const infoUser = {
            first_name: profile._json.name.split(" ")[0], 
            last_name: profile._json.name.split(" ")[1],
            email: profile._json.email,
            password: " ",
            isGithub: true,
        };
        const createdUser = await usersManager.createOne(infoUser);
        return done(null, createdUser);
    } catch (error) {
        done(error);
    }
    }
    )
);

const fromCookies=(req)=>{
  return req.cookies.token;
}

//JWT
passport.use(
  "jwt",
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
      secretOrKey: SECRETJWT,
    },
    (jwt_payload, done) => {
      done(null, jwt_payload);
    }
  )
);

passport.serializeUser((user, done) => {
  // _id
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
    const user = await usersManager.findById(id);
    done(null, user);
    } catch (error) {
    done(error);
    }
});
