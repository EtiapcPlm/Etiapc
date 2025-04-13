// version1
// author Yxff
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifica tu correo electrónico - ETIAPC PLM",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A2540;">Verificación de correo electrónico</h1>
        <p>Gracias por registrarte en el sistema de Evaluaciones ETIAPC PLM.</p>
        <p>Para completar tu registro, haz clic en el siguiente botón:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verificar correo electrónico
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Este enlace expirará en 24 horas.</p>
        <p style="color: #666; font-size: 14px;">Si no solicitaste esta verificación, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          Este es un correo automático, por favor no responder.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Recuperación de contraseña - ETIAPC PLM",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0A2540;">Recuperación de contraseña</h1>
        <p>Has solicitado restablecer tu contraseña en el sistema de Evaluaciones ETIAPC PLM.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Restablecer contraseña
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
        <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          Este es un correo automático, por favor no responder.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
} 