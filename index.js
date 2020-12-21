const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection} = require('./database/config');


// create server 
const app = express();

// configure CORS
app.use(cors())

// lectura y parseo del body
app.use(express.json());
// database

dbConnection();

// console.log(process.env);

//rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/login', require('./routes/auth.routes'));



app.listen(process.env.PORT, () => { console.log("server running on port: "+ process.env.PORT)});