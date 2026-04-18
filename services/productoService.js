const Producto = require('../models/producto')
const Receta = require('../models/receta')
const Ingrediente = require('../models/ingrediente')
const Venta = require('../models/venta')

const productoService = {
  obtenerProductosDisponibles: function () {
    return Producto.find({ disponible: true }).exec()
  },

  obtenerProductosDisponiblesPorCategoria: function (categoria) {
    return Producto.find({ disponible: true, categoria: categoria }).exec()
  },

  actualizarDisponibilidad: function (prodId, disponible) {
    return Producto.findOneAndUpdate(
      { prod_id: prodId },
      { disponible: disponible },
      { returnDocument: 'after' }
    ).exec()
  },

  verificarDisponibilidad: async function (prodId) {
    try {
      const receta = await Receta.findOne({ prod_id: prodId }).exec()
      if (!receta) return false

      for (let ingrediente of receta.ingredientes) {
        const ing = await Ingrediente.findOne({ ing_id: ingrediente.ing_id }).exec()
        if (!ing || ing.stock <= ing.minimo) {
          return false
        }
      }
      return true
    } catch (err) {
      return false
    }
  },

  obtenerProductoTopVendido: async function () {
    try {
      const resultado = await Venta.aggregate([
        { $unwind: '$productos' },
        {
          $group: {
            _id: '$productos.prod_id',
            totalVendido: { $sum: '$productos.cantidad' }
          }
        },
        { $sort: { totalVendido: -1 } },
        { $limit: 1 }
      ]).exec()

      if (resultado.length === 0) {
        return null
      }

      const prodId = resultado[0]._id
      const totalVendido = resultado[0].totalVendido

      const producto = await Producto.findOne({ prod_id: prodId }).exec()
      
      if (!producto) {
        return null
      }

      return {
        prod_id: producto.prod_id,
        nombre: producto.nombre,
        precio: producto.precio,
        totalVendido: totalVendido,
        ingresoTotal: producto.precio * totalVendido
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = productoService
