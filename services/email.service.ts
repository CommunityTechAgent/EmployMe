import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import AWS from 'aws-sdk';
import { AppError } from '@/utils/app.error';

interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
    contentType?: string;
  }>;
  template?: string;
  templateData?: Record<string, any>;
  trackingId?: string;
}

class EmailService {
  private emailService: string;
  private defaultFromEmail: string;
  private defaultFromName: string;
  private transporter: nodemailer.Transporter | null = null;
  private mailgunClient: any = null;
  private sesClient: AWS.SES | null = null;

  constructor() {
    this.emailService = process.env.EMAIL_SERVICE || 'smtp';
    this.defaultFromEmail = process.env.DEFAULT_FROM_EMAIL || '';
    this.defaultFromName = process.env.DEFAULT_FROM_NAME || '';
    
    this.initialize();
  }
  
  private initialize() {
    switch (this.emailService) {
      case 'sendgrid':
        if (!process.env.SENDGRID_API_KEY) {
          throw new AppError('SendGrid API key is not configured', 500);
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        break;
        
      case 'mailgun':
        if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
          throw new AppError('Mailgun credentials are not configured', 500);
        }
        const mailgun = new Mailgun(formData);
        this.mailgunClient = mailgun.client({
          username: 'api',
          key: process.env.MAILGUN_API_KEY,
        });
        break;
        
      case 'ses':
        if (!process.env.SES_ACCESS_KEY || !process.env.SES_SECRET_KEY) {
          throw new AppError('AWS SES credentials are not configured', 500);
        }
        this.sesClient = new AWS.SES({
          accessKeyId: process.env.SES_ACCESS_KEY,
          secretAccessKey: process.env.SES_SECRET_KEY,
          region: process.env.SES_REGION || 'us-east-1',
        });
        break;
        
      case 'smtp':
      default:
        if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
          throw new AppError('SMTP credentials are not configured', 500);
        }
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT, 10),
          secure: parseInt(process.env.SMTP_PORT, 10) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
        break;
    }
  }
  
  async sendEmail(options: EmailOptions): Promise<any> {
    const {
      to,
      cc,
      bcc,
      subject,
      text,
      html,
      from = `${this.defaultFromName} <${this.defaultFromEmail}>`,
      attachments = [],
      template,
      templateData,
      trackingId,
    } = options;
    
    try {
      let result;
      
      switch (this.emailService) {
        case 'sendgrid':
          const sgMessage = {
            to,
            from: from || this.defaultFromEmail,
            subject,
            text,
            html,
          };
          
          if (cc) sgMessage.cc = cc;
          if (bcc) sgMessage.bcc = bcc;
          
          if (attachments && attachments.length > 0) {
            sgMessage.attachments = attachments.map(attachment => ({
              content: attachment.content?.toString('base64'),
              filename: attachment.filename,
              type: attachment.contentType,
              disposition: 'attachment',
            }));
          }
          
          result = await sgMail.send(sgMessage);
          break;
          
        case 'mailgun':
          const mailgunData = {
            from: from || this.defaultFromEmail,
            to,
            subject,
            text,
            html,
          };
          
          if (cc) mailgunData.cc = cc;
          if (bcc) mailgunData.bcc = bcc;
          
          if (attachments && attachments.length > 0) {
            attachments.forEach(attachment => {
              mailgunData[attachment.filename] = {
                data: attachment.content,
                filename: attachment.filename,
              };
            });
          }
          
          result = await this.mailgunClient.messages.create(
            process.env.MAILGUN_DOMAIN,
            mailgunData
          );
          break;
          
        case 'ses':
          const sesParams = {
            Source: from || this.defaultFromEmail,
            Destination: {
              ToAddresses: Array.isArray(to) ? to : [to],
            },
            Message: {
              Subject: {
                Data: subject,
              },
              Body: {
                Text: {
                  Data: text || '',
                },
                Html: {
                  Data: html || '',
                },
              },
            },
          };
          
          if (cc) {
            sesParams.Destination.CcAddresses = Array.isArray(cc) ? cc : [cc];
          }
          
          if (bcc) {
            sesParams.Destination.BccAddresses = Array.isArray(bcc) ? bcc : [bcc];
          }
          
          result = await this.sesClient?.sendEmail(sesParams).promise();
          break;
          
        case 'smtp':
        default:
          const mailOptions = {
            from: from || this.defaultFromEmail,
            to,
            cc,
            bcc,
            subject,
            text,
            html,
            attachments,
          };
          
          result = await this.transporter?.sendMail(mailOptions);
          break;
      }
      
      if (trackingId) {
        await this.trackEmail(trackingId, result);
      }
      
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new AppError('Failed to send email', 500, error);
    }
  }
  
  private async trackEmail(trackingId: string, result: any): Promise<void> {
    // TODO: Implement email tracking in the database
    console.log(`Tracking email: ${trackingId}`, result);
  }
  
  async verifyConnection(): Promise<boolean> {
    try {
      switch (this.emailService) {
        case 'smtp':
          await this.transporter?.verify();
          break;
        case 'sendgrid':
          if (!process.env.SENDGRID_API_KEY) {
            throw new Error('SendGrid API key is not set');
          }
          break;
        case 'mailgun':
          if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
            throw new Error('Mailgun API key or domain is not set');
          }
          break;
        case 'ses':
          if (!process.env.SES_ACCESS_KEY || !process.env.SES_SECRET_KEY) {
            throw new Error('AWS SES credentials are not set');
          }
          break;
      }
      
      return true;
    } catch (error) {
      console.error('Email service connection verification failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService(); 