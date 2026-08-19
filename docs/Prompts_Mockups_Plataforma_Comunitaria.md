# Kit de Prompts — Mockups de la Plataforma Comunitaria de Reactivación

Estos prompts complementan el kit de desarrollo y se usan **antes del Prompt 5 (sistema de diseño)**: primero se aprueban los mockups, luego se codifican. Están pensados para que Claude entregue los mockups como **artefactos HTML/React interactivos** (se ven en el chat, en el celular y se pueden compartir), aunque también sirven en Claude Design si prefieres pantallas exportables.

## Cómo usarlos

1. Pega siempre el **Prompt M0** al iniciar la sesión de diseño (o el Prompt 0 del kit anterior más el M0).
2. Sigue el orden: dirección visual → wireframes → mockups por pantalla → panel admin → PWA → revisión.
3. Pide **una pantalla por prompt** en alta fidelidad; si pides todas juntas, la calidad baja.
4. Cada mockup debe verse a **390 px de ancho** (celular) primero; el escritorio es secundario.
5. Cierra con el **Prompt M8** para verificar accesibilidad y coherencia antes de pasar a código.

---

## PROMPT M0 — Contexto de diseño (pegar siempre)

```
Actúa como diseñador/a de producto senior especializado en apps móviles para contextos de emergencia y bajos recursos.

PROYECTO
- Directorio y Marketplace Solidario Post-Sismo, Manizales. PWA móvil primero; luego Android.
- Usuarios: emprendedores y vecinos afectados por un sismo, muchos con celulares de gama baja, mala señal y bajo nivel de familiaridad digital; edades muy variadas.
- Tres flujos públicos: Directorio (buscar negocios por zona y sector), Registrar mi negocio, Muro de Apoyo "Busco / Ofrezco". Un flujo privado: Panel de Moderación para el equipo desarrollador.
- Toda transacción se deriva a WhatsApp (wa.me). La app NO procesa pagos ni pide datos financieros ni sensibles.

PRINCIPIOS DE DISEÑO (no negociables)
1. Claridad ante todo: máximo una acción principal por pantalla, textos cortos en español neutro y cercano.
2. Ligereza: sin imágenes decorativas, sin fuentes externas, iconos simples de trazo; debe funcionar en 3G.
3. Confianza y calma: paleta sobria y cálida, alto contraste (WCAG AA), nada que se sienta comercial ni alarmista.
4. Táctil: botones de al menos 48 px de alto, formularios cortos, teclado adecuado por campo (teléfono numérico).
5. Accesibilidad: jerarquía visual clara, textos ≥ 16 px, estados de foco/error visibles.

FORMATO DE ENTREGA
- Mockups como un único archivo HTML (o componente React) autocontenido, con CSS interno, sin dependencias externas, en un marco de 390 × 844 px que simule un celular.
- Usa datos de ejemplo realistas de Manizales (barrios como Chipre, La Enea, Palermo, San José, Villamaría; negocios como panadería, ferretería, costura, mecánica).
- Antes de dibujar, explícame en 5 líneas las decisiones de diseño y sus razones.
- Al final de cada entrega, lista los componentes reutilizables que aparecen (para mapearlos al sistema de diseño en código).
```

---

## PROMPT M1 — Dirección visual y tokens

```
Propón la dirección visual de la app y entrégala como una hoja de estilos visual (styleguide) en un solo HTML:

- 2 opciones de paleta (cada una con primario, secundario, fondo, superficie, texto, éxito, error, aviso y un color específico para el botón de WhatsApp) con contraste verificado AA sobre fondo y superficie.
- Tipografía del sistema (system-ui / Roboto en Android): escala de 6 tamaños con uso de cada uno.
- Espaciado en base 4 y radios de esquina.
- Muestrario de átomos: botón primario/secundario/WhatsApp (normal, presionado, deshabilitado, cargando), input con label/error/ayuda, select, chip de filtro (activo/inactivo), badge de estado (Visible, En revisión, Oculto), tarjeta base, estado vacío, skeleton de carga.
- Set de 12 iconos de trazo en SVG inline (buscar, filtro, ubicación, teléfono, WhatsApp, más, atrás, cerrar, ojo/ojo tachado, escudo, historial, cerrar sesión).
- Recomiéndame una de las dos paletas y justifica en 3 líneas.

Nombra cada token (--color-primary, --space-4, --radius-md…) porque los usaré tal cual en el código.
```

