export function generateOTPEmailHTML( otp: string, expiryInMinutes: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your One-Time Password (OTP)</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 40px;
        text-align: center;
      }
      h1 {
        color: #2563eb;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .otp-box {
        display: inline-block;
        margin-top: 20px;
        padding: 16px 32px;
        background-color: #2563eb;
        color: #ffffff;
        font-size: 24px;
        letter-spacing: 4px;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your OTP Code</h1>
      <p>Hi there!</p>
      <p>
        Use the following One-Time Password (OTP) to continue with your action. 
        This code is valid for <strong>${expiryInMinutes} minute(s)</strong>.
      </p>
      <div class="otp-box">${otp}</div>
      <p style="margin-top: 30px;">
        If you did not request this OTP, please ignore this email. Your account remains secure.
      </p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${process.env.APP_NAME} · All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

export function generateOTPForForgotPassword( otp: string, expiryInMinutes: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your One-Time Password (OTP)</title>
    <style>
      body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f4f6f8;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 40px;
        text-align: center;
      }
      h1 {
        color: #2563eb;
        margin-bottom: 20px;
      }
      p {
        font-size: 16px;
        line-height: 1.6;
      }
      .otp-box {
        display: inline-block;
        margin-top: 20px;
        padding: 16px 32px;
        background-color: #2563eb;
        color: #ffffff;
        font-size: 24px;
        letter-spacing: 4px;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your OTP Code</h1>
      <p>Seems you forgot your password.We've got you, don't worry :) </p>
      <p>
        Use the following One-Time Password (OTP) to continue with your action. 
        This code is valid for <strong>${expiryInMinutes} minute(s)</strong>.
      </p>
      <div class="otp-box">${otp}</div>
      <p style="margin-top: 30px;">
        If you did not request this OTP, please ignore this email. Your account remains secure.
      </p>
      <div class="footer">
        &copy; ${new Date().getFullYear()} ${process.env.APP_NAME} · All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
}

