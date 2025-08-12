import { formatPrice } from '@/lib/utils'

export function renderOrderConfirmationEmail(
  order: any,
  downloadLinks: Array<{ title: string; url: string }>
) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.price)}</td>
        </tr>
      `
    )
    .join('')

  const downloadsHtml = downloadLinks
    .map(
      (link) => `
        <li style="margin: 10px 0;">
          <strong>${link.title}</strong><br>
          <a href="${link.url}" style="color: #0070f3;">Download Now</a>
          <span style="font-size: 12px; color: #666;">(Link expires in 48 hours)</span>
        </li>
      `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
          }
          .order-info {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .downloads {
            background: #e8f4f8;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Your Order!</h1>
          <p>Your order has been confirmed and your digital products are ready for download.</p>
        </div>

        <div class="order-info">
          <h2>Order Details</h2>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <h3>Order Summary</h3>
        <table>
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px;">Product</th>
              <th style="text-align: center; padding: 10px;">Quantity</th>
              <th style="text-align: right; padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
              <td style="padding: 10px; text-align: right;"><strong>${formatPrice(order.total)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <div class="downloads">
          <h3>Download Your Products</h3>
          <p>Click the links below to download your purchased products:</p>
          <ul style="list-style: none; padding: 0;">
            ${downloadsHtml}
          </ul>
        </div>

        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>Digital Marketplace - Premium digital products for creators</p>
        </div>
      </body>
    </html>
  `

  const text = `
Thank You for Your Order!

Your order has been confirmed and your digital products are ready for download.

Order Details:
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleDateString()}

Order Summary:
${order.items.map((item: any) => `${item.title} x ${item.quantity} - ${formatPrice(item.price)}`).join('\n')}

Total: ${formatPrice(order.total)}

Download Your Products:
${downloadLinks.map((link) => `${link.title}: ${link.url}`).join('\n')}

Note: Download links expire in 48 hours.

If you have any questions, please contact our support team.

Digital Marketplace - Premium digital products for creators
  `

  return { html, text }
}