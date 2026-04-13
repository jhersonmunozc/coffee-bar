const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usuarioSchema = new Schema({
  usuario_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  rol: { type: String, enum: ['Barista', 'Administrador'], required: true },
  email: { type: String, required: true },
  token_jwt: { type: String, required: true }
})

module.exports = mongoose.model('usuario', usuarioSchema, 'usuarios')
