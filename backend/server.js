const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Gmail API
const OAuth2 = google.auth.OAuth2;

// Función para crear transporter con OAuth2
const createTransporter = async () => {
  // Si usas OAuth2 (recomendado para producción)
  if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    const accessToken = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token
      }
    });
  } else {
    // Fallback: App Password (más simple para desarrollo)
    return nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // App Password de Gmail
      }
    });
  }
};

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email sender API is running' });
});

// Endpoint para enviar correo individual
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email y nombre son requeridos' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Formato de email inválido' 
      });
    }

    const transporter = await createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Hola ${name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4CAF50;">¡Hola ${name}! 👋</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Este es un correo automático enviado desde nuestra aplicación de React Native.
          </p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Esperamos que tengas un excelente día!
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">
            Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ 
      success: true, 
      message: `Correo enviado exitosamente a ${name} (${email})` 
    });

  } catch (error) {
    console.error('Error enviando correo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error al enviar el correo',
      details: error.message 
    });
  }
});

// Endpoint para enviar correos masivos
app.post('/api/send-bulk-emails', async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Se requiere un array de usuarios' 
      });
    }

    const transporter = await createTransporter();
    const results = {
      success: [],
      failed: []
    };

    // Enviar correos con un pequeño delay para evitar rate limiting
    for (const user of users) {
      try {
        const { name, email } = user;

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          results.failed.push({ name, email, reason: 'Email inválido' });
          continue;
        }

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Hola ${name}!`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #4CAF50;">¡Hola ${name}! 👋</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Este es un correo automático enviado desde nuestra aplicación de React Native.
              </p>
              <p style="font-size: 16px; line-height: 1.6; color: #333;">
                Esperamos que tengas un excelente día!
              </p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #999;">
                Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        results.success.push({ name, email });

        // Delay de 500ms entre correos para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error enviando correo a ${user.name}:`, error);
        results.failed.push({ 
          name: user.name, 
          email: user.email, 
          reason: error.message 
        });
      }
    }

    res.json({ 
      success: true, 
      message: `Proceso completado: ${results.success.length} exitosos, ${results.failed.length} fallidos`,
      results 
    });

  } catch (error) {
    console.error('Error en envío masivo:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error en el envío masivo de correos',
      details: error.message 
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📧 Configuración de email: ${process.env.EMAIL_USER || 'No configurado'}`);
});

module.exports = app;
