const mongoose = require('../database');
const Agent = require('./Agent')
const Anydesk = require('./Anydesk')

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

  anydesks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Anydesk' }],


  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Agent' }]

});


const Unity = mongoose.model('Unity', UnitySchema);

module.exports = Unity;