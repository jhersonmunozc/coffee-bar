const { Router } = require('express')
const productosController = require('../controllers/productosController')

const router = Router()

// Menú Público Dinámico - Consulta 1 & Filtrado por Categoría - Consulta 9
router.get('/menu', productosController.obtenerMenu)

// Producto Más Vendido (KPI) - Consulta 7
router.get('/kpi/top-vendido', productosController.obtenerProductoTopVendido)

module.exports = router
