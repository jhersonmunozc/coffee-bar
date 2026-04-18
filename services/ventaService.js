const Venta = require('../models/venta')
const Receta = require('../models/receta')
const Ingrediente = require('../models/ingrediente')
const Alerta = require('../models/alerta')
const inventarioService = require('./inventarioService')
const alertaService = require('./alertaService')

const ventaService = {
  registrarVenta: async function (ventaId, baristaId, productos, total) {
    try {
      // Validar stock para todos los productos
      for (let prod of productos) {
        const receta = await Receta.findOne({ prod_id: prod.prod_id }).exec()
        if (!receta) throw new Error(`Receta no encontrada para ${prod.prod_id}`)

        for (let ing of receta.ingredientes) {
          const ingrediente = await Ingrediente.findOne({ ing_id: ing.ing_id }).exec()
          const stockNecesario = ing.cantidad * prod.cantidad
          if (!ingrediente || ingrediente.stock < stockNecesario) {
            throw new Error(`Stock insuficiente de ${ing.ing_id}`)
          }
        }
      }

      // Crear venta
      const venta = new Venta()
      venta.venta_id = ventaId
      venta.barista_id = baristaId
      venta.productos = productos
      venta.total = total

      // Array para coleccionar alertas generadas
      const alertasGeneradas = []

      // Descontar ingredientes y crear alertas
      for (let prod of productos) {
        const receta = await Receta.findOne({ prod_id: prod.prod_id }).exec()
        for (let ing of receta.ingredientes) {
          const stockADescontar = ing.cantidad * prod.cantidad
          await inventarioService.descontarStock(ing.ing_id, stockADescontar)

          // Crear alerta si stock es crítico
          const ingrediente = await Ingrediente.findOne({ ing_id: ing.ing_id }).exec()
          if (ingrediente.stock <= ingrediente.minimo) {
            const alerta = await alertaService.crearAlerta(ing.ing_id)
            alertasGeneradas.push(alerta)
          }
        }
      }

      // Guardar venta
      const ventaGuardada = await venta.save()

      // Retornar venta y alertas generadas
      return {
        venta: ventaGuardada,
        alertas: alertasGeneradas
      }
    } catch (err) {
      throw err
    }
  }
}

module.exports = ventaService