## PROMPT M2 — Wireframes de baja fidelidad (flujo completo)

```
Con los tokens aprobados, dibuja los wireframes de baja fidelidad (cajas grises, texto real) de TODAS las pantallas del MVP en un solo HTML desplazable horizontalmente, ordenadas por flujo:

Público: 1) Directorio con filtros, 2) Resultados vacíos / sin conexión, 3) Detalle de negocio, 4) Registrar negocio (paso único), 5) Registro exitoso, 6) Muro de Apoyo con tabs Busco/Ofrezco, 7) Publicar en el muro, 8) Navegación inferior.
Privado: 9) Login de moderación, 10) Cola de moderación, 11) Modal de acción con nota obligatoria, 12) Historial de acciones.

Para cada pantalla: título, número, flecha hacia la siguiente, y una nota de 1 línea con la acción principal. Señala dónde aparece el aviso "Esta plataforma no procesa pagos; el contacto es directo por WhatsApp".

No uses color todavía; quiero validar estructura y flujo, no estética.
```

## PROMPT M3 — Mockup de alta fidelidad: Directorio y Detalle

```
Diseña en alta fidelidad, con los tokens aprobados, las pantallas Directorio y Detalle de negocio como HTML interactivo (los filtros y la búsqueda deben funcionar sobre datos de ejemplo):

Directorio:
- Encabezado corto con nombre de la plataforma y frase de propósito (1 línea).
- Barra de búsqueda + chips de filtro por zona y sector (scroll horizontal), contador "N negocios".
- Tarjeta de negocio: iniciales en círculo (no foto), nombre, sector, barrio, badge de afectación discreto, botón WhatsApp de ancho completo.
- Estados: cargando (skeleton), vacío ("Aún no hay negocios en esta zona. ¿Conoces uno? Regístralo"), sin conexión (banner superior).
- Navegación inferior: Directorio · Apoyo · Registrar.

Detalle:
- Nombre, barrio, sector, descripción, lista de productos/servicios (nombre, descripción corta, precio opcional en texto libre).
- Botón fijo abajo "Contactar por WhatsApp" con mensaje prellenado visible en un tooltip o texto de ayuda.
- Aviso de "sin pagos en la plataforma" y enlace pequeño "Reportar un problema" (que en el MVP abre WhatsApp del equipo).

Muéstrame ambas pantallas lado a lado y una versión de escritorio simple (máx. 720 px de contenido centrado).
```

## PROMPT M4 — Mockup de alta fidelidad: Registrar negocio

```
Diseña el formulario de registro en alta fidelidad y hazlo funcional en el mockup (validación en vivo con mensajes de ejemplo):

Campos, en este orden: Nombre del negocio, Barrio/zona (select), Sector (select), ¿Cómo te afectó el sismo? (select: Leve / Moderado / Grave / Cerrado temporalmente), Número de WhatsApp (prefijo +57 fijo, teclado numérico), Descripción breve (opcional, contador 0/300).
- Texto introductorio de 2 líneas explicando qué se hace con los datos y qué NO se pide.
- Errores debajo del campo, en lenguaje humano ("Escribe un número de 10 dígitos, ejemplo 300 123 4567").
- Botón "Publicar mi negocio" con estado cargando.
- Pantalla de éxito: check, mensaje "Tu negocio ya está en revisión y aparecerá en breve", botón "Ver el directorio" y "Compartir por WhatsApp" con texto listo para reenviar a otros emprendedores.
- Versión de una sola página (sin pasos) y, como alternativa, una versión en 3 pasos; recomiéndame una para usuarios poco digitales.
```

## PROMPT M5 — Mockup de alta fidelidad: Muro de Apoyo (Busco / Ofrezco)

```
Diseña el Muro de Apoyo en alta fidelidad y funcional:

- Tabs superiores "Busco" y "Ofrezco" con conteo; filtro por zona.
- Tarjeta de publicación: tipo (color de acento distinto para Busco y Ofrezco), título corto, descripción, barrio, tiempo relativo ("hace 2 h"), botón WhatsApp.
- Botón flotante "+ Publicar".
- Pantalla Publicar: tipo (dos botones grandes Busco/Ofrezco), título (máx. 60), descripción (máx. 200), barrio, WhatsApp; misma lógica de éxito que el registro.
- Estado vacío por tab con ejemplo de qué se puede publicar (transporte, insumos, mano de obra, espacio para vender).
- Un microtexto que recuerde el tono solidario y las normas: sin ventas de emergencia con sobreprecio.
```

## PROMPT M6 — Mockup de alta fidelidad: Panel de moderación

```
Diseña el panel de moderación (uso interno del equipo, en celular y en escritorio) en alta fidelidad y funcional:

- Login: correo + contraseña, sin registro, mensaje de error genérico, botón "Entrar".
- Cola de moderación: tabs Negocios · Productos · Apoyo con conteo de pendientes; tarjeta con contenido completo, fecha, badge de estado y tres acciones: Ocultar (naranja), Restaurar (verde, solo si está oculto), Banear (rojo).
- Modal de confirmación con campo de nota obligatorio y advertencia clara de la consecuencia; el botón se habilita solo con nota ≥ 10 caracteres.
- Búsqueda por nombre/teléfono y filtro por estado (Pendiente, Visible, Oculto, Baneado).
- Historial: lista cronológica "Quién · Acción · Sobre qué · Nota · Fecha".
- Encabezado con nombre del moderador y "Cerrar sesión".
- Estética sobria y densa (es una herramienta de trabajo), pero con los mismos tokens.
- Versión escritorio en dos columnas: cola a la izquierda, detalle a la derecha.
```

## PROMPT M7 — Identidad e instalación PWA

```
Diseña los activos de identidad e instalación:

- Nombre corto para el ícono (máx. 12 caracteres) y 3 opciones de nombre para la plataforma con justificación (1 línea cada una), evitando términos que suenen a tragedia.
- Ícono de la app en SVG (simple, legible a 48 px, sin degradados), en versión normal y adaptativa Android (con área segura); exporta también en 192 y 512 px como instrucción.
- Splash screen ligera (color de fondo + ícono).
- Mockup del banner "Instala la app en tu inicio" para Android Chrome, con instrucción visual de 2 pasos.
- Plantilla de mensaje de WhatsApp para difusión (máx. 4 líneas + enlace) y una imagen cuadrada 1080 × 1080 en HTML/SVG para compartir en redes con el mismo lenguaje visual.
```

## PROMPT M8 — Revisión de diseño (usar antes de codificar)

```
Revisa el conjunto de mockups como diseñador/a externo antes de pasar a desarrollo. Responde en este orden:

1. Contraste: verifica cada combinación texto/fondo y botón/fondo; lista las que no cumplen AA y propón el ajuste.
2. Táctil: ¿algún objetivo menor de 48 px? ¿algún texto menor de 16 px en cuerpo?
3. Lenguaje: ¿hay términos técnicos, anglicismos o frases largas que un usuario poco digital no entendería? Reescríbelas.
4. Coherencia: ¿mismos tokens, mismos componentes, misma posición de botones en todas las pantallas?
5. Peso: ¿algo que se pueda quitar sin perder claridad (sombras, ilustraciones, animaciones)?
6. Privacidad visible: ¿en cada punto donde se piden datos queda claro qué se pide y qué no?
7. Entrega la lista final de componentes con sus props principales (nombre, variantes, estados) lista para pasar al Prompt 5 del kit de desarrollo.
```

---

## Cronograma sugerido

| Momento | Prompts | Resultado |
| --- | --- | --- |
| Lun 17, mañana (en paralelo con backend) | M0 → M1 → M2 | Paleta y tokens aprobados, flujo validado |
| Lun 17, tarde | M3 → M4 | Directorio, detalle y registro en alta fidelidad |
| Mar 18, mañana | M5 → M6 → M8 | Apoyo y panel admin aprobados, lista de componentes → Prompt 5 |
| Mar 18–Mié 19 | M7 | Ícono, splash, banner de instalación y material de difusión |

## Consejo práctico

Si el equipo es de dos personas, una puede correr los prompts de diseño (M1–M6) mientras la otra avanza con backend (Prompts 1–4). Como los tokens salen nombrados desde M1, el Prompt 5 de desarrollo puede recibirlos tal cual y no hay que rediseñar en código.
