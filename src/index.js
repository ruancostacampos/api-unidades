const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const {auth} = require('express-openid-connect');

console.log(process.env.BASEURL);
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false})) ;
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CROSSURL);
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token");
    if(req.method == 'OPTIONS'){
      res.sendStatus(200);
    }
    app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
    next();
})

//app.use('/api', privateRoute);
require('../controllers/unityController')(app);

 
app.use(
  auth({
    issuerBaseURL: process.env.ISSUER,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    secret: process.env.SECRET,
  },)
);



function privateRoute (req, res, next){
  try{
    if(req.oidc.isAuthenticated()){
      next();
    }else{
      res.status(401).json({message: 'Unauthorized'});
      return;
    }
  }catch(err){ console.log(err) }
}

app.get('/', (req, res) => {
  if(req.oidc.isAuthenticated()){
    res.status(301).redirect(process.env.CROSSURL);
    return;
  }else{
    res.status(301).redirect(`${process.env.BASEURL}/login`);
    return;
  }
})


app.listen(process.env.PORT || 4000);


