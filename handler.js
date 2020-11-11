const awsServerlessExpress = require('aws-serverless-express')
var express = require('express')

var app = express()
app.use('/', express.static('./frontend/build/'))

const server = awsServerlessExpress.createServer(app)

exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)

exports.poliza = (event, context) => {
    return {
        statusCode: 200, body: JSON.stringify({ message: "", error: "" })
    }
}