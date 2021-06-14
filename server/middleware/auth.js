const {User} = require('../models/User');


let auth = (req, res, next) =>{

//인증처리하는 곳

//클라이언트 쿠키에서 토큰 가져오기
let token = req.cookies.x_auth;

//토큰 복호화 후 유저찾기
User.findByToken(token, (err,user)=>{
    if(err) throw err;
    if(!user) return res.json({isAuth:false, error:true})

    req.token = token;
    req.user = user;
    next(); //next() 를 하지 않으면 auth 안에 있고 다음으로 넘어가지 못함
})
//

}

module.exports = { auth };