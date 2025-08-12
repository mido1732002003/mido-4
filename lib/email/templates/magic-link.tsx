export function renderMagicLinkEmail(url: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Sign in to Digital Marketplace</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #0070f3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <h1>Sign in to Digital Marketplace</h1>
        <p>Click the button below to sign in to your account. This link will expire in 24 hours.</p>
        <a href="${url}" class="button">Sign In</a>
        <p>If you didn't request this email, you can safely ignore it.</p>
        <div class="footer">
          <p>Digital Marketplace - Premium digital products for creators</p>
        </div>
      </body>
    </html>
  `

  const text = `
Sign in to Digital Marketplace

Click the link below to sign in to your account:
${url}

This link will expire in 24 hours.

If you didn't request this email, you can safely ignore it.

Digital Marketplace - Premium digital products for creators
  `

  return { html, text }
}