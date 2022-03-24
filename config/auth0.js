require('dotenv').config();

const config = {
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    secret: process.env.SECRET
  }

module.exports = {
    config: config
}
