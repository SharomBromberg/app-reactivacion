# Cómo llenar los datos semilla

1. Abre `businesses.template.csv` en Google Sheets (Archivo → Importar).
2. Llena una fila por negocio. No cambies ni borres el encabezado.
3. Columnas: `name` (nombre, 3-80 caracteres), `zone`, `sector`, `damageLevel`, `phone`, `description` (opcional, máx. 300 caracteres).
4. `zone`, `sector` y `damageLevel` van EXACTAMENTE así (mayúsculas y guiones bajos) — en el archivo escribe el valor de la izquierda, el de la derecha es solo para que sepas cuál es cuál:
   - zone: ATARDECERES (Atardeceres), CIUDADELA_DEL_NORTE (Ciudadela del Norte), CUMANDAY (Cumanday), ECOTURISTICO_CERRO_DE_ORO (Ecoturístico Cerro de Oro), LA_ESTACION (La Estación), LA_ESTRELLA (La Estrella), LA_FUENTE (La Fuente), LA_MACARENA (La Macarena), NUEVO_HORIZONTE (Nuevo Horizonte), PALOGRANDE (Palogrande), SAN_JOSE (San José), TESORITO (Tesorito), UNIVERSITARIA (Universitaria), RURAL_ALEDANA (Zona rural o aledaña: Villamaría, corregimientos…)
   - sector: ALIMENTOS_RESTAURANTES (Alimentos y restaurantes), TIENDAS_VIVERES (Tiendas y víveres), FERRETERIA_CONSTRUCCION (Ferretería y construcción), CONFECCION_COSTURA (Confección y costura), BELLEZA_CUIDADO (Belleza y cuidado personal), MECANICA_REPARACIONES (Mecánica y reparaciones), TRANSPORTE_MENSAJERIA (Transporte y mensajería), SALUD_BIENESTAR (Salud y bienestar), EDUCACION_CLASES (Educación y clases), TECNOLOGIA_DIGITAL (Tecnología y servicios digitales), DISENO_ARTE (Diseño y arte), JARDINERIA_AGRO (Jardinería y agro), MASCOTAS (Mascotas), HOGAR_ASEO (Hogar y aseo), OTRO (Otro)
   - damageLevel: SIN_AFECTACION, AFECTACION_LEVE, AFECTACION_MODERADA, LOCAL_INHABITABLE, PERDIDA_TOTAL
5. `phone`: 10 dígitos del celular, sin espacios ni el +57 (ej. 3001234567).
6. Cuando termines: Archivo → Descargar → Valores separados por comas (.csv).
7. Renombra el archivo descargado a `businesses.csv` y ponlo en esta misma carpeta (`data/seed/`).
8. Avisa al equipo técnico para que corra la carga; si una fila tiene un error te dirán cuál en `errors.csv` para corregirla.
