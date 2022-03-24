const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {auth} = require('express-openid-connect');
const auth0 = require('../config/auth0');
require('dotenv').config();

console.log(process.env.BASEURL);

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(auth(auth0.config));

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", process.env.BASEURL);
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token");
    app.use(cors());
    next();
})

app.use('/api', privateRoute);
require('../controllers/unityController')(app);


function privateRoute (req, res, next){
  if(req.oidc.isAuthenticated()){
    next();
  }else{
    res.status(401).json({message: 'Unauthorized'});
    return;
  }
}

app.listen(process.env.PORT || 4000);


