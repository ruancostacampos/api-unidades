const mongoose = require('../database');

const AnydeskSchema  = new mongoose.Schema({

  name: {
      type: String,
      required: true
  },

  id: {
      type: String,
      maxlength: 9,
      minlength: 9,
      required: true
  }

})

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

  anydesk : [AnydeskSchema]

});


const Unity = mongoose.model('Unity', UnitySchema);
const Anydesk = mongoose.model('Anydesk', AnydeskSchema);

module.exports = Unity, Anydesk;