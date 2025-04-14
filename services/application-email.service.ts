import { emailService } from './email.service';
import { AppError } from '@/utils/app.error';
import schedule from 'node-schedule';

interface ApplicationEmailOptions {
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  recipientEmail: string;
  recipientName?: string;
  hiringManager?: string;
  subject?: string;
  coverLetter: string;
  additionalMessage?: string;
  template?: 'standard' | 'creative' | 'formal' | 'technical' | 'followUp';
  ccToSelf?: boolean;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
    contentType?: string;
    type?: 'resume' | 'coverLetter' | 'other';
  }>;
  scheduledAt?: Date;
}

interface EmailTemplateData {
  jobTitle: string;
  company: string;
  recipientName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  coverLetter: string;
  additionalMessage?: string;
  originalApplicationDate?: Date;
}

class ApplicationEmailService {
  private templates = {
    standard: 'standard-application',
    creative: 'creative-application',
    formal: 'formal-application',
    technical: 'technical-application',
    followUp: 'follow-up',
  };

  async sendApplicationEmail(options: ApplicationEmailOptions): Promise<any> {
    try {
      const {
        userId,
        jobId,
        jobTitle,
        company,
        recipientEmail,
        recipientName,
        hiringManager,
        subject,
        coverLetter,
        additionalMessage,
        template = 'standard',
        ccToSelf = false,
        attachments = [],
        scheduledAt,
      } = options;

      // If scheduledAt is provided, schedule the email for later
      if (scheduledAt) {
        const scheduledDate = new Date(scheduledAt);
        if (scheduledDate > new Date()) {
          return this.scheduleEmail(options, scheduledDate);
        }
      }

      // Get user information from the database
      const user = await this.getUserInfo(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Process attachments
      const processedAttachments = await this.processAttachments(attachments);

      // Add resume if not already included
      if (user.resumeUrl && !attachments.some(att => att.type === 'resume')) {
        const resumeFile = await this.getFileFromStorage(user.resumeUrl);
        processedAttachments.push({
          filename: `${user.firstName}_${user.lastName}_Resume.pdf`,
          content: resumeFile,
          contentType: 'application/pdf',
          type: 'resume',
        });
      }

      // Generate tracking ID
      const trackingId = `app_${userId}_${jobId}_${Date.now()}`;

      // Build email options
      const emailOptions = {
        to: recipientEmail,
        cc: ccToSelf ? user.email : undefined,
        subject: subject || `Application for ${jobTitle} position at ${company}`,
        trackingId,
        attachments: processedAttachments,
      };

      // Choose template or use text/html
      if (this.templates[template]) {
        emailOptions.template = this.templates[template];
        emailOptions.templateData = {
          jobTitle,
          company,
          recipientName: recipientName || hiringManager || 'Hiring Manager',
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userPhone: user.phone,
          coverLetter,
          additionalMessage,
        };
      } else {
        // Format email as HTML if no template is used
        emailOptions.html = this.formatApplicationEmail({
          jobTitle,
          company,
          recipientName: recipientName || hiringManager || 'Hiring Manager',
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userPhone: user.phone,
          coverLetter,
          additionalMessage,
        });

        // Also include plain text version
        emailOptions.text = this.formatApplicationEmailText({
          jobTitle,
          company,
          recipientName: recipientName || hiringManager || 'Hiring Manager',
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          userPhone: user.phone,
          coverLetter,
          additionalMessage,
        });
      }

      // Send the email
      const result = await emailService.sendEmail(emailOptions);

      // Save application record to database
      await this.saveApplicationRecord({
        userId,
        jobId,
        jobTitle,
        company,
        recipientEmail,
        trackingId,
        status: 'sent',
        sentAt: new Date(),
        messageId: result.messageId || result.id,
      });

      return {
        success: true,
        trackingId,
        messageId: result.messageId || result.id,
      };
    } catch (error) {
      console.error('Error sending application email:', error);
      throw new AppError('Failed to send application email', 500, error);
    }
  }

  private async scheduleEmail(options: ApplicationEmailOptions, scheduledDate: Date): Promise<any> {
    try {
      const trackingId = `app_${options.userId}_${options.jobId}_${Date.now()}`;

      // Save scheduled application record to database
      await this.saveApplicationRecord({
        userId: options.userId,
        jobId: options.jobId,
        jobTitle: options.jobTitle,
        company: options.company,
        recipientEmail: options.recipientEmail,
        trackingId,
        status: 'scheduled',
        scheduledAt: scheduledDate,
      });

      // Schedule the job
      schedule.scheduleJob(trackingId, scheduledDate, async () => {
        try {
          // Update the application to remove scheduledAt
          const updatedOptions = {
            ...options,
            scheduledAt: undefined,
          };

          // Send the email
          await this.sendApplicationEmail(updatedOptions);

          // Update record status
          await this.updateApplicationStatus(trackingId, 'sent');
        } catch (error) {
          console.error(`Error sending scheduled email ${trackingId}:`, error);
          await this.updateApplicationStatus(trackingId, 'failed', error.message);
        }
      });

      return {
        success: true,
        trackingId,
        scheduledAt: scheduledDate,
      };
    } catch (error) {
      console.error('Error scheduling application email:', error);
      throw new AppError('Failed to schedule application email', 500, error);
    }
  }

  private async processAttachments(attachments: ApplicationEmailOptions['attachments']): Promise<any[]> {
    const processedAttachments = [];

    for (const attachment of attachments || []) {
      if (attachment.url) {
        // If it's a URL, get the file from storage
        const file = await this.getFileFromStorage(attachment.url);
        processedAttachments.push({
          filename: attachment.filename || this.getFilenameFromUrl(attachment.url),
          content: file,
          contentType: attachment.contentType || 'application/octet-stream',
        });
      } else if (attachment.path) {
        // If it's a local path
        processedAttachments.push({
          filename: attachment.filename || this.getFilenameFromPath(attachment.path),
          path: attachment.path,
          contentType: attachment.contentType || 'application/octet-stream',
        });
      } else if (attachment.content) {
        // If content is directly provided
        processedAttachments.push({
          filename: attachment.filename,
          content: attachment.content,
          contentType: attachment.contentType || 'application/octet-stream',
        });
      }
    }

    return processedAttachments;
  }

  private async getUserInfo(userId: string): Promise<any> {
    // TODO: Implement user info retrieval from database
    return {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      resumeUrl: 'https://storage.example.com/resumes/john_doe_resume.pdf',
    };
  }

  private async getFileFromStorage(url: string): Promise<Buffer> {
    // TODO: Implement file retrieval from storage service
    return Buffer.from('');
  }

  private getFilenameFromUrl(url: string): string {
    return url.split('/').pop() || 'file';
  }

  private getFilenameFromPath(path: string): string {
    return path.split('/').pop() || 'file';
  }

  private async saveApplicationRecord(record: any): Promise<void> {
    // TODO: Implement saving application record to database
    console.log('Saving application record:', record);
  }

  private async updateApplicationStatus(trackingId: string, status: string, errorMessage?: string): Promise<void> {
    // TODO: Implement updating application status in database
    console.log(`Updating application ${trackingId} status to ${status}`);
  }

  private formatApplicationEmail(data: EmailTemplateData): string {
    const {
      jobTitle,
      company,
      recipientName,
      userName,
      userEmail,
      userPhone,
      coverLetter,
      additionalMessage,
    } = data;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Job Application: ${jobTitle} at ${company}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
          .header { margin-bottom: 20px; }
          .contact-info { margin-bottom: 30px; }
          .cover-letter { margin-bottom: 30px; white-space: pre-line; }
          .additional-message { margin-bottom: 30px; white-space: pre-line; }
          .signature { margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <p>Dear ${recipientName},</p>
        </div>
        
        <div class="cover-letter">
          ${coverLetter.replace(/\n/g, '<br>')}
        </div>
        
        ${additionalMessage ? `
        <div class="additional-message">
          ${additionalMessage.replace(/\n/g, '<br>')}
        </div>
        ` : ''}
        
        <div class="signature">
          <p>Sincerely,</p>
          <p>${userName}</p>
          <p>${userEmail} | ${userPhone}</p>
        </div>
      </body>
      </html>
    `;
  }

  private formatApplicationEmailText(data: EmailTemplateData): string {
    const {
      jobTitle,
      company,
      recipientName,
      userName,
      userEmail,
      userPhone,
      coverLetter,
      additionalMessage,
    } = data;

    return `
Dear ${recipientName},

${coverLetter}

${additionalMessage ? `\n${additionalMessage}\n` : ''}

Sincerely,
${userName}
${userEmail} | ${userPhone}
    `.trim();
  }
}

export const applicationEmailService = new ApplicationEmailService(); 