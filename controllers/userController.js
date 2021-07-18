const bcrypt = require('bcryptjs');
const passport = require('passport');
const fetch = require('node-fetch');
const User = require('../models/User');

exports.login = (req, res) => {
    res.render("login", { pageTitle: "login", path: "/login", message: req.flash("success_msg"), error: req.flash("error"), })
}

exports.register = (req, res) => {
    res.render("register", { pageTitle: "register", path: "/register" })
}
exports.logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "the logout was successful")
    res.redirect("/users/login");
}

exports.handleLogin = async(req, res, next) => {
    if (!req.body["g-recaptcha-response"]) {
        req.flash("error", "captcha validation is required");
        return res.redirect("/users/login")
    }

    const secretKey = process.env.CAPICHA_SECRET;
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
    &remoteip=${req.connection.remoteAddress}`

    const response = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
    });

    const json = await response.json();

    if(json.success){
        passport.authenticate("local", {
            failureRedirect: "/users/login",
            failureFlash: true
        })(req, res, next);
    }else{
        req.flash("error","There is a problem with validation")
        res.redirect("/users/login");
    }


}
exports.rememberMe = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000
    } else {
        req.session.cookie.expire = null;
    }
    res.redirect("/dashboard")
}

exports.createUser = async (req, res) => {
    const errors = [];
    try {
        await User.userValidation(req.body);
        const { fullname, email, password } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            errors.push({ message: "A user is available with this email" });
            return res.render('register', {
                pageTitle: "register User",
                path: "/register",
                errors,
            })
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({ fullname, email, password: hash });
        req.flash("success_msg", "was successful")
        res.redirect("/users/login")
    } catch (err) {
        console.log(err);
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        });
        return res.render('register', {
            pageTitle: "register User",
            path: "/register",
            errors,
        })
    }
}