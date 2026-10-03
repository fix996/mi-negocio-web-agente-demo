# MI NEGOCIO WEB: instrucciones del proyecto

## Alcance

Esta es una demo pública estática de React + TypeScript + Vite, publicada en GitHub Pages desde `main/docs`. Mantener el diseño negro, blanco y dorado, el logo circular y la navegación móvil inferior. No cambiar la oferta sin pedido del usuario.

- Activación propuesta: ARS 50.000 una vez, tres búsquedas incluidas.
- Búsqueda adicional: ARS 10.000, de 1 a 25 negocios; 10 recomendados. Fuente única: `lib/plan.ts`.
- No hay IA conectada, cuentas, backend, pagos ni WhatsApp saliente. Mantener esa aclaración visible. Los correos `.example` no son contactos reales.
- Nunca añadir claves, contraseñas, formularios de acceso simulados ni promesas de privacidad implementada. localStorage solo conserva datos de demostración y no constituye control de acceso ni de facturación.

## Organización

- `app/page.tsx`: composición y navegación general.
- `components/views/`: pantallas; `components/`: presentación y elementos compartidos.
- `hooks/use-demo.ts`: coordinación del recorrido simulado.
- `lib/`: reglas de precios, consultas, modelos, datos ficticios y validación de almacenamiento.
- `app/styles/`: CSS por responsabilidad; `app/globals.css`: entradas de estilos.
- `scripts/`: pruebas de comportamiento y controles de entrega. `docs/`: resultado generado, nunca editarlo a mano.

Después de cada corrección revisar crecimiento, duplicación y responsabilidades. No acumular CSS sobrescrito al final. No reducir líneas comprimiendo fuentes. Retirar dependencias que queden sin uso. Preferir HTML semántico y componentes pequeños; no imponer MVVM ni clases donde no aporten claridad.

## Verificación

Ejecutar `npm run check` antes de entregar código. Para cambios de navegación, estilos o interacción, probar en navegador escritorio, 390 px y 320 px; teclado, foco del diálogo y cierre con Escape, formularios, búsquedas, guardados, saldo y persistencia afectados. Guardar capturas sin datos privados.

No publicar si falla el recorrido afectado. Revisar `git diff`, archivos preparados, artefactos generados y hallazgos del control de secretos antes del commit. El control automático busca patrones comunes, no acredita una auditoría exhaustiva. El código enviado al navegador es público por diseño.

Al publicar, comprobar que GitHub Pages sirve el commit y los assets correctos. Informar URL, comprobaciones realizadas, cambios de peso relevantes y limitaciones. No atribuir una medición local de gzip a rendimiento real de red ni afirmar que es un servicio listo para cobrar.
