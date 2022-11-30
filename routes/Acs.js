const express = require('express')
const router = express.Router()
const data = require('../config/cnesdata.json')
const Agent = require('../models/Agent')
const Unity = require('../models/Unity')

router.get('/load', async (req, res) => {
    
    let acs = Array()
    let errorAcs = Array()

    try{
        /*
        
        data.IDENTIFICACAO.PROFISSIONAIS.DADOS_PROFISSIONAIS.forEach( (elem) => {   
        
            if(elem.LOTACOES.DADOS_LOTACOES._CO_CBO === "515105"){

                let cacheAcs = {
                    name : elem._NM_PROF,
                    cns : elem._CO_CNS,
                    cpf : elem._CPF_PROF,
                    cnes : elem.LOTACOES.DADOS_LOTACOES._CNES
                }

                if(cacheAcs.name !== '' && cacheAcs.cpf.length === 11){
                    acs.push(cacheAcs)
                }else{
                    errorAcs.push(cacheAcs)
                }

            }
    
        }) 

        const agents = await Agent.insertMany(acs)

        if(agents && errorAcs.length === 0) 
        return res.status(200).send({message: "Todos os agentes de saúde do arquivo JSON foram importados."})

        if(agents)
        return res.status(200).send({message: "Alguns agentes de saúde do arquivo JSON foram importados.", errors: JSON.stringify(errorAcs)})
        */
        let agente = new Agent({name: "Ruan Costa Campos", cpf: "06661182563"})
        
        const insertAgent = await Agent.create(agente)

        const unidade = await Unity.findOneAndUpdate(
            {cnes: 1234567},
            {$addToSet: {agents: insertAgent}},
            {new: true, runValidators: true}
        ).populate('agents')

        console.log(unidade)
        return res.status(200).send(unidade)

    }catch(err){
        console.log(err)
        return res.status(400).send({message: err.message})

    }

    return res.status(200).send(JSON.stringify(acs))
})




module.exports = router;