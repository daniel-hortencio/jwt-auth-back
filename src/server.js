const express = require('express')
const serverless = require('serverless-http')
const cors = require('cors')

const { router } = require('./routes')

const app = express()
app.use(cors())

app.use(express.json())

app.use(router)

app.use("/.netlify/functions/server", router)

app.listen(3333, () => "Server started on port 3333")

module.exports.handler = serverless(app)