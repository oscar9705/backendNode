const mongoose = require('mongoose');

// defition enviroments variables, example: PORT=3001 APIKEY=880088 node simple-env -> npm i dotenv

const dbConnection = async () => {
    try{
        mongoose.connect(process.env.DB_CNN, 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('DB online');

    }catch(error){
        throw new Error('Error a la hora de iniciar la BD ver logs');
    }

}
module.exports = {
    dbConnection
}