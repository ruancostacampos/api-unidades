const mongoose = require('../database');
const UnitySchema = new mongoose.Schema({

  name: {
    type: String,
    required: true 
  },

  network_ip: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  public_ip: {
    type: String,
    required: false,
    lowercase: true
  },

  cnes: {
    type: String,
    required: [true, 'Insira um CNES.'],
    lenght: 7,
    message : '{VALUE} não é um CNES válido.'
  },

  mega_email: {
    type: String,
    requred: false,
    lenght: 64
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});


const Unity = mongoose.model('Unity', UnitySchema);

module.exports = Unity;