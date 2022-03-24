const express = require('express');
const router = express.Router();
const {auth} = require('express-openid-connect');
const auth0 = require('../config/auth0');



router.get('/api', async (req, res, next) =>{
  if(req.oidc.isAuthenticated){
    next();
  }else{
    res.status(401).JSON({message: 'Unauthorized'});
  }
});

module.exports = app => app.use('/api/', router);