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
      required: true,
      unique: true
  }

},
{
  collection: 'anydesk'
})




const Anydesk = mongoose.model('Anydesk', AnydeskSchema);

module.exports = Anydesk