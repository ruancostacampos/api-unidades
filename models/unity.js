const mongoose = require('../database');
const Agent = require('../models/agent')
const Anydesk = require('../models/anydesk')

const UnitySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true 
  },

  publicIp: {
    type: String,
    required: false,
    lowercase: true
  },

  cnes: {
    type: String,
    required: [true, 'Insira um CNES.'],
    lenght: 7,
    message : '{VALUE} não é um CNES válido.',
    unique: true
  },

  megaEmail: {
    type: String,
    required: false,
    lenght: 64
  },

  lastSync: {
    type: Number,
    required: false
  },

  anydesk: [Anydesk.schema],

  agent: [Agent.schema]

});


const Unity = mongoose.model('Unity', UnitySchema);

module.exports = Unity;