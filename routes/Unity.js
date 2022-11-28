const express = require('express');
const { ids } = require('webpack');
const { findOne } = require('../models/unity');
const Unity = require('../models/unity');
const Anydesk = require('../models/unity')
const router = express.Router();



router.get(['/:cnes', '/'], async (req, res) => {
  
  var paramCnes = null;

  if(req.params.cnes){
    paramCnes = {cnes: req.params.cnes}
  }else{
    paramCnes = {}
  }

  unities = Unity.find(paramCnes, function (err, unities) {
    if(err) return res.status(400).json({message : "Ocorreu um erro."});

    if(unities.length == 0) return res.status(201).json("Nenhuma unidade encontrada.");

    return res.status(201).json(unities);

  });

}); 


// Rota que adiciona uma unidade
router.post('/', async (req, res) => { 


  const {name, publicIp, cnes, megaEmail} = req.body;
  const unity = await Unity.find({cnes});
  
  if(unity != '') return res.status(200).json({message: "Já existe uma unidade cadastrada com esse CNES."});
   
  try{

    const newUnity = await Unity.create({name, publicIp, cnes, megaEmail});
    return res.status(201).json(newUnity);

  }catch(err){
    return res.status(400).json({message : "Falha ao criar objeto, algum campo está preenchido incorretamente."});
  }

});

//Rota que atualiza dados da unidade
router.put('/:cnes', async (req, res) => {

    const {cnes} = req.params

    try{
        
        const updatedUnity = await Unity.findOneAndUpdate({cnes : cnes}, req.body, {new : true});

        if(!updatedUnity){return res.status(404).json({message: "Não foi possível encontrar a unidade especificada."})}  

        return res.status(201).json(updatedUnity); 
    }catch(err){
    
        return res.status(400).json({message: "Erro ao atualizar a unidade, confira todos os campos."})
    }

});


//Rota que remove unidade
router.delete('/:cnes', async (req, res) => {
  
    const {cnes} = req.params;

    const unity = Unity.deleteOne({cnes : cnes}, (err, result) =>{

        if(err) return res.status(400).json({message: "Ocorreu um erro ao remover unidade."});

        if(result.deletedCount > 0) return res.status(201).json({message: "Unidade removida com sucesso."});

        return res.status(400).json({message: "Nenhuma unidade com o CNES informado."});
    });

});

//Rota que adiciona anydesk
router.post('/:cnes/anydesk', async (req, res) => {

    const {cnes} = req.params;
    const {name, id} = req.body;

    try{

        const searchUnity = await Anydesk.findOne({"anydesk.id" : id})

        if(searchUnity) return res.status(400).json(
          {message: `O anydesk informado já existe em (${searchUnity.name}).`}
        )

        const updatedUnity = await Unity.findOneAndUpdate(
          {cnes}, 
          {$addToSet : {anydesk: {name: name, id}} },
          {new: true, runValidators: true} 
        )

        if(!updatedUnity){return res.status(404).json({message: "Não foi possível encontrar a unidade especificada."})}  

        return res.status(200).json(updatedUnity)

    }catch(err){
        return res.status(400).json({message: err.message})
    }

})

router.put('/:cnes/anydesk/:id', async (req, res) => {
    
    const {cnes, id} = req.params;
    const {name, id: newId} = req.body;

    try{

      if(!name && !newId)  return res.status(400).json(
        {message: "É necessário informar no mínimo uma informação para alterar. (Nome ou ID)"}
      )
   
      const updatedAnydesk = await Anydesk.findOneAndUpdate(
        {"anydesk.id" : id},
        {$set : {name, id: newId} } ,
        {new: true, runValidators: true}
      )

      console.log(updatedAnydesk)
  
      if(updatedAnydesk) return res.status(200).json({message: "Anydesk atualizado com sucesso."})

      if(!updatedAnydesk) return res.status(400).json(
        {message: "Não foi encontrada nenhum anydesk com esse ID."}
      )

    }catch(err){
      console.log(err)
      return res.status(400).json({message: "Ocorreu um erro."})
    }
})

module.exports = router;
