const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const {auth} = require('express-openid-connect');



console.log(process.env.BASEURL);


const app = express();
app.use(
    auth({
      authRequired: true,
      auth0Logout: true,
      issuerBaseURL: process.env.ISSUER,
      baseURL: process.env.BASEURL,
      clientID: process.env.CLIENTID,
      secret: process.env.SECRET
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "https://esus-server-monitor.herokuapp.com/");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Credentials", 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token");
    app.use(cors());
    next();
})


app.get('/private', function (req, res) {
    res.send('Secured Resource');
});
require('../controllers/authController')(app);
require('../controllers/unityController')(app);


app.listen(process.env.PORT || 4000);
