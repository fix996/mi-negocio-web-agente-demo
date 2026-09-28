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

## Oferta comercial propuesta

- Activación y configuración: **ARS 50.000 por única vez**, incluye acceso privado para la agencia y **3 búsquedas iniciales**.
- Búsquedas adicionales: **ARS 10.000 cada una**, hasta 25 negocios según disponibilidad; recomendamos revisar 10.
- Sin abono mensual. La activación no se repite al recargar.
- ARS 30.000 de recarga = 3 búsquedas adicionales; ARS 100.000 = 10. Las búsquedas incluidas pendientes se suman por separado.
- Recarga asistida prevista: elegir importe, solicitar por WhatsApp, confirmar pago y acreditar manualmente en la cuenta. No hay integración de pagos ni WhatsApp en esta demo.
- El saldo no vence al cambiar el mes. Consultar fichas y guardar resultados no consume saldo.
- Se propone no cobrar búsquedas fallidas o sin resultados; si hay menos negocios que los pedidos pero hay resultados, se consume una búsqueda completa.
- No se garantizan interés ni ventas. Puede haber coincidencias entre búsquedas.

## Navegación móvil

Seis accesos fijos al pie: Inicio, Buscar, Leads, Historial, Agencia y Saldo. No se usa el panel lateral móvil. La presentación muestra ambos precios y acceso directo a la demo y las condiciones. Se conserva la barra lateral en escritorio.

## Límites de esta demostración

Los negocios, puntuaciones, contactos y dinero son ficticios. Los correos usan el dominio reservado .example y no sirven para contactar negocios reales. **No hay IA, búsqueda en internet, autenticación, pagos ni mensajes salientes.** No ingresar datos sensibles.

La demo nueva empieza con saldo cero y tres búsquedas incluidas de ejemplo. Se consumen antes de descontar saldo. El botón «Simular recarga» no cobra. Las billeteras anteriores conservan dinero y gasto acumulado, sin recibir otras tres búsquedas: ya habían recibido saldo de prueba. Perfil, historial y búsquedas pendientes se conservan en este navegador. Estos límites locales no son controles de facturación por cuenta real.

Antes del servicio real faltan cuentas privadas, backend, acreditación administrativa, registro de pagos, separación entre agencias, control de gastos, fuentes verificadas y medición de calidad y costos.

## Desarrollo y publicación

Node.js 22.13 o posterior. Ejecutar npm ci, npm run dev o npm run build.

La compilación genera docs/. GitHub Pages publica desde main, carpeta /docs. No contiene claves ni credenciales. La tipografía Geist incluye su licencia en public/fonts/OFL.txt.
