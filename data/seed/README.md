# Cómo llenar los datos semilla

1. Abre `businesses.template.csv` en Google Sheets (Archivo → Importar).
2. Llena una fila por negocio. No cambies ni borres el encabezado.
3. Columnas: `name` (nombre, 3-80 caracteres), `zone`, `sector`, `damageLevel`, `phone`, `description` (opcional, máx. 300 caracteres).
4. `zone`, `sector` y `damageLevel` van EXACTAMENTE así (mayúsculas y guiones bajos), copia y pega:
   - zone: ATARDECERES, CIUDADELA_DEL_NORTE, CUMANDAY, ECOTURISTICO_CERRO_DE_ORO, ESTACION, LA_FUENTE, LA_MACARENA, PALOGRANDE, SAN_JOSE, TESORITO, UNIVERSITARIA, OTRA
   - sector: ALIMENTOS_Y_BEBIDAS, ABARROTES_Y_TIENDA, ROPA_Y_CALZADO, BELLEZA_Y_CUIDADO_PERSONAL, SALUD, EDUCACION, TECNOLOGIA, CONSTRUCCION_Y_FERRETERIA, TRANSPORTE, SERVICIOS_PROFESIONALES, ARTE_Y_ARTESANIAS, AGROPECUARIO, OTRO
   - damageLevel: SIN_AFECTACION, AFECTACION_LEVE, AFECTACION_MODERADA, LOCAL_INHABITABLE, PERDIDA_TOTAL
5. `phone`: 10 dígitos del celular, sin espacios ni el +57 (ej. 3001234567).
6. Cuando termines: Archivo → Descargar → Valores separados por comas (.csv).
7. Renombra el archivo descargado a `businesses.csv` y ponlo en esta misma carpeta (`data/seed/`).
8. Avisa al equipo técnico para que corra la carga; si una fila tiene un error te dirán cuál en `errors.csv` para corregirla.
