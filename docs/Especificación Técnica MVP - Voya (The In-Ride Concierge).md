# **Documento de Especificación Técnica: Proyecto Voya (MVP)**

**Versión:** 1.0  
**Stack:** MERN (Railway \+ MongoDB Atlas \+ Vercel)  
**Objetivo:** Implementar un sistema de recomendación geolocalizada mediante QR para conductores de plataforma.

## ---

**1\. Resumen de Arquitectura**

El sistema se dividirá en tres componentes principales diseñados para máxima velocidad de despliegue y costo cero o mínimo:

* **Frontend Pasajero (PWA):** React.js \+ Vite \+ Tailwind. Desplegado en Vercel. Optimizado para carga rápida en redes móviles.  
* **Backend API:** Node.js \+ Express. Desplegado en **Railway** (instancia escalable).  
* **Base de Datos:** MongoDB Atlas (Capa gratuita).  
* **Autenticación:** JWT para conductores y comercios; acceso público para pasajeros mediante ref\_id.

## ---

**2\. Modelo de Datos (Esquema MongoDB)**

Se utilizarán cuatro colecciones principales con validación de esquema:

| Colección | Campos Clave | Descripción   |
| :---- | :---- | :---- |
| **Drivers** | \_id, name, email, phone, qr\_code\_id, balance, status | Información del conductor y su saldo acumulado. |
| **Partners** | \_id, business\_name, category, location (lat/lng), contact\_info | Negocios que ofrecen promociones. |
| **Promotions** | \_id, partner\_id, title, description, reward\_value, commission\_per\_lead | Detalle de la oferta y cuánto gana el conductor por ella. |
| **Leads** | \_id, driver\_id, promo\_id, status (pending/completed), validation\_code | Registro de cada clic y su estado de conversión. |

## ---

**3\. Especificación de Endpoints (API)**

### **Public (Pasajeros)**

* GET /api/v1/promos/:driver\_qr\_id: Obtiene las promociones disponibles basadas en la ubicación y el ID del conductor.  
* POST /api/v1/leads/create: Genera un lead "pendiente" cuando un usuario selecciona una promoción. Retorna un validation\_code.

### **Private (Conductores)**

* GET /api/v1/driver/dashboard: Retorna métricas, balance actual y lista de leads convertidos.  
* GET /api/v1/driver/qr-assets: Genera el enlace dinámico para el QR físico.

### **Private (Partners/Negocios)**

* POST /api/v1/partners/validate: El negocio ingresa el validation\_code para marcar un lead como "completado" y disparar la acreditación de la comisión.

## ---

**4\. Lógica de Negocio Crítica (Flujo de Comisión)**

Para garantizar la integridad financiera en el MVP, la transacción de validación debe ser **atómica**:

`// Pseudo-código de validación`  
`async function validateLead(code, partnerId) {`  
    `const session = await db.startSession();`  
    `session.startTransaction();`  
    `try {`  
        `const lead = await Lead.findOneAndUpdate(`  
            `{ validation_code: code, status: 'pending' },`  
            `{ status: 'completed' },`  
            `{ session }`  
        `);`  
        `await Driver.updateOne(`  
            `{ _id: lead.driver_id },`  
            `{ $inc: { balance: lead.commission_amount } },`  
            `{ session }`  
        `);`  
        `await session.commitTransaction();`  
    `} catch (error) {`  
        `await session.abortTransaction();`  
    `}`  
`}`

## ---

**5\. Roadmap de Desarrollo (Sprints de 1 Semana)**

1. **Semana 1:** Configuración de Railway, Mongo Atlas y Boilerplate de Express. Definición de modelos de Mongoose.  
2. **Semana 2:** Frontend Pasajero (Landing del QR) y lógica de generación de Leads.  
3. **Semana 3:** Panel de Conductor y sistema de validación simple para el Negocio.  
4. **Semana 4:** Pruebas de integración, generación de QRs físicos y despliegue final.

## ---

**6\. Notas de Seguridad**

* Uso obligatorio de cors limitado a los dominios del frontend.  
* Sanitización de entradas para prevenir inyecciones NoSQL.  
* Variables de entorno (API\_KEYS, DB\_URI) gestionadas exclusivamente a través del dashboard de Railway.