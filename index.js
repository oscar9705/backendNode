const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection} = require('./database/config');


// create server 
const app = express();

// configure CORS
app.use(cors())

// database

dbConnection();

// console.log(process.env);

//rutas
app.get('/', (req, res) => {
    res.status(200).json({
        ok: true,
        msg: "Hola mundo"
    });
});

app.listen(process.env.PORT, () => { console.log("server running on port: "+ process.env.PORT)});