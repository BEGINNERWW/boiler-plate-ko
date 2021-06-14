const express = require('express')
const app = express()
const port = 5000
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')
const config = require('./models/config/key')
// application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// application/json
app.use(express.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify : false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! commmmmonnnn')
})

app.post('/api/users/register', (req, res) => {
    //회원 가입시 필요 정보를 client에서 가져오면
    //정보들을 database에 입력

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.post('/api/users/login',(req, res) => {
  //요청된 이메일 데이터베이스에서 찾기
  User.findOne({email : req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess : false,
        message : "제공된 이메일에 해당하는 유저가 없습니다"
      })
    }

  //비밀번호 일치인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
      
       //위가 모두 일치하다면 token 생성
       user.generateToken((err, user) => {
         if(err) return res.status(400).send(err);

         //토큰 저장 - 쿠키, 로컬스토리지, 세션 
          res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess:true, userId : user._id})
       })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => {

  //여기까지 미들웨어를 통과해 왔다는 얘기는 authenication이 true
  res.status(200).json({
    _id: req.user._id,
    isAdmin : req.user.role === 0 ? false : true,
    isAuth : true,
    email : req.user.email,
    name : req.user.name,
    lastname : req.user.lastname,
    role: req.user.role,
    image : req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) =>{
  console.log("라랄랄라라")
  console.log(req.user._id)
  User.findOneAndUpdate({_id: req.user._id},
    {token : ""}
    , (err, user)=>{
      console.log("진입")
      if(err) return res.json({success : false, err});
      return res.status(200).send({
        success : true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

