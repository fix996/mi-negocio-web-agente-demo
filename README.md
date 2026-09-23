# MI NEGOCIO WEB · Agente de clientes

Demo pública para presentar a agencias de diseño y desarrollo web un servicio de búsqueda de oportunidades comerciales.

## Probar

Buscá, por ejemplo, «10 inmobiliarias en Córdoba». Personalizá la agencia, elegí el nombre del agente y explorá las fichas, los favoritos y el historial.

**Es un prototipo:** los negocios y puntajes son ficticios. No consulta internet, no utiliza una API de IA, no envía mensajes y no cobra. El acceso con contraseña es ilustrativo y no autentica usuarios. No ingreses datos sensibles. El perfil y las búsquedas se guardan solo en tu navegador; no se comparten con otras agencias.

## Propuesta piloto

- Esencial: ARS 69.000/mes, 30 búsquedas de hasta 20 negocios analizados por búsqueda.
- Configuración inicial del agente: ARS 49.000, una sola vez.
- Opcional: 10 búsquedas extra por ARS 19.000, válidas en el ciclo vigente.
- Cupo mensual no acumulable. Una consulta completada con resultados consume una búsqueda; se propone no descontar consultas fallidas o sin resultados.
- La cantidad depende de la disponibilidad de negocios. Una oportunidad no garantiza interés, presupuesto ni una venta.

Precios propuestos para validar el piloto, sin contratación ni cobros habilitados. El servicio real requiere cuentas privadas, verificación de fuentes, límites de consumo en servidor y medición de calidad y costos antes de su lanzamiento.

## Desarrollo y publicación

Node.js 22.13 o posterior. Ejecutar `npm ci`, `npm run dev` o `npm run build`.

La compilación genera `docs/` para GitHub Pages. Publicar desde la rama `main`, carpeta `/docs`. El código fuente y la compilación están en este mismo repositorio. No contiene claves ni configuración de cuentas privadas.

En la demo el contador se renueva el primer día del mes (hora argentina); en un servicio con cobros se renovaría con cada ciclo de suscripción. El contador local es ilustrativo, no un control de facturación.
