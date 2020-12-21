const {response, request} = require('express');

const bcrypt = require('bcryptjs');
const Usuario = require('../model/usuario');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios =  async(req = request, res = response) => {
    const usuarios = await Usuario.find({}, 'nombre email role google');
    res.status(200).json({
        ok: true,
        usuarios,
        uid: req.uid
    });
}

const crearUsuario = async(req, res= response) => {

    const { email, password } = req.body;
    


    try{
        const emailExist = await Usuario.findOne({email});
        if(emailExist){
            return res.status(400).json({
                ok: false,
                msg: "el correo ya está registrado"
            });
        }
        const usuario = new Usuario(req.body);

        // encriptar el password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)
        
        await usuario.save();
        const token = await generarJWT(usuario.id);

        res.status(200).json({
            ok: true,
            usuario,
            token
        });

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: "error inesperado "
        })
    }

}

const updateUser = async (req, res = response) => {
    const uid = req.params.id;

    try{
        const userDb = await Usuario.findById(uid, (err, docs) =>{
                if(err) {
                    console.log(err.reason);
                    return res.status(400).json({
                        ok:false,
                        msg: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters '
                    });
                } else{
                    console.log(docs)
                }
        });
        
        if(!userDb){
            return res.status(404).json({
                ok:false,
                msg: 'usuario no existe'
            });
        }
        // actualizaciones
        const {password, google, email,  ...campos} = req.body;

        if(userDb.email !== email){
            //delete campos.email;
            const existeEmail = await Usuario.findOne({email: req.body.email});
            if(existeEmail) {
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        } 
        campos.email  = email;
        //con el operador spread E6 nos evitamos eliminar el campo que no va a ser modificado
        /* delete campos.password;
        delete campos.google; */
        
        const updateUser = await Usuario.findByIdAndUpdate(uid, campos,{new:true});

        res.status(200).json({
            ok: true,
            updateUser
        });
    }
    catch(error){
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        });
    }
}
const deleteUser = async (req, res= response) => {
    const uid = req.params.id;
    try{
        const userDb = await Usuario.findById(uid, (err, docs) =>{
            if(err) {
                console.log(err.reason);
                return res.status(400).json({
                    ok:false,
                    msg: 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters '
                });
            } else{
                console.log(docs)
            }
        });
    
        if(!userDb){
            return res.status(404).json({
                ok:false,
                msg: 'usuario no existe'
            });
        }
        await Usuario.findByIdAndDelete(uid);
        res.status(200).json({
            ok:true,
            msg: "usuario eliminado"
        });
    }
    catch(error){
        res.status(500).json({
            ok:true,
            msg: "Error inesperado"
        });
    }
    
}

module.exports = {
    getUsuarios,
    crearUsuario,
    updateUser,
    deleteUser
}