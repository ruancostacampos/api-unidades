const express = require('express');
const {auth} = require('express-oauth2-jwt-bearer');
const router = express.Router();




router.get('/api/auth', async (req, res, next) =>{
   next();
  /*if(req.oidc.isAuthenticated()){
    next();
  }else{
    res.status(401).JSON({message: 'Unauthorized'});
  }*/
});

module.exports = app => app.use('/api/', router);