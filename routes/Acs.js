const express = require('express')
const router = express.Router()
const data = require('../config/cnesdata.json')

router.get('/load', async (req, res) => {
    
    let acs = Array()

    
    data.IDENTIFICACAO.PROFISSIONAIS.DADOS_PROFISSIONAIS.forEach( (elem) => {   
        
        if(elem.LOTACOES.DADOS_LOTACOES._CO_CBO === "515105"){
            acs.push({
                name : elem._NM_PROF,
                cns : elem._CO_CNS,
                cpf : elem._CPF_PROF,
                cnes : elem.LOTACOES.DADOS_LOTACOES._CNES
            })
        }

    }) 

    console.log(acs[0])

    return res.status(200).send(JSON.stringify(acs))
})


module.exports = router;