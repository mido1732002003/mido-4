import nodemailer from 'nodemailer'
import { renderMagicLinkEmail } from './templates/magic-link'
import { renderOrderConfirmationEmail } from './templates/order-confirmation'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendMagicLinkEmail(to: string, url: string) {
  const { html, text } = renderMagicLinkEmail(url)
  
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Sign in to Digital Marketplace',
    text,
    html,
  })

  // Log preview URL in development (Ethereal)
  if (process.env.NODE_ENV === 'development') {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  order: any,
  downloadLinks: Array<{ title: string; url: string }>
) {
  const { html, text } = renderOrderConfirmationEmail(order, downloadLinks)
  
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Order Confirmation #${order._id}`,
    text,
    html,
  })

  if (process.env.NODE_ENV === 'development') {
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info))
  }
}