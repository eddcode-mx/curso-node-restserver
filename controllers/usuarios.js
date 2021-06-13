const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req = request, res = response) => {

    // Argumentos opcionales
    const {limite = 5, desde = 0} = req.query;
    const query = {estado: true};

    const [total, usuarios] = await Promise. all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contrasena
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.status(201).json({
        usuario
    });
}

const usuariosPut = async(req, res = response) => {
    const {id} = req.params;
    
    // Parametros que no se veran con opción de actualizar
    const {_id, password, google, correo, ...resto} = req.body;

    // TODO validar contra base de datos
    if(password) {
        // Encriptar la contrasena
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.status(500).json(usuario);
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params;

    // MANERA DE ELIMINAR USUARIO FISICAMENTE:
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    res.json(usuario);
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}