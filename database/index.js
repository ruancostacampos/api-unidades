const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.laibg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);

mongoose.Promise = global.Promise;

module.exports = mongoose;