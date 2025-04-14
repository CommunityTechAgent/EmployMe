import request from 'supertest';
import { app } from '../server';
import { Application } from '../models/Application';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { Types } from 'mongoose';

describe('Application Controller', () => {
  let testUser: any;
  let testJob: any;
  let testApplication: any;
  let authToken: string;

  beforeAll(async () => {
    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'candidate'
    });

    // Create a test job
    testJob = await Job.create({
      title: 'Test Job',
      description: 'Test Description',
      company: 'Test Company',
      location: {
        type: 'remote',
        city: 'Test City',
        country: 'Test Country'
      },
      jobType: 'full-time',
      workArrangement: 'remote',
      experienceLevel: 'mid',
      salary: {
        min: 50000,
        max: 70000,
        currency: 'USD'
      },
      postedBy: testUser._id
    });

    // Create a test application
    testApplication = await Application.create({
      user: testUser._id,
      job: testJob._id,
      coverLetter: 'Test Cover Letter',
      resume: 'Test Resume',
      status: 'applied'
    });

    // Generate auth token
    authToken = testUser.generateAuthToken();
  });

  describe('GET /api/v1/applications', () => {
    it('should return all applications', async () => {
      const response = await request(app)
        .get('/api/v1/applications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/applications/:id', () => {
    it('should return a specific application', async () => {
      const response = await request(app)
        .get(`/api/v1/applications/${testApplication._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(testApplication._id.toString());
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .get(`/api/v1/applications/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/applications', () => {
    it('should create a new application', async () => {
      const newApplication = {
        jobId: testJob._id,
        coverLetter: 'New Cover Letter',
        resume: 'New Resume',
        portfolio: 'New Portfolio'
      };

      const response = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newApplication);

      expect(response.status).toBe(201);
      expect(response.body.coverLetter).toBe(newApplication.coverLetter);
    });

    it('should return 400 for invalid job ID', async () => {
      const response = await request(app)
        .post('/api/v1/applications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          jobId: 'invalid-id',
          coverLetter: 'Test Cover Letter'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/v1/applications/:id', () => {
    it('should update an application', async () => {
      const updates = {
        coverLetter: 'Updated Cover Letter',
        resume: 'Updated Resume'
      };

      const response = await request(app)
        .put(`/api/v1/applications/${testApplication._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.coverLetter).toBe(updates.coverLetter);
    });
  });

  describe('PATCH /api/v1/applications/:id/status', () => {
    it('should update application status', async () => {
      const statusUpdate = {
        status: 'interviewing',
        notes: 'Scheduled for interview'
      };

      const response = await request(app)
        .patch(`/api/v1/applications/${testApplication._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(statusUpdate);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe(statusUpdate.status);
      expect(response.body.statusHistory).toHaveLength(2);
    });
  });

  describe('POST /api/v1/applications/:id/interviews', () => {
    it('should schedule an interview', async () => {
      const interview = {
        type: 'technical',
        scheduledDate: new Date().toISOString(),
        interviewer: 'John Doe',
        notes: 'Technical interview'
      };

      const response = await request(app)
        .post(`/api/v1/applications/${testApplication._id}/interviews`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(interview);

      expect(response.status).toBe(200);
      expect(response.body.interviews).toHaveLength(1);
      expect(response.body.interviews[0].type).toBe(interview.type);
    });
  });

  describe('GET /api/v1/applications/job/:jobId', () => {
    it('should return applications for a specific job', async () => {
      const response = await request(app)
        .get(`/api/v1/applications/job/${testJob._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/applications/user/:userId', () => {
    it('should return applications for a specific user', async () => {
      const response = await request(app)
        .get(`/api/v1/applications/user/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });
}); 