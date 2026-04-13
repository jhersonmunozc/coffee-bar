const { Router } = require('express')
const alertasController = require('../controllers/alertasController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// Alerta de Insumos Críticos - Consulta 4
router.get(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyBarista,
  alertasController.obtenerAlertas
)

module.exports = router
