'use strict'
const Boom = require('boom');
const users = require('../models/index')

async function createUser (req, h) {
    let result
    try {
        result = await users.create(req.payload)
    } catch (error) {
        console.error(error);
        return h.view('register', {
            title: 'Registro',
            error: 'Error creando el usuario'
        })
    }
    return h.view('register', {
        title: 'Registro',
        success: 'Usuario creado correctamente'
    })
}

function logout(req, h){
    return h.redirect('/login').unstate('user');
}

async function validateUser (req, h){
    let result
    try {
        result = await users.validateUser(req.payload)
        
        if (!result) {
            return h.view('login', {
                title: 'Login',
                error: 'Email y/o contraseña incorrecta'
            })
        }
    
    } catch (error) {
        console.error(error);
        return h.view('login', {
            title: 'Login',
            error: 'Problemas validando el usuario'
        })
    }
    return h.redirect('/').state('user', {
        name: result.name,
        email: result.email
    })
}

function failValidation(req, h, err) {
    Boom.badRequest('Falló la validación', req.payload)
}

module.exports = {
    createUser: createUser,
    validateUser: validateUser,
    logout: logout,
    failValidation: failValidation,
};