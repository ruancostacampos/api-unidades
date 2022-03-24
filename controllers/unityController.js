const express = require('express');
const Unity = require('../models/unity');
const User = require('../models/user');
const router = express.Router();



router.get('/', async (req, res) => {

  unities = Unity.find({}, function (err, unities) {
    if(err) return res.status(400).json({message : "Some error ocurr."});

    if(unities.length == 0) return res.status(201).json("No unities found.");

    return res.status(201).json(unities);

  });

});

// # Essa é a rota que adiciona uma unidade # //
router.post('/', async (req, res) => { 
  const {name, network_ip, public_ip, cnes} = req.body;
  const unity = await Unity.find({cnes});
  
  if(unity != '') return res.status(200).json({message: "Já existe uma unidade cadastrada com esse CNES."});
   
  try{

    const newUnity = await Unity.create({name, network_ip, public_ip, cnes});
    return res.status(201).json(newUnity);

  }catch(err){
    return res.status(200).json({message : "Falha ao criar objeto, algum campo está preenchido incorretamente."});
  }

});

router.put('/:cnes', async (req, res) => {

  const {cnes} = req.params;
  const updatedUnity = await Unity.findOneAndUpdate({cnes : cnes}, req.body, {new : true});
  return res.status(201).json(updatedUnity); 

});

router.delete('/:cnes', async (req, res) => {
  const {cnes} = req.params;
  const unity = Unity.deleteOne({cnes : cnes}, function (err, result){
    if(err) return res.status(400).json({message: "Some Error occur."});
    if(result.deletedCount > 0) return res.status(201).json({message: "Unity deleted sucessfully"});
    return res.status(400).json({message: "Nothing to do."});
    });
});




module.exports = app => app.use('/api/unity', router);

