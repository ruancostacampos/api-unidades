const express = require('express');
const { ids } = require('webpack');
const { findOne } = require('../models/Unity');
const Unity = require('../models/Unity');
const Anydesk = require('../models/Anydesk')
const router = express.Router();



router.get(['/:cnes', '/'], async (req, res) => {

  var paramCnes = {};

  if (req.params.cnes) {
    paramCnes = { cnes: req.params.cnes }
  }
  
  query = await Unity.find().populate("anydesks").then((unities) => {
    if (unities.length == 0) return res.status(201).json({ message: "Nenhuma unidade encontrada." });
    return res.status(201).json(JSON.parse(JSON.stringify(unities)));
  }).catch( (err) => {
    console.log(err)
    return res.status(400).json({ message: "Ocorreu um erro." });
  })


});


// Rota que adiciona uma unidade
router.post('/', async (req, res) => {


  const { name, publicIp, cnes, megaEmail } = req.body;
  const unity = await Unity.find({ cnes });

  if (unity != '') return res.status(200).json({ message: "Já existe uma unidade cadastrada com esse CNES." });

  try {

    const newUnity = await Unity.create({ name, publicIp, cnes, megaEmail });
    return res.status(201).json(newUnity);

  } catch (err) {
    return res.status(400).json({ error: "Falha ao criar objeto, algum campo está preenchido incorretamente." });
  }

});

//Rota que atualiza dados da unidade
router.put('/:cnes', async (req, res) => {

  const { cnes } = req.params

  try {

    const updatedUnity = await Unity.findOneAndUpdate({ cnes: cnes }, req.body, { new: true });

    if (!updatedUnity) { return res.status(404).json({ message: "Não foi possível encontrar a unidade especificada." }) }

    return res.status(201).json(updatedUnity);
  } catch (err) {

    return res.status(400).json({ error: "Erro ao atualizar a unidade, confira todos os campos." })
  }

});


//Rota que remove unidade
router.delete('/:cnes', async (req, res) => {

  const { cnes } = req.params;

  const unity = Unity.deleteOne({ cnes: cnes }, (err, result) => {

    if (err) return res.status(400).json({ error: "Ocorreu um erro ao remover unidade." });

    if (result.deletedCount > 0) return res.status(201).json({ message: "Unidade removida com sucesso." });

    return res.status(400).json({ error: "Nenhuma unidade com o CNES informado." });
  });

});

// Add anydesk route
router.post('/:cnes/anydesk', async (req, res) => {
  const { cnes } = req.params;
  const { name, id } = req.body;

  try {
    const searchUnity = await Unity.findOne({cnes})

    if(searchUnity === null) return res.status(400).json(
      {error: 'Não existe unidade com o CNES informado.'}
    )

    const searchAnydesk = await Anydesk.findOne({id})
    
    if(searchAnydesk !== null) return res.status(400).json(
      { error: `O anydesk informado já existe em (${searchUnity.name}).` }
    )

    const createdAnydesk = await Anydesk.create({ name, id })

    const updatedUnity = await Unity.updateOne(
      { cnes },
      { $addToSet: { anydesks: createdAnydesk } },
      { new: true, runValidators: true}
    )

    if (!updatedUnity) { return res.status(404).json({ error: "Não foi possível encontrar a unidade especificada." }) }

    return res.status(200).json({message: "AnyDesk adicionado com sucesso!"})

  } catch (err) {
    return res.status(400).json({ message: err.message })
  }

})

//Rota que atualiza o anydesk
router.put('/:cnes/anydesk/:id', async (req, res) => {

  const { cnes, id: targetID } = req.params
  const { name, id } = req.body


  try {

    if (!name && !id) return res.status(400).json(
      { error: "É necessário informar no mínimo uma informação para alterar. (Nome ou ID)" }
    )

    const beChanged = await Anydesk.findOne({id: targetID})
    
    if(!beChanged) return res.status(400).json(
      {error: 'O anydesk original não existe em nenhuma unidade.'}
    )

    const searchUnityWithNewId = await Anydesk.findOne({id})

    if (searchUnityWithNewId && id) return res.status(400).json(
      { error: `O anydesk informado já existe em (${searchUnity.name}).` }
    )


    if(name){ 
      beChanged.name = name
    }

    if(id){
      beChanged.id = id
    }
    
    await beChanged.save()

    if (beChanged) return res.status(200).json({ message: "Anydesk atualizado com sucesso." })

    if (!beChanged) return res.status(400).json(
      { error: "Não foi encontrada nenhum anydesk com esse ID." }
    )

  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: err.message })
  }
})

router.get('/:cnes/anydesk', async (req, res) => {

  const { cnes } = req.params

  const searchUnity = await Unity.findOne({ cnes }).select({anydesks : 1}).populate('anydesks')

  if (searchUnity === null) return res.status(400).json(
    { message: "Não foram encotradas unidades com o ID informado." }
  )

  return res.status(200).json(searchUnity.anydesks)

})

module.exports = router;

