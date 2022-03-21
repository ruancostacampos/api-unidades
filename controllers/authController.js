const express = require('express');
const res = require('express/lib/response');
const User = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function generateToken(params = {}){
  return jwt.sign(params, authConfig.jwt_key, {expiresIn: 86000});
}

function verifyToken(){
  
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({auth: false, message:'No token recieved.'});
  jwt.verify(token, authConfig.jwt_key, function (err, decoded){
    if(err) return res.status(500).json({auth: false, message:'Invalid token.'});
    next();
  })

}

router.post('/register', async (req, res) =>{

  const {email} = req.body;
  
  try{
    //VERIFICA SE O USUÁRIO JÁ EXISTE 
    if(await User.findOne({email}) ) 
      return res.status(400).send({error: 'User already exists.'});

    const user = await User.create(req.body);

    user.password = undefined;
    const token = generateToken({id: user.id});

    res.set('x-access-token', token);
    return res.send({ 
      user, 
      token: token
    });

  }catch(err){
    console.log(err);
    return res.status(400).send({error: 'Registration failed.'});

  }

})

router.post('/authenticate', async (req, res) => {
  
  const {email, password} = req.body;
  const user = await User.findOne({email}).select('+password');

  if(!user){
    return res.status(400).send({error: "Email/password incorrect."});
  }
  
  if( !await bcrypt.compare(password, user.password)) {
    return res.status(400).send({error: "Email/password incorrect."})
  }
  
  user.password = undefined;

  
  res.send({ 
    user, 
    token: generateToken({id: user.id})
  });

})





module.exports = app => app.use('/api/auth', router);
