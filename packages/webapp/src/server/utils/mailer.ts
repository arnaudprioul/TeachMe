import nodemailer from 'nodemailer'

let _transport: nodemailer.Transporter | null = null

function getTransport(): nodemailer.Transporter {
  if (!_transport) {
    _transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? 'localhost',
      port: Number(process.env.SMTP_PORT ?? 5025),
      secure: false,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  }
  return _transport
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const from = process.env.SMTP_FROM ?? 'noreply@teachme.local'
  await getTransport().sendMail({
    from,
    to,
    subject: `Your TeachMe verification code: ${otp}`,
    text: `Your verification code is: ${otp}\n\nIt expires in 10 minutes.`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2 style="color:#6366f1">Verify your email</h2>
        <p>Enter this code to complete your registration:</p>
        <div style="font-size:2.5rem;font-weight:800;letter-spacing:.3em;color:#6366f1;padding:16px 0">${otp}</div>
        <p style="color:#94a3b8;font-size:.875rem">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  })
}
