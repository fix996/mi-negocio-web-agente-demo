# MI NEGOCIO WEB · Agente de clientes

[Probar demo pública](https://fix996.github.io/mi-negocio-web-agente-demo/)

Dashboard para presentar a agencias web un servicio de búsqueda de oportunidades comerciales.

## Experiencia

- «Tu espacio» abre con una presentación del servicio para que las agencias encuentren clientes para sus propios servicios web: personalización, búsqueda por rubro y zona de Argentina, y oportunidades con contexto.
- Ejemplo ficticio de oportunidad y explicación clara de las funciones propuestas frente a lo que esta demo permite probar.
- Un solo buscador: por ejemplo, «10 inmobiliarias en Córdoba».
- Nombre del agente y perfil de agencia personalizables.
- De 1 a 25 negocios por búsqueda; 10 recomendados para empezar a revisar.
- Fichas, contactos ilustrativos copiables, guardados e historial. Sin exportación CSV.
- Logo proporcionado por MI NEGOCIO WEB, presentado dentro de un círculo.

## Propuesta prepaga

Las **primeras tres búsquedas cuestan ARS 10.000 cada una** (ARS 30.000 las tres). **Desde la cuarta, ARS 25.000 por búsqueda**, independientemente de la cantidad elegida (hasta 25 negocios). La recarga mínima es de ARS 10.000.

- Al empezar: ARS 30.000 = 3 búsquedas, hasta 75 resultados en total.
- Al empezar: ARS 105.000 = 6 búsquedas (3 iniciales + 3 regulares), hasta 150 resultados en total.
- Al empezar: ARS 100.000 = 5 búsquedas y ARS 20.000 restantes. Después de la promoción: ARS 100.000 = 4 búsquedas.
- La tarifa inicial se aplica una sola vez; no se reinicia al recargar o cambiar el mes. Un contador independiente del historial conserva cuántas búsquedas se completaron con esta tarifa.
- Sin abono mensual; el saldo se conserva al cambiar el mes.
- Recarga asistida: en el futuro servicio, MI NEGOCIO WEB acredita el saldo tras confirmar el pago.
- Se propone no descontar búsquedas fallidas o sin resultados. Si hay menos negocios que los pedidos, una búsqueda con resultados consume el precio completo. Revisar y guardar fichas no consume saldo.
- Más resultados pueden incluir coincidencias menos ajustadas; el número de búsquedas no degrada automáticamente la calidad. No se garantizan clientes interesados ni ventas. Puede haber coincidencias entre búsquedas.

## Límites de esta demostración

Los negocios, puntuaciones, contactos y dinero son ficticios. Los correos usan el dominio reservado .example y no sirven para contactar negocios reales. **No hay IA, búsqueda en internet, autenticación, pagos ni mensajes salientes.** No ingresar datos sensibles.

El saldo inicial de ARS 30.000 permite probar las tres búsquedas iniciales; el botón «Simular recarga» no cobra. Todos los cambios se guardan en este navegador. Las billeteras de la versión anterior conservan saldo y gasto acumulado y comienzan la nueva promoción con contador cero; las nuevas billeteras conservan el contador entre sesiones. Los límites locales no constituyen controles de facturación por cuenta real.

Antes del servicio real faltan cuentas privadas, backend, acreditación administrativa, registro de pagos, separación entre agencias, control de gastos, fuentes verificadas y medición de calidad y costos.

## Desarrollo y publicación

Node.js 22.13 o posterior. Ejecutar npm ci, npm run dev o npm run build.

La compilación genera docs/. GitHub Pages publica desde main, carpeta /docs. No contiene claves ni credenciales. La tipografía Geist incluye su licencia en public/fonts/OFL.txt.
