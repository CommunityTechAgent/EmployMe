import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { applicationEmailService } from '@/services/application-email.service';
import { AppError } from '@/utils/app.error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the current session
    const session = await getSession({ req });
    if (!session?.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      jobId,
      jobTitle,
      company,
      recipientEmail,
      recipientName,
      hiringManager,
      subject,
      coverLetter,
      additionalMessage,
      template,
      ccToSelf,
      attachments,
      scheduledAt,
    } = req.body;

    // Validate required fields
    if (!jobId || !jobTitle || !company || !recipientEmail || !coverLetter) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['jobId', 'jobTitle', 'company', 'recipientEmail', 'coverLetter'],
      });
    }

    // Send the application email
    const result = await applicationEmailService.sendApplicationEmail({
      userId: session.user.id,
      jobId,
      jobTitle,
      company,
      recipientEmail,
      recipientName,
      hiringManager,
      subject,
      coverLetter,
      additionalMessage,
      template,
      ccToSelf,
      attachments,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error sending application:', error);
    
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        error: error.message,
        details: error.details,
      });
    }

    return res.status(500).json({
      error: 'Failed to send application',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
} 