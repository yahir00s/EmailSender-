# 🚀 Email Sender Backend

Backend API para el envío de correos electrónicos automáticos usando Node.js, Express y Gmail API.

## 📋 Requisitos

- Node.js >= 18.x
- Cuenta de Gmail
- npm o yarn

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env
```

## ⚙️ Configuración de Gmail

### Opción 1: App Password (Recomendado para desarrollo)

1. Habilita la verificación en 2 pasos en tu cuenta de Gmail:
   - Ve a https://myaccount.google.com/security
   - Activa "Verificación en 2 pasos"

2. Genera una App Password:
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Mail" y el dispositivo
   - Copia el password de 16 caracteres

3. Configura las variables en `.env`:
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password-de-16-caracteres
```

### Opción 2: OAuth2 (Recomendado para producción)

1. Crea un proyecto en Google Cloud Console:
   - Ve a https://console.cloud.google.com/
   - Crea un nuevo proyecto

2. Habilita Gmail API:
   - Busca "Gmail API" y habilítala

3. Crea credenciales OAuth 2.0:
   - Ve a "Credenciales" > "Crear credenciales" > "ID de cliente OAuth"
   - Tipo: Aplicación web
   - Agrega `https://developers.google.com/oauthplayground` a las URIs autorizadas

4. Obtén el Refresh Token:
   - Ve a https://developers.google.com/oauthplayground
   - Configura tus credenciales OAuth (icono de engranaje)
   - Autoriza Gmail API v1
   - Intercambia el código por tokens

5. Configura las variables en `.env`:
```env
EMAIL_USER=tu-email@gmail.com
GMAIL_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=tu-client-secret
GMAIL_REFRESH_TOKEN=tu-refresh-token
```

## 🚀 Uso

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor se iniciará en `http://localhost:3000`

## 📡 Endpoints

### Health Check
```
GET /health
```

Respuesta:
```json
{
  "status": "ok",
  "message": "Email sender API is running"
}
```

### Enviar correo individual
```
POST /api/send-email
```

Body:
```json
{
  "name": "Oscar",
  "email": "oscar@test.app"
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "message": "Correo enviado exitosamente a Oscar (oscar@test.app)"
}
```

### Enviar correos masivos
```
POST /api/send-bulk-emails
```

Body:
```json
{
  "users": [
    { "name": "Oscar", "email": "oscar@test.app" },
    { "name": "Joaquin", "email": "joaquin@test.app" }
  ]
}
```

Respuesta exitosa:
```json
{
  "success": true,
  "message": "Proceso completado: 2 exitosos, 0 fallidos",
  "results": {
    "success": [
      { "name": "Oscar", "email": "oscar@test.app" },
      { "name": "Joaquin", "email": "joaquin@test.app" }
    ],
    "failed": []
  }
}
```

## 🔒 Seguridad

- Las credenciales se manejan mediante variables de entorno
- Se implementa CORS para controlar accesos
- Se valida el formato de emails antes de enviar
- Se implementa rate limiting básico (500ms entre correos)

## 🐛 Troubleshooting

### Error: "Invalid login"
- Verifica que hayas habilitado la verificación en 2 pasos
- Asegúrate de usar el App Password correcto
- Revisa que el email en EMAIL_USER sea correcto

### Error: "ECONNREFUSED"
- Verifica tu conexión a internet
- Gmail puede estar bloqueando el acceso temporalmente

### Rate Limiting
- Gmail tiene límites de envío (aproximadamente 500 correos por día)
- Si alcanzas el límite, espera 24 horas

## 📦 Dependencias principales

- `express`: Framework web
- `nodemailer`: Librería para envío de correos
- `googleapis`: Cliente para Google APIs
- `cors`: Manejo de CORS
- `dotenv`: Variables de entorno

## 📝 Licencia

MIT
