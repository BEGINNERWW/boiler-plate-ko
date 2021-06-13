const express = require('express')
const app = express()
const port = 5000
const { User } = require('./models/User')

// application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// application/json
app.use(express.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://nodetest:han0303@cluster.mlr9q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify : false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! commmmmonnnn')
})

app.post('/register', (req, res) => {
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
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

