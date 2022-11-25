const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const unityRouter = require('../routes/Unity')

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

app.use('/unity', unityRouter)





app.listen(process.env.PORT || 4000, () => {
  console.log("Server running")
});


