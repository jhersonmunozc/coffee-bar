# 🧪 Guía de Testing - Cafésino API (10/10 Funcionalidades)

## Importar Colección en Postman

1. Abrir **Postman**
2. Click en **"Collections"** (lado izquierdo)
3. Click en **"Import"**
4. Seleccionar archivo: `Cafesino-API.postman_collection.json`
5. La colección aparecerá con **10 endpoints** listos para usar

---

## 📋 Variables Globales Preconfiguradas

```
base_url: http://localhost:3000
barista_token: active (Token U001)
admin_token: active (Token U002)
barista_id: U001
admin_id: U002
```

Todas las requests están configuradas para usar estas variables automáticamente.

---

## 🧪 FLUJO DE TESTING COMPLETO

### **FASE 1: PRODUCTOS (Cliente)**

#### 1️⃣ Obtener Menú Público
```
GET /api/productos/menu
Auth: ✗ (Sin autenticación)
Expected: 200 OK con productos disponibles
```

**¿Qué verifica?**
- Lista de productos con `disponible: true`
- Solo ingredientes con stock > minimo
- Array vacío [] si no hay productos

---

#### 9️⃣ Filtrar Menú por Categoría
```
GET /api/productos/menu?categoria=Bebida
Auth: ✗ (Sin autenticación)
Expected: 200 OK con solo productos de la categoría
```

**¿Qué verifica?**
- Filtro opcional funciona
- Sin parámetro: retorna todos disponibles
- Con parámetro: solo esa categoría

---

### **FASE 2: VENTAS & STOCK (Barista + Admin)**

#### 2️⃣ Registrar Venta Presencial
```
POST /api/ventas
Auth: ✓ Barista (U001)
Headers: Authorization, X-Usuario-Id
Body:
{
  "venta_id": "V1001",
  "productos": [{"prod_id": "P004", "cantidad": 1}],
  "total": 4500
}

Expected: 201 Created
Response include: venta + alertas_generadas
```

**¿Qué verifica?**
- ✅ Venta registrada
- ✅ Ingredientes descontados automáticamente
- ✅ Alertas generadas si stock <= minimo
- ✅ Productos actualizados a disponible: false si es necesario
- ❌ 422 si stock insuficiente
- ❌ 403 si no es Barista

**Escenarios:**
- `Éxito`: Cantidad suficiente → 201 + alertas
- `Error Stock`: Insuficiente → 422
- `Error Auth`: No Barista → 403

---

#### 5️⃣ Actualizar Stock (Reabastecimiento)
```
PUT /api/ingredientes
Auth: ✓ Admin (U002)
Headers: Authorization, X-Usuario-Id
Body:
{
  "ing_id": "I005",
  "cantidad": 1000
}

Expected: 200 OK con ingrediente actualizado
```

**¿Qué verifica?**
- ✅ Stock se SUMA (no se reemplaza)
- ✅ Productos con stock > minimo → disponible: true
- ❌ 404 si ingrediente no existe
- ❌ 422 si stock resultante sería negativo
- ❌ 403 si no es Admin

**Fórmula:**
```
stock_final = stock_actual + cantidad
Ejemplo: 2000g + 1000g = 3000g ✅
Ejemplo: 500g + (-600g) = error 422 ❌
```

---

#### ⭐ Ingredientes Críticos (Dashboard)
```
GET /api/ingredientes/criticos
Auth: ✓ Admin ONLY (U002)
Expected: 200 OK con ingredientes donde stock <= minimo
```

**¿Qué verifica?**
- Solo ingredientes con stock crítico
- Ordenados por criticidad (más bajos primero)
- Array vacío [] si todo está bien

---

### **FASE 3: ALERTAS (Barista + Admin)**

#### 4️⃣ Obtener Alertas de Stock (Barista)
```
GET /api/alertas
Auth: ✓ Barista/Admin
Expected: 200 OK con alertas no vistas (visto: false)
```

**¿Qué verifica?**
- ✅ Solo visto: false
- ✅ Ordenadas por fecha DESC
- ✅ Capo nivel ("Bajo" o "Agotado")
- Array vacío [] si no hay alertas sin ver

---

#### 🔟 Historial de Alertas (Admin)
```
GET /api/alertas/historial/todas?visto=false&limit=10&offset=0
Auth: ✓ Admin ONLY
Query params: visto (opcional), limit, offset
Expected: 200 OK con historial completo
```

**¿Qué verifica?**
- ✅ Filtro visto: true/false
- ✅ Paginación con limit + offset
- ✅ Todas las alertas (vistas y no vistas)
- ✅ Ordenadas por fecha DESC

