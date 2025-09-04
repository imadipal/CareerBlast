import React, { useState } from 'react';
import { Upload, Building, Mail, Phone, Globe, Briefcase, FileText, AlertCircle } from 'lucide-react';
import { Button, Input, Select, Card } from '../ui';
import type { RecruiterApplication } from '../../types';

interface RecruiterApplicationFormProps {
  onSubmit: (application: Omit<RecruiterApplication, 'id' | 'userId' | 'status' | 'submittedAt'>) => void;
  loading?: boolean;
}

const RecruiterApplicationForm: React.FC<RecruiterApplicationFormProps> = ({ 
  onSubmit, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    companySize: '',
    industry: '',
    jobTitle: '',
    workEmail: '',
    phoneNumber: '',
    linkedinProfile: '',
    companyDescription: '',
    hiringNeeds: '',
    documents: {
      businessLicense: '',
      companyLogo: '',
      identityProof: '',
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const companySizeOptions = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
  ];

  const industryOptions = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'media', label: 'Media & Entertainment' },
    { value: 'real-estate', label: 'Real Estate' },
    { value: 'other', label: 'Other' },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companyWebsite.trim()) newErrors.companyWebsite = 'Company website is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';
    if (!formData.industry) newErrors.industry = 'Industry is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
    if (!formData.workEmail.trim()) newErrors.workEmail = 'Work email is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.companyDescription.trim()) newErrors.companyDescription = 'Company description is required';
    if (!formData.hiringNeeds.trim()) newErrors.hiringNeeds = 'Hiring needs description is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.workEmail && !emailRegex.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }

    // Website validation
    const urlRegex = /^https?:\/\/.+\..+/;
    if (formData.companyWebsite && !urlRegex.test(formData.companyWebsite)) {
      newErrors.companyWebsite = 'Please enter a valid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    // In a real app, this would upload to a file storage service
    const fileUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, [field]: fileUrl }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Verification</h1>
        <p className="text-gray-600">
          Please provide your company details for verification. All recruiters must be approved before accessing our platform.
        </p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Company Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  error={errors.companyName}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website *
                </label>
                <Input
                  value={formData.companyWebsite}
                  onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                  placeholder="https://company.com"
                  leftIcon={<Globe className="w-4 h-4" />}
                  error={errors.companyWebsite}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size *
                </label>
                <Select
                  options={companySizeOptions}
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  placeholder="Select company size"
                  error={errors.companySize}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <Select
                  options={industryOptions}
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="Select industry"
                  error={errors.industry}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Description *
              </label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder="Describe your company, what you do, and your mission..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.companyDescription && (
                <p className="text-red-500 text-sm mt-1">{errors.companyDescription}</p>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Your Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <Input
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="e.g., HR Manager, Talent Acquisition Lead"
                  error={errors.jobTitle}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email *
                </label>
                <Input
                  type="email"
                  value={formData.workEmail}
                  onChange={(e) => handleInputChange('workEmail', e.target.value)}
                  placeholder="your.email@company.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.workEmail}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  leftIcon={<Phone className="w-4 h-4" />}
                  error={errors.phoneNumber}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile (Optional)
                </label>
                <Input
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>
          </div>

          {/* Hiring Needs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Hiring Requirements
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe Your Hiring Needs *
              </label>
              <textarea
                value={formData.hiringNeeds}
                onChange={(e) => handleInputChange('hiringNeeds', e.target.value)}
                placeholder="What types of roles are you looking to fill? What are your typical hiring volumes? Any specific requirements?"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.hiringNeeds && (
                <p className="text-red-500 text-sm mt-1">{errors.hiringNeeds}</p>
              )}
            </div>
          </div>

          {/* Document Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Supporting Documents (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business License
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('businessLicense', e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.svg"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('companyLogo', e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Proof
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload('identityProof', e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Verification Process</p>
                <p>
                  Your application will be reviewed by our team within 2-3 business days. 
                  You'll receive an email notification once your account is approved. 
                  Only verified recruiters can access pricing and post jobs on our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="px-8"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterApplicationForm;
