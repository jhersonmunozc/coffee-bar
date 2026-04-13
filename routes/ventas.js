const { Router } = require('express')
const ventasController = require('../controllers/ventasController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// Registro de Venta Presencial - Consulta 2
router.post(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyBarista,
  ventasController.registrarVenta
)

module.exports = router
