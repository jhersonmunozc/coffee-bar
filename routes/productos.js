const { Router } = require('express')
const productosController = require('../controllers/productosController')

const router = Router()

// Menú Público Dinámico - Consulta 1
router.get('/menu', productosController.obtenerMenu)

module.exports = router
