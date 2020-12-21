// rutas /api/usuarios

const { Router} = require('express');
const {check} = require('express-validator');

const {getUsuarios, crearUsuario, updateUser, deleteUser} = require('../controller/usuario.controller');
const {validarCampos} = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/',validarJWT,getUsuarios);
router.post('/',
[
    check('nombre','nombre es obligatorio').not().isEmpty(),
    check('password', 'password es obligatorio').not().isEmpty(),
    check('email', 'email es obligatorio').isEmail(),
    validarCampos
]
 ,crearUsuario);
router.put('/:id',
[
    validarJWT,
    check('nombre','nombre es obligatorio').not().isEmpty(),
    check('email', 'email es obligatorio').isEmail(),
    check('role', 'el role es obligatorio').isString(),
    validarCampos
]
 ,
 updateUser);

 router.delete('/:id',validarJWT, deleteUser);


module.exports = router;