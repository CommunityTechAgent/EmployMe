import React, { useState } from 'react';
import { UserProfile, JobDetails, CoverLetterOptions } from '../../types/cover-letter.types';

interface CoverLetterFormProps {
  onSubmit: (data: {
    userProfile: UserProfile;
    jobDetails: JobDetails;
    options: CoverLetterOptions;
  }) => Promise<void>;
  isLoading?: boolean;
}

const CoverLetterForm: React.FC<CoverLetterFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    userProfile: {
      name: '',
      email: '',
      phone: '',
      address: '',
      title: '',
      summary: '',
      skills: [] as string[],
      experience: [] as any[],
      education: [] as any[],
      certifications: [] as any[],
      projects: [] as any[]
    },
    jobDetails: {
      title: '',
      company: '',
      location: '',
      department: '',
      hiringManager: '',
      description: '',
      responsibilities: [] as string[],
      requirements: [] as string[],
      qualifications: [] as string[],
      companyInfo: ''
    },
    options: {
      style: 'professional' as const,
      length: 'medium' as const,
      focusAreas: [] as string[],
      customInstructions: '',
      includeUserAddress: true,
      includeDateAndGreeting: true,
      includeClosure: true,
      language: 'en'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section: 'userProfile' | 'jobDetails' | 'options',
    field: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.userProfile.name) newErrors['userProfile.name'] = 'Name is required';
    if (!formData.userProfile.email) newErrors['userProfile.email'] = 'Email is required';
    if (!formData.jobDetails.title) newErrors['jobDetails.title'] = 'Job title is required';
    if (!formData.jobDetails.company) newErrors['jobDetails.company'] = 'Company name is required';
    if (!formData.jobDetails.description) newErrors['jobDetails.description'] = 'Job description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.userProfile.name}
              onChange={(e) => handleInputChange(e, 'userProfile', 'name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors['userProfile.name'] && (
              <p className="mt-1 text-sm text-red-600">{errors['userProfile.name']}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.userProfile.email}
              onChange={(e) => handleInputChange(e, 'userProfile', 'email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors['userProfile.email'] && (
              <p className="mt-1 text-sm text-red-600">{errors['userProfile.email']}</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              value={formData.jobDetails.title}
              onChange={(e) => handleInputChange(e, 'jobDetails', 'title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors['jobDetails.title'] && (
              <p className="mt-1 text-sm text-red-600">{errors['jobDetails.title']}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <input
              type="text"
              value={formData.jobDetails.company}
              onChange={(e) => handleInputChange(e, 'jobDetails', 'company')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors['jobDetails.company'] && (
              <p className="mt-1 text-sm text-red-600">{errors['jobDetails.company']}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Job Description</label>
          <textarea
            value={formData.jobDetails.description}
            onChange={(e) => handleInputChange(e, 'jobDetails', 'description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors['jobDetails.description'] && (
            <p className="mt-1 text-sm text-red-600">{errors['jobDetails.description']}</p>
          )}
        </div>
      </div>

      {/* Options Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Cover Letter Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Style</label>
            <select
              value={formData.options.style}
              onChange={(e) => handleInputChange(e, 'options', 'style')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="conversational">Conversational</option>
              <option value="creative">Creative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Length</label>
            <select
              value={formData.options.length}
              onChange={(e) => handleInputChange(e, 'options', 'length')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </div>
    </form>
  );
};

export default CoverLetterForm; 