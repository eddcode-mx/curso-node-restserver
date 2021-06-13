const mongoose = require('mongoose');

const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {

    const existRol = await Role.findOne({rol});
    if(!existRol) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async(correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail) {
        throw new Error(`El correo: ${correo}, ya está registrado`);
    }
}

const existeUsuarioPorId = async(id = '') => {
    if (mongoose.Types.ObjectId.isValid(id)) {
        // Verificar si el ID de usuario existe
        const existeUsuario = await Usuario.findById(id);
        if(!existeUsuario) {
            throw new Error(`El ID no existe: ${id}`);
        }
    } else {
        throw new Error(`${ id } no es un ID válido`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}