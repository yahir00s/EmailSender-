## COMPONENTES DEL SISTEMA:

1.  **CLIENTE (Mobile App - React Native/Expo):**
    * App móvil `React Native`
    * Context API (`DataContext`, `UsersContext`)
    * Componentes principales:
        * `CardUser` (lista de usuarios)
        * `ButtonSendIndividual` (envío individual)
        * `ButtonSendToAll` (envío masivo)
        * `ButtonAddJson` (agregar/borrar)
        * `SearchBar` (búsqueda)
    * Hooks personalizados:
        * `useFetchData` (obtener datos)
        * `useBulkEmail` (envío masivo)
        * `useUploadJson` (subir archivos)
        * `useDeleteAllData` (borrar datos)
    * `AsyncStorage` (persistencia local opcional)
    * `Expo Document Picker` (selección de archivos)
    * `Expo File System` (lectura de archivos)

2.  **SERVIDOR BACKEND (Node.js + Express):**
    * Puerto: `3000`
    * Middleware:
        * `CORS`
        * `Express.json()`
        * `Multer` (upload de archivos)
        * `Morgan` (logging)
    * Endpoints REST API:
        * `GET /health` (health check)
        * `POST /api/send-email` (envío individual)
        * `POST /api/send-bulk-emails` (envío masivo)
        * `POST /api/upload-json` (subir archivo JSON)
        * `GET /api/data` (obtener datos con paginación)
        * `DELETE /api/data` (borrar todos los datos)

3.  **ALMACENAMIENTO:**
    * `db.json` (archivo local en `/data/db.json`)
    * Estructura: Array de objetos con `id`, `createdAt`, `data`

4.  **SERVICIO DE EMAIL:**
    * Gmail API con `OAuth2`
    * `Nodemailer` como transporter
    * Variables de entorno:
        * `EMAIL_USER`
        * `EMAIL_PASSWORD` (App Password)
        * `GMAIL_CLIENT_ID` (opcional OAuth2)
        * `GMAIL_CLIENT_SECRET` (opcional OAuth2)
        * `GMAIL_REFRESH_TOKEN` (opcional OAuth2)

---

## FLUJO DE DATOS:

1.  **SUBIR CONTACTOS:**
    Mobile App → Selecciona archivo JSON → Envía a `/api/upload-json` → Backend guarda en `db.json` → Responde con success

2.  **OBTENER CONTACTOS:**
    Mobile App → Solicita `GET /api/data?page=1&limit=10` → Backend lee `db.json` → Responde con lista paginada → App muestra en `CardUser`

3.  **ENVÍO INDIVIDUAL:**
    Mobile App → Usuario presiona botón → `POST /api/send-email` con `{nombre: email}` → Backend usa `Nodemailer` → Gmail envía correo → Responde con success

4.  **ENVÍO MASIVO:**
    Mobile App → Usuario presiona "Enviar a todos" → `POST /api/send-bulk-emails` con objeto de usuarios → Backend itera y envía con delay de 500ms → Responde con resultados (exitosos/fallidos)

5.  **BORRAR DATOS:**
    Mobile App → Usuario confirma borrado → `DELETE /api/data` → Backend escribe `[]` en `db.json` → Context actualiza UI

6.  **REFRESH/ACTUALIZACIÓN:**
    Context Provider (`triggerRefresh`) → Incrementa `refreshKey` → Hook `useFetchData` escucha cambio → Hace nueva petición `GET` → Actualiza lista
