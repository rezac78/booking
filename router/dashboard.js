const { Router } = require('express');
const {authenticated} = require('../middlewares/auth');
const router = new Router()

router.get("/",authenticated,(req,res)=>{
    res.render("dashboard",{pageTitle:"داشبورد",path:"/dashboard",fullname:req.user.fullname})
})

module.exports=router;


