// @ts-expect-error types provided by nodemailer
import nodemailer from 'nodemailer'

export type MailConfig = {
  host: string
  port: number
  user: string
  pass: string
  from: string
}

function getConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM

  if (!host || !port || !user || !pass || !from) return null
  return { host, port, user, pass, from }
}

export async function sendResetCodeEmail(to: string, code: string) {
  const cfg = getConfig()
  if (!cfg) {
    console.warn('SMTP config not set; skipping email send. To enable, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM.')
    return { sent: false, reason: 'missing_config' }
  }

  const transport = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    auth: {
      user: cfg.user,
      pass: cfg.pass,
    },
  })

  const subject = 'Kode Reset Password'
  const text = `Kode reset password Anda: ${code}\n\nKode berlaku 10 menit. Jika Anda tidak meminta reset password, abaikan email ini.`
  const html = `<p>Kode reset password Anda:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px;">${code}</p><p>Kode berlaku 10 menit. Jika Anda tidak meminta reset password, abaikan email ini.</p>`

  await transport.sendMail({
    from: cfg.from,
    to,
    subject,
    text,
    html,
  })

  return { sent: true }
}
