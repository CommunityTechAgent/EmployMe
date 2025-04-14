import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getOpenAIConfig } from '../config/openai.config';
import { extractKeywords, analyzeATSCompatibility } from '../utils/text-processor.utils';
import {
  UserProfile,
  JobDetails,
  CoverLetterOptions,
  CoverLetterResponse
} from '../types/cover-letter.types';

export class CoverLetterService {
  private model: ChatOpenAI;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    const config = getOpenAIConfig();
    this.maxTokens = config.maxTokens || 2000;
    this.temperature = config.temperature || 0.7;

    this.model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: this.temperature,
      openAIApiKey: config.apiKey,
    });
  }

  async generateCoverLetter(
    userProfile: UserProfile,
    jobDetails: JobDetails,
    options: CoverLetterOptions = {}
  ): Promise<CoverLetterResponse> {
    try {
      const {
        style = 'professional',
        length = 'medium',
        focusAreas = [],
        customInstructions = '',
        includeUserAddress = true,
        includeDateAndGreeting = true,
        includeClosure = true,
        language = 'en'
      } = options;

      // Create the system message with instructions
      const systemMessage = this.createSystemMessage(
        style,
        length,
        includeUserAddress,
        includeDateAndGreeting,
        includeClosure,
        customInstructions,
        language
      );

      // Create the user message with profile and job details
      const userMessage = this.createUserMessage(userProfile, jobDetails, focusAreas);

      // Create the chain
      const chain = PromptTemplate.fromTemplate(userMessage)
        .pipe(this.model)
        .pipe(new StringOutputParser());

      // Generate the cover letter
      const coverLetter = await chain.invoke({});

      // Extract keywords and analyze ATS compatibility
      const keywords = extractKeywords(jobDetails.description);
      const atsAnalysis = analyzeATSCompatibility(coverLetter, keywords);

      return {
        success: true,
        coverLetter,
        atsAnalysis
      };
    } catch (error) {
      console.error('Error generating cover letter:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private createSystemMessage(
    style: string,
    length: string,
    includeUserAddress: boolean,
    includeDateAndGreeting: boolean,
    includeClosure: boolean,
    customInstructions: string,
    language: string
  ): string {
    const lengthInstruction = this.getLengthInstruction(length);
    const styleInstruction = this.getStyleInstruction(style);
    const languageInstruction = this.getLanguageInstruction(language);

    return `
      You are an expert cover letter writer with years of experience helping job seekers create compelling, tailored cover letters that highlight their qualifications and secure interviews.

      Your task is to generate a highly personalized cover letter for the user based on their profile and the job details provided.

      Guidelines:
      - ${styleInstruction}
      - ${lengthInstruction}
      - ${languageInstruction}
      - Emphasize relevant skills, experiences, and achievements that match the job requirements.
      - Do not use generic language or clichés.
      - Focus on demonstrating the value the candidate would bring to the company.
      - Use action verbs and specific examples.
      - Optimize the content for Applicant Tracking Systems (ATS).
      - Ensure the letter is well-structured with a clear introduction, body paragraphs, and conclusion.
      - Make the opening paragraph engaging.
      - Address the hiring manager by name if provided.
      - Format the cover letter professionally.
      ${includeUserAddress ? '- Include the user\'s address and contact information at the top.' : ''}
      ${includeDateAndGreeting ? '- Include the date and an appropriate greeting.' : ''}
      ${includeClosure ? '- Include an appropriate closing and signature line.' : ''}
      
      ${customInstructions ? `Additional instructions: ${customInstructions}` : ''}
    `;
  }

  private createUserMessage(
    userProfile: UserProfile,
    jobDetails: JobDetails,
    focusAreas: string[]
  ): string {
    return `
      # User Profile Information
      
      ## Personal Details
      - Name: ${userProfile.name}
      - Email: ${userProfile.email}
      ${userProfile.phone ? `- Phone: ${userProfile.phone}` : ''}
      ${userProfile.address ? `- Address: ${userProfile.address}` : ''}
      ${userProfile.title ? `- Professional Title: ${userProfile.title}` : ''}
      
      ${userProfile.summary ? `## Professional Summary\n${userProfile.summary}` : ''}
      
      ${userProfile.skills?.length ? `## Skills\n${userProfile.skills.join(', ')}` : ''}
      
      ${userProfile.experience?.length ? `## Work Experience\n${this.formatExperience(userProfile.experience)}` : ''}
      
      ${userProfile.education?.length ? `## Education\n${this.formatEducation(userProfile.education)}` : ''}
      
      ${userProfile.certifications?.length ? `## Certifications\n${this.formatCertifications(userProfile.certifications)}` : ''}
      
      ${userProfile.projects?.length ? `## Notable Projects\n${this.formatProjects(userProfile.projects)}` : ''}
      
      # Job Details
      
      ## Basic Information
      - Position: ${jobDetails.title}
      - Company: ${jobDetails.company}
      ${jobDetails.location ? `- Location: ${jobDetails.location}` : ''}
      ${jobDetails.department ? `- Department: ${jobDetails.department}` : ''}
      ${jobDetails.hiringManager ? `- Hiring Manager: ${jobDetails.hiringManager}` : ''}
      
      ## Job Description
      ${jobDetails.description}
      
      ${jobDetails.responsibilities?.length ? `## Key Responsibilities\n${jobDetails.responsibilities.map(r => `* ${r}`).join('\n')}` : ''}
      
      ${jobDetails.requirements?.length ? `## Requirements\n${jobDetails.requirements.map(r => `* ${r}`).join('\n')}` : ''}
      
      ${jobDetails.qualifications?.length ? `## Qualifications\n${jobDetails.qualifications.map(q => `* ${q}`).join('\n')}` : ''}
      
      ${jobDetails.companyInfo ? `## About the Company\n${jobDetails.companyInfo}` : ''}
      
      ${focusAreas.length ? `# Focus Areas\nPlease emphasize the following areas in the cover letter:\n${focusAreas.map(area => `* ${area}`).join('\n')}` : ''}
      
      Based on the information above, please generate a tailored cover letter.
    `;
  }

  private formatExperience(experience: any[]): string {
    return experience.map(exp => `
      * ${exp.title} at ${exp.company}, ${exp.location} (${exp.startDate} - ${exp.endDate || 'Present'})
        ${exp.description ? `- ${exp.description}` : ''}
        ${exp.achievements?.length ? '- Key achievements:\n' + exp.achievements.map(a => `    * ${a}`).join('\n') : ''}
    `).join('\n');
  }

  private formatEducation(education: any[]): string {
    return education.map(edu => `
      * ${edu.degree} in ${edu.field}, ${edu.institution}, ${edu.location} (${edu.graduationYear})
    `).join('\n');
  }

  private formatCertifications(certifications: any[]): string {
    return certifications.map(cert => `
      * ${cert.name} (${cert.issuer}, ${cert.date})
    `).join('\n');
  }

  private formatProjects(projects: any[]): string {
    return projects.map(proj => `
      * ${proj.name}: ${proj.description}
    `).join('\n');
  }

  private getLengthInstruction(length: string): string {
    switch (length) {
      case 'short':
        return 'Keep the cover letter concise, not exceeding 250-300 words.';
      case 'long':
        return 'Create a comprehensive cover letter of approximately 400-500 words.';
      case 'medium':
      default:
        return 'Create a cover letter of approximately 300-400 words.';
    }
  }

  private getStyleInstruction(style: string): string {
    switch (style) {
      case 'conversational':
        return 'Use a friendly, conversational tone while maintaining professionalism.';
      case 'creative':
        return 'Use a creative and engaging tone that showcases personality while remaining appropriate for a job application.';
      case 'professional':
      default:
        return 'Use a formal, professional tone appropriate for business communication.';
    }
  }

  private getLanguageInstruction(language: string): string {
    const languages: { [key: string]: string } = {
      'en': 'Write in English.',
      'es': 'Write in Spanish.',
      'fr': 'Write in French.',
      'de': 'Write in German.',
      'it': 'Write in Italian.',
      'pt': 'Write in Portuguese.',
      'zh': 'Write in Chinese.',
      'ja': 'Write in Japanese.',
      'ko': 'Write in Korean.',
      'ru': 'Write in Russian.'
    };

    return languages[language] || 'Write in English.';
  }
} 