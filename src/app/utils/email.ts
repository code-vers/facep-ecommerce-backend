import nodemailer from 'nodemailer';

import config from '../config';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass
  }
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      html
    });
    logger.info(`Message sent: ${info.messageId}`);

    // Preview only available when sending through an Ethereal account
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      logger.info(`Preview URL: ${previewUrl}`);
    }
  } catch (error) {
    logger.error('Failed to send email:', error);
  }
};

export interface IInquiryEmailData {
  name: string;
  email: string;
  contactNumber?: string | null;
  message: string;
  createdAt: Date | string;
}

export const sendInquiryEmail = async (
  to: string,
  inquiry: IInquiryEmailData
): Promise<void> => {
  const subject = `New Support Inquiry from ${inquiry.name}`;

  const formattedDate = new Date(inquiry.createdAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Support Inquiry</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #18181b;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e4e4e7; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              
              <!-- Header Bar -->
              <tr>
                <td style="background-color: #09090b; padding: 24px 32px; text-align: left;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="vertical-align: middle;">
                        <span style="font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase;">
                          Face Commerce
                        </span>
                      </td>
                      <td align="right" style="vertical-align: middle;">
                        <span style="display: inline-block; background-color: #dec33a; color: #000000; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                          Support Alert
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Gold Top Accent Line -->
              <tr>
                <td style="background-color: #dec33a; height: 4px; font-size: 0; line-height: 0;">&nbsp;</td>
              </tr>

              <!-- Email Body -->
              <tr>
                <td style="padding: 32px;">
                  <h2 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #09090b; letter-spacing: -0.3px;">
                    New Customer Inquiry Received
                  </h2>
                  <p style="margin: 0 0 24px 0; font-size: 14px; color: #71717a; line-height: 1.5;">
                    A customer has submitted a new inquiry via the Customer Service page. Below are the details:
                  </p>

                  <!-- Inquiry Summary Card -->
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9f9fb; border: 1px solid #e5e5e6; border-radius: 6px; margin-bottom: 24px;">
                    <tr>
                      <td style="padding: 20px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding-bottom: 12px; font-size: 13px; color: #71717a; width: 140px;">Customer Name:</td>
                            <td style="padding-bottom: 12px; font-size: 14px; font-weight: 600; color: #09090b;">${inquiry.name}</td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px; font-size: 13px; color: #71717a;">Email Address:</td>
                            <td style="padding-bottom: 12px; font-size: 14px; font-weight: 600; color: #165dd0;">
                              <a href="mailto:${inquiry.email}" style="color: #165dd0; text-decoration: none;">${inquiry.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-bottom: 12px; font-size: 13px; color: #71717a;">Contact Number:</td>
                            <td style="padding-bottom: 12px; font-size: 14px; font-weight: 500; color: #09090b;">${inquiry.contactNumber || 'Not Provided'}</td>
                          </tr>
                          <tr>
                            <td style="font-size: 13px; color: #71717a;">Submitted At:</td>
                            <td style="font-size: 14px; font-weight: 500; color: #09090b;">${formattedDate}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Message Box -->
                  <div style="margin-bottom: 24px;">
                    <div style="font-size: 13px; font-weight: 600; color: #09090b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                      Customer Message:
                    </div>
                    <div style="background-color: #ffffff; border-left: 4px solid #dec33a; border-top: 1px solid #e5e5e6; border-right: 1px solid #e5e5e6; border-bottom: 1px solid #e5e5e6; border-radius: 0 6px 6px 0; padding: 16px 20px; font-size: 14px; line-height: 1.6; color: #27272a; white-space: pre-wrap;">${inquiry.message}</div>
                  </div>

                  <p style="margin: 0; font-size: 13px; color: #a1a1aa; line-height: 1.5;">
                    You can manage and reply to this inquiry directly from your admin dashboard under <strong>Dashboard &gt; Support</strong>.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f4f4f5; padding: 20px 32px; border-top: 1px solid #e4e4e7; text-align: center;">
                  <p style="margin: 0; font-size: 12px; color: #71717a;">
                    &copy; ${new Date().getFullYear()} Face Commerce. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail(to, subject, html);
};

