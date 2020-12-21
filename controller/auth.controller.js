const {response} = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../model/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        const userDb = await Usuario.findOne({email});
        if(!userDb){
            return res.status(404).json({
                ok: false,
                msg: "email no valido"
            });
        }

        //verficar la contraseña
        const validPassword = bcrypt.compareSync(password, userDb.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "contraseña no válida"
            });

        }
        // generar token
        const token = await generarJWT(userDb.id);

        res.status(200).json({
            ok:true,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: "error inesperado en el login"
        });
    }

}
module.exports = {
    login
}