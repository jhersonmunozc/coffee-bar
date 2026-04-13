const { Router } = require('express')
const ingredientesController = require('../controllers/ingredientesController')
const autenticacionService = require('../services/autenticacionService')

const router = Router()

// Actualización de Stock - Consulta 5
router.put(
  '/',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.actualizarStock
)

// Ingredientes Críticos para Admin
router.get(
  '/criticos',
  autenticacionService.verificarToken,
  autenticacionService.verifyAdmin,
  ingredientesController.obtenerIngredientesCriticos
)

module.exports = router
