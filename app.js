const express = require('express')

const app = express()

// settings
app.set('port', process.env.PORT || 3000)

// middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// routes
const productosRoutes = require('./routes/productos')
const ventasRoutes = require('./routes/ventas')
const alertasRoutes = require('./routes/alertas')
const ingredientesRoutes = require('./routes/ingredientes')

app.use('/api/productos', productosRoutes)
app.use('/api/ventas', ventasRoutes)
app.use('/api/alertas', alertasRoutes)
app.use('/api/ingredientes', ingredientesRoutes)

module.exports = app