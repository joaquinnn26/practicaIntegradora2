import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
import { hashData, compareData } from "../utils.js";
import passport from "passport";
import { generateToken } from "../utils.js";
const router = Router();

// SIGNUP - LOGIN - PASSPORT LOCAL

router.post(
  "/signup",
  passport.authenticate("signup", {
    successRedirect: "/login",
    failureRedirect: "/error",
  })
);

router.post(
  "/login",
  passport.authenticate("login", {
    //successRedirect: "/catalogue",
    failureMessage:true,
    failureRedirect: "/error",
  }),
  (req, res) => {
    const { first_name, last_name, email, age } = req.user;
    const token = generateToken({
      first_name,
      last_name,
      email,
      age,
    });
    console.log(token)
    res.cookie("token", token, { maxAge: 60000, httpOnly: true });
    return res.redirect("/api/sessions/current");
  }
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.status(200).json({ message: "User logged", user: req.user });
  }
);

// SIGNUP - LOGIN - PASSPORT GITHUB

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/callback",
  passport.authenticate("github", {
    successRedirect: "/catalogue",
    failureRedirect: "/error",
  }),
  (req, res) => {
    res.redirect("/catalogue");
  }
);

router.get("/signout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.post("/restaurar", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usersManager.findByEmail(email);
    if (!user) {
      return res.redirect("/");
    }
    const hashedPassword = await hashData(password);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ error });
  }
});
export default router;
