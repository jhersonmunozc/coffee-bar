let mongoose = require('mongoose')
const app = require('./app')

mongoose.Promise = global.Promise

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB exitosa')
})

mongoose.connection.on('error', (err) => {
  console.error('Error de MongoDB:', err.message)
})

mongoose.connect('mongodb://127.0.0.1:27017/db-sincronizacion-inventario')
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`Servidor ejecutándose en http://localhost:${app.get('port')}`)
    })
  })
  .catch(err => {
    console.error('Error de conexión:', err.message)
    process.exit(1)
  })