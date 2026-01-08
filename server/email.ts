import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using SMTP
 * Configure SMTP credentials via environment variables:
 * - SMTP_HOST: SMTP server host (e.g., smtp.gmail.com)
 * - SMTP_PORT: SMTP server port (e.g., 587 for TLS, 465 for SSL)
 * - SMTP_USER: SMTP username/email
 * - SMTP_PASS: SMTP password or app-specific password
 * - SMTP_FROM: Sender email address and name (e.g., "AE Music Lab <noreply@aemusiclab.com>")
 */
export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  try {
    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[Email] SMTP not configured. Skipping email send.');
      return false;
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log(`[Email] Successfully sent to ${options.to}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send email:', error);
    return false;
  }
}

/**
 * Send confirmation email to artist after submission
 */
export async function sendArtistConfirmation(
  artistName: string,
  artistEmail: string,
  songTitle: string
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #7C5CFF 0%, #00F5D4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
    .button { display: inline-block; background: #7C5CFF; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    h1 { margin: 0; font-size: 28px; }
    .highlight { background: #fff; padding: 15px; border-left: 4px solid #7C5CFF; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎵 Submission Received!</h1>
    </div>
    <div class="content">
      <p>Hi <strong>${artistName}</strong>,</p>
      
      <p>Thank you for submitting your music to <strong>AE Music Lab</strong>! We've successfully received your track and are excited to review it.</p>
      
      <div class="highlight">
        <strong>Submission Details:</strong><br>
        Song Title: <strong>${songTitle}</strong><br>
        Submitted: <strong>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
      </div>
      
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our team will review your submission within <strong>3-5 business days</strong></li>
        <li>We'll evaluate your track for potential collaboration or feature opportunities</li>
        <li>You'll receive a follow-up email with our feedback and next steps</li>
      </ul>
      
      <p>In the meantime, feel free to browse our beat store and explore what AE Music Lab has to offer!</p>
      
      <center>
        <a href="https://aemusiclab.com/beats" class="button">Browse Beats</a>
      </center>
      
      <p>If you have any questions, don't hesitate to reach out to us at <a href="mailto:cactusdigitalmedialtd@gmail.com">cactusdigitalmedialtd@gmail.com</a></p>
      
      <p>Best regards,<br>
      <strong>The AE Music Lab Team</strong><br>
      <em>A division of Armhen Entertainment</em></p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} AE Music Lab | Powered by Armhen Entertainment</p>
      <p style="font-size: 12px; color: #999;">This is an automated confirmation email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Hi ${artistName},

Thank you for submitting your music to AE Music Lab! We've successfully received your track "${songTitle}" and are excited to review it.

What happens next?
- Our team will review your submission within 3-5 business days
- We'll evaluate your track for potential collaboration or feature opportunities
- You'll receive a follow-up email with our feedback and next steps

If you have any questions, reach out to us at cactusdigitalmedialtd@gmail.com

Best regards,
The AE Music Lab Team
A division of Armhen Entertainment
  `.trim();

  return sendEmail({
    to: artistEmail,
    subject: '🎵 Your Music Submission to AE Music Lab - Confirmed!',
    html,
    text,
  });
}