**Ejemplos:**
- `?visto=false` → Solo no vistas
- `?visto=true` → Solo vistas
- `?limit=50&offset=100` → Registros 101-150
- Sin parámetros → Primeros 50

---

### **FASE 4: KPIs (Admin)**

#### 6️⃣ Reporte de Ventas Diarias
```
GET /api/ventas/reporte/diario
Auth: ✓ Admin ONLY (U002)
Expected: 200 OK con KPI del día
Response:
{
  "fecha": "2026-04-17",
  "totalDia": 54000,
  "cantidadVentas": 12,
  "promedioPorVenta": 4500
}
```

**¿Qué verifica?**
- ✅ Suma de ventas desde 00:00 a 23:59
- ✅ Cantidad de ventas
- ✅ Promedio por venta
- ✅ Retorna 0 si no hay ventas

---

#### 7️⃣ Producto Más Vendido (TOP KPI)
```
GET /api/productos/kpi/top-vendido
Auth: ✓ Admin ONLY (U002)
Expected: 200 OK con producto #1
Response:
{
  "prod_id": "P004",
  "nombre": "Americano",
  "precio": 4500,
  "totalVendido": 150,
  "ingresoTotal": 675000
}
```

**¿Qué verifica?**
- ✅ TOP 1 producto más vendido
- ✅ Cantidad total vendida
- ✅ Ingreso total (precio × cantidad)
- ✅ null si no hay ventas

**Uso:** Admin identifica productos claves para optimizar compras

---

### **FASE 5: RECETAS (Admin - CRUD)**

#### 8️⃣A - Crear Receta
```
POST /api/recetas
Auth: ✓ Admin ONLY
Body:
{
  "prod_id": "P005",
  "ingredientes": [
    {"ing_id": "I003", "cantidad": 50.0},
    {"ing_id": "I005", "cantidad": 15.0}
  ]
}

Expected: 201 Created
```

**¿Qué verifica?**
- ✅ Receta creada correctamente
- ✅ Ingredientes válidos
- ✅ Cantidad > 0
- ❌ 404 si prod_id no existe
- ❌ 404 si ing_id no existe
- ❌ 422 si cantidad <= 0

---

#### 8️⃣B - Obtener Todas las Recetas
```
GET /api/recetas
Auth: ✓ Admin ONLY
Expected: 200 OK con array de recetas
Response:
[
  {"prod_id": "P001", "ingredientes": [...]},
  {"prod_id": "P002", "ingredientes": [...]}
]
```

---

#### 8️⃣C - Actualizar Receta
```
PUT /api/recetas/P005
Auth: ✓ Admin ONLY
Body:
{
  "ingredientes": [
    {"ing_id": "I003", "cantidad": 60.0},
    {"ing_id": "I005", "cantidad": 12.0}
  ]
}

Expected: 200 OK con receta actualizada
```

**¿Qué verifica?**
- ✅ Ingredientes actualizados
- ✅ Cantidades modificadas
- ❌ 404 si receta no existe

---

#### 8️⃣D - Eliminar Receta
```
DELETE /api/recetas/P005
Auth: ✓ Admin ONLY
Expected: 204 No Content (sin body)
```

**¿Qué verifica?**
- ✅ Receta eliminada
- ❌ 404 si no existe

---

## 🔐 Matriz de Autenticación

```
Endpoint                    │ Auth │ Rol        │ Status
─────────────────────────────┼──────┼────────────┼────────
#1  Menú                      │  ✗   │     -      │ 200/500
#2  Registrar Venta           │  ✓   │  Barista   │ 201/400/401/403/422/500
#3  Alertas (no vistas)       │  ✓   │  Barista   │ 200/401/500
#4  Stock Update              │  ✓   │  Admin     │ 200/400/401/403/404/422/500
#5  Ingredientes Críticos     │  ✓   │  Admin     │ 200/401/403/500
#6  Ventas Diarias            │  ✓   │  Admin     │ 200/401/403/500
#7  Top Producto              │  ✓   │  Admin     │ 200/401/403/500
#8A Crear Receta              │  ✓   │  Admin     │ 201/400/401/403/404/500
#8B Obtener Recetas           │  ✓   │  Admin     │ 200/401/403/500
#8C Actualizar Receta         │  ✓   │  Admin     │ 200/400/401/403/404/500
#8D Eliminar Receta           │  ✓   │  Admin     │ 204/401/403/404/500
#9  Filtro Categoría          │  ✗   │     -      │ 200/500
#10 Historial Alertas         │  ✓   │  Admin     │ 200/401/403/500
```

---

## ⚡ Quick Start - Orden Recomendado

**Día 1 - Funciones Básicas:**
1. GET /api/productos/menu (Cliente)
2. GET /api/productos/menu?categoria=Bebida (Filtro)
3. POST /api/ventas (Barista - venta exitosa)
4. GET /api/alertas (Barista - ver alertas generadas)

**Día 2 - Stock & Admin:**
5. PUT /api/ingredientes (Admin - reabastecimiento)
6. GET /api/ingredientes/criticos (Dashboard)
7. GET /api/ventas/reporte/diario (KPI ventas)
8. GET /api/productos/kpi/top-vendido (KPI productos)

**Día 3 - CRUD Recetas:**
9. POST /api/recetas (Admin - crear)
10. GET /api/recetas (Admin - listar)
11. PUT /api/recetas/P005 (Admin - actualizar)
12. DELETE /api/recetas/P005 (Admin - eliminar)

**Día 4 - Edge Cases:**
- POST /api/ventas con stock insuficiente → 422
- PUT /api/ingredientes cantidad negativa muy grande → 422
- Requests sin autenticación → 401
- Admin intentando como Barista → 403

---

## 🔍 Validar Respuestas

### ✅ Respuesta Exitosa (Ejemplo)
```json
{
  "venta_id": "V1001",
  "barista_id": "U001",
  "total": 4500,
  "alertas_generadas": [
    {
      "ing_id": "I005",
      "nivel": "Bajo",
      "msj": "Stock crítico: Café en grano (491g)"
    }
  ]
}
```

### ❌ Error (Ejemplo)
```json
{
  "message": "Stock insuficiente de I005"
}
```
**Status:** 422 Unprocessable Entity

---

## 🚀 Verificar Todos los Endpoints

**Script para verificar en paralelo:**

```bash
# 1. Menú completo
curl http://localhost:3000/api/productos/menu

# 2. Menú por categoría
curl "http://localhost:3000/api/productos/menu?categoria=Bebida"

# 3. Alertas activas (requiere auth)
curl -H "Authorization: active" -H "X-Usuario-Id: U001" http://localhost:3000/api/alertas

# 4. Ingredientes críticos (admin)
curl -H "Authorization: active" -H "X-Usuario-Id: U002" http://localhost:3000/api/ingredientes/criticos

# 5. Ventas diarias (admin)
curl -H "Authorization: active" -H "X-Usuario-Id: U002" http://localhost:3000/api/ventas/reporte/diario

# 6. Top producto (admin)
curl -H "Authorization: active" -H "X-Usuario-Id: U002" http://localhost:3000/api/productos/kpi/top-vendido

# 7. Recetas (admin)
curl -H "Authorization: active" -H "X-Usuario-Id: U002" http://localhost:3000/api/recetas

# 8. Historial alertas (admin)
curl -H "Authorization: active" -H "X-Usuario-Id: U002" "http://localhost:3000/api/alertas/historial/todas"
```

---

## 📊 Testear Transacciones Completas

### Escenario Completo: Venta → Alerta → Reporte

**T0 - Estado Inicial**
```
GET /api/ingredientes/criticos
- Café: 5000g (> 500 minimo) ✅
```

**T1 - Barista vende 10 Americanos**
```
POST /api/ventas
- Cantidad: 10
- Café descuenta: 10 × 9g = 90g
- Café nuevo: 5000 - 90 = 4910g ✅
```

**T2 - Verificar alertas generadas**
```
GET /api/alertas
- Retorna: [], Sin alertas (4910 > 500) ✅
```

**T3 - Admin vende otras cosas para bajar stock**
```
POST /api/ventas (múltiples)
- Total de descuentos: 4500g (ejemplo)
- Café: 5000 - 4590 = 410g
```

**T4 - Verificar alertas ahora**
```
GET /api/alertas
- Retorna: [{ing_id: "I005", nivel: "Bajo", ...}] ⚠️
```

**T5 - Admin reabastece**
```
PUT /api/ingredientes
- ing_id: I005
- cantidad: 2000
- Stock: 410 + 2000 = 2410g ✅
```

**T6 - Ver reporte diario**
```
GET /api/ventas/reporte/diario
- totalDia: (suma de todas ventas)
- cantidadVentas: 11
- promedioPorVenta: (calculado)
```

---

## 📋 Checklist de Verificación Final

- [ ] 10 endpoints implementados
- [ ] Todos retornan códigos HTTP correctos
- [ ] Autenticación funciona (401/403)
- [ ] Agregaciones MongoDB funcionan
- [ ] CRUD recetas completo
- [ ] Filtros de categoría
- [ ] Historial de alertas con paginación
- [ ] KPIs calculan correctamente
- [ ] Stock no puede ser negativo (422)
- [ ] Alertas se generan automáticamente

---

**Estado del Proyecto:** ✅ 10/10 Funcionalidades Implementadas
**Última actualización:** 2026-04-17
