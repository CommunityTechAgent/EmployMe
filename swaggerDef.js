module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'JobHub API',
    version: '1.0.0',
    description: 'API documentation for JobHub application',
    contact: {
      name: 'API Support',
      email: 'support@jobhub.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Application: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Application ID'
          },
          user: {
            type: 'string',
            description: 'User ID who submitted the application'
          },
          job: {
            type: 'string',
            description: 'Job ID being applied for'
          },
          coverLetter: {
            type: 'string',
            description: 'Cover letter for the application'
          },
          resume: {
            type: 'string',
            description: 'Resume URL or content'
          },
          portfolio: {
            type: 'string',
            description: 'Portfolio URL or content'
          },
          additionalDocuments: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Additional documents URLs'
          },
          status: {
            type: 'string',
            enum: ['applied', 'reviewing', 'interviewing', 'offered', 'rejected', 'withdrawn'],
            description: 'Current status of the application'
          },
          statusHistory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                status: {
                  type: 'string'
                },
                date: {
                  type: 'string',
                  format: 'date-time'
                },
                notes: {
                  type: 'string'
                }
              }
            }
          },
          interviews: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['phone', 'video', 'technical', 'onsite']
                },
                scheduledDate: {
                  type: 'string',
                  format: 'date-time'
                },
                interviewer: {
                  type: 'string'
                },
                notes: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  }
}; 