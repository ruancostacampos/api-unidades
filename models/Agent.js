const mongoose = require('../database');

const AgentSchema = new mongoose.Schema({
    
    name : {
        type: String,
        maxlength: 70,
        minlength: 6,
    },

    cpf : {
        type: String,
        maxlength: 11,
        minlength: 11,
        unique: true
    },

    cns: {
        type: String,
        maxlength: 15,
        minlength: 15,
    },

    cnes: {
        type: String,
        maxlength: 7,
        minlength: 7
    },

    lastSync: {
        type: String,
        maxlength: 13,
        minlength: 13,
    },

    oldSync : [{
        timestamp : {
            type: String,
            maxlength: 13,
            minlength: 13
        }
    }]

})

const Agent = mongoose.model('Agent', AgentSchema);

module.exports = Agent;