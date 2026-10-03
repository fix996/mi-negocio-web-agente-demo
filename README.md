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

Node.js 22.13 o posterior.

```sh
npm ci
npm run dev
npm run check
```

`npm run check` comprueba formato, ejecuta las pruebas, verifica tipos, compila y revisa el contenido público. Incluye presupuestos de 100 KB gzip de JavaScript y 10 KB gzip de CSS (medición local), y búsqueda de patrones comunes de secretos. Esta búsqueda no reemplaza una revisión de seguridad ni inspecciona todo el historial Git.

`npm run format` aplica el formato acordado. `npm run preview` sirve el build local. Después de cambios de interfaz también se debe revisar escritorio y celular en navegador; esa revisión no la reemplaza la compilación.

## Organización del código

| Ubicación | Responsabilidad |
| --- | --- |
| `app/page.tsx` | Componer el dashboard y su navegación |
| `components/views/` | Buscador, leads, historial, agencia y saldo |
| `components/lead-dialog.tsx` | Ficha accesible y copia del contacto de ejemplo |
| `hooks/use-demo.ts` | Coordinar la simulación y el estado de la demo |
| `lib/plan.ts` | Precios, límites y reglas del saldo ficticio |
| `lib/demo-storage.ts` | Validar y recuperar los datos locales |
| `lib/search-query.ts` | Interpretar la consulta de ejemplo, sin IA |
| `app/styles/` | Estilos organizados por pantalla y elementos compartidos |

Se retiraron los componentes de biblioteca sin uso y la pantalla de acceso simulado. Se usan HTML semántico, un selector nativo y un diálogo modal nativo con cierre por Escape y recuperación del foco. Los datos locales se validan antes de mostrarlos y se conserva el formato anterior de la demo.

Las instrucciones de mantenimiento están en `AGENTS.md`. El flujo de GitHub Actions ejecuta los controles en pushes y pull requests; no sustituye la comprobación previa a publicar ni una protección de rama.

La compilación genera `docs/`. GitHub Pages publica desde `main`, carpeta `/docs`. Esta demo no requiere claves ni credenciales. La tipografía Geist incluye su licencia en `public/fonts/OFL.txt`.

El código frontend es público por naturaleza. `.gitignore` evita versionar determinados archivos; no protege rutas, cuentas ni información que se envía al navegador. Cambiar nombres de archivos, minificarlos o separar componentes no convierte esta demo en un servicio privado.
