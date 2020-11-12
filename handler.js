const awsServerlessExpress = require('aws-serverless-express')
var express = require('express')
var axios = require('axios')

var app = express()
app.use('/', express.static('./frontend/build/'))

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)

exports.poliza = async (event, context) => {

    let retorno = {
        statusCode: 500, body: { message: "", error: "" }
    }
    const hijos = [
        {
            costo: 0.279,
            dental: 0.12
        },
        {
            costo: 0.4396,
            dental: 0.1950
        },
        {
            costo: 0.5599,
            dental: 0.2480
        }
    ]
    //mayor a 65 años no tiene cobertura
    //El % de la empresa es el costo que asumirá la empresa del costo total de la póliza, el resto es cubierto por cada empleado.
    return new Promise(async (resolve,reject) => {
        return axios.get('https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy')
        .then(async policy => {
            if(policy.status !== 200){
                retorno.body.error = "API no responde"
                return reject(retorno)
            }
            if(policy.data.policy === undefined && !policy.data.policy.success){
                retorno.body.error = "Error en la respuesta de la API"
                return reject(retorno)
            }

            let _policy = policy.data.policy

            if(!_policy.workers.length){
                retorno.statusCode = 404
                retorno.body.error = "No existen trabajadores"
                return reject(retorno)
            }

            
            return Promise.all(_policy.workers.map(y => {
                return Promise.all(y.map(async x => {
                    const costoEmpresa = async (has_dental_care, { age, childs }) => {
                        let retorno = 0
    
                        if(age > 65) return retorno
    
                        if(childs === 0) retorno += hijos[0].costo
                        if(childs === 1) retorno += hijos[1].costo
                        if(childs >= 2) retorno += hijos[2].costo
    
                        if(has_dental_care){
                            if(childs === 0) retorno += hijos[0].dental
                            if(childs === 1) retorno += hijos[1].dental
                            if(childs >= 2) retorno += hijos[2].dental
                        }
    
                        return retorno
                        
                    }
                    var costo = await costoEmpresa(_policy.has_dental_care, x)
                    var costoCobertura = +(Math.abs( costo * (_policy.company_percentage / 100))).toFixed(2)
                    var costoEmpleado = +(costo - costoCobertura).toFixed(2)
                    return {
                        ...x,
                        costoCobertura: costoCobertura,
                        copagoEmpleado: costoEmpleado,
                    }
                }))
            }))
            .then(result => {
                retorno.statusCode = 200
                retorno.body.message = result
                return resolve(retorno)
            })
        })
    })
    .then(async r => {
        r.body = JSON.stringify(r.body)
        return r
    })
    .catch(async error => {
        retorno.body.error = error
        retorno.body.message = "Error"

        retorno.body = JSON.stringify(retorno.body)
        // Sentry.captureException(error)
        return retorno
    })
}