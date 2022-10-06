const connected = require('./db');
const express = require('express');
require('dotenv').config()

connected();

const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/orderlocal', require('./routes/user'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
