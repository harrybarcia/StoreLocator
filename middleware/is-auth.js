module.exports=(req,res,next)=>{
    if(req.session.isLoggedIn){
        "console.log'You are logged in'";
        next();
    }else{
        res.redirect('/login');
    }
}