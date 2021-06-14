const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//비밀번호를 암호화하기 위해 이용하는 salt가 몇글자인지 선언하는 것 saltRounds
const saltRounds = 10;
const jwt = require('jsonwebtoken')


const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength:50
    },
    email :{
        type : String,
        trim : true,
        unique : 1
    },
    password :{
        type : String,
        minlength : 5
    },
    lastname :{
        type : String,
        maxlength : 50
    },
    role:{
        type:Number,
        default: 0
    },
    image : String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }

})

userSchema.pre('save', function(next){
    var user = this;
    if(user.isModified('password')){
    //비밀번호 암호화하기
        bcrypt.genSalt(saltRounds, function(err, salt) {
            // next() 시 pre가 끝나고 save 진행
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) { //hash >> 암호화된 비밀번호
                if(err) return next(err);
                user.password = hash
                next()
            });
        });
    }else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //plainPassword 123456        암호화된 비밀번호 $2b$10$cdRfzVdEB5HTnJ/nFBZaC.BA/dN6BS6rD.CFlZSqvb9eK1Woj3qeK
    //복호화 불가

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
            cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;

    //jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}


userSchema.statics.findByToken = function(token, cb){
    var user = this;

    //토큰 decode
    jwt.verify(token, "secretToken", function(err, decoded){
        //유저아이디를 이용해서 아이디 찾고, 클라이언트에서 가져온 token과 db에 보관된 토큰 일치하는지 확인

        user.findOne({"_id" : decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema);
module.exports = {User};