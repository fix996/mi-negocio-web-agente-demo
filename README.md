# MI NEGOCIO WEB · Agente de clientes

[Probar demo pública](https://fix996.github.io/mi-negocio-web-agente-demo/)

Dashboard para presentar a agencias web un servicio de búsqueda de oportunidades comerciales.

## Experiencia

- Un solo buscador: por ejemplo, «10 inmobiliarias en Córdoba».
- Nombre del agente y perfil de agencia personalizables.
- De 1 a 25 negocios por búsqueda; 10 recomendados para empezar a revisar.
- Fichas, contactos ilustrativos copiables, guardados e historial. Sin exportación CSV.
- Logo proporcionado por MI NEGOCIO WEB, presentado dentro de un círculo.

## Propuesta prepaga

Una búsqueda completada con resultados cuesta **ARS 3.000**, independientemente de la cantidad elegida (hasta 25 negocios). Reemplaza la propuesta anterior de abono mensual y configuración separada.

- ARS 30.000 = 10 búsquedas, hasta 250 resultados en total.
- ARS 100.000 = 33 búsquedas y ARS 1.000 de saldo restante.
- Sin abono mensual; el saldo se conserva al cambiar el mes.
- Recarga asistida: en el futuro servicio, MI NEGOCIO WEB acredita el saldo tras confirmar el pago.
- Se propone no descontar búsquedas fallidas o sin resultados. Si hay menos negocios que los pedidos, una búsqueda con resultados consume el precio completo. Revisar y guardar fichas no consume saldo.
- Más resultados pueden incluir coincidencias menos ajustadas; el número de búsquedas no degrada automáticamente la calidad. No se garantizan clientes interesados ni ventas. Puede haber coincidencias entre búsquedas.

## Límites de esta demostración

Los negocios, puntuaciones, contactos y dinero son ficticios. Los correos usan el dominio reservado .example y no sirven para contactar negocios reales. **No hay IA, búsqueda en internet, autenticación, pagos ni mensajes salientes.** No ingresar datos sensibles.

El saldo inicial de ARS 30.000 permite probar la experiencia; el botón «Simular recarga» no cobra. Todos los cambios se guardan en este navegador. Se conservan los perfiles anteriores y se reemplaza el cupo mensual por una billetera de prueba independiente. Los límites locales no constituyen controles de facturación.

Antes del servicio real faltan cuentas privadas, backend, acreditación administrativa, registro de pagos, separación entre agencias, control de gastos, fuentes verificadas y medición de calidad y costos.

## Desarrollo y publicación

Node.js 22.13 o posterior. Ejecutar npm ci, npm run dev o npm run build.

La compilación genera docs/. GitHub Pages publica desde main, carpeta /docs. No contiene claves ni credenciales. La tipografía Geist incluye su licencia en public/fonts/OFL.txt.
