import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Building, Briefcase, ExternalLink, Shield } from 'lucide-react';
import { Button, Input } from '../ui';
import type { SignupForm } from '../../types';

interface EnhancedSignupFormProps {
  onSubmit: (data: SignupForm) => void;
  loading?: boolean;
}

const EnhancedSignupForm: React.FC<EnhancedSignupFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<SignupForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'candidate',
    linkedinProfile: '',
    companyName: '',
    jobTitle: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Employer-specific validation
    if (formData.role === 'employer') {
      if (!formData.companyName?.trim()) {
        newErrors.companyName = 'Company name is required for employers';
      }
      if (!formData.jobTitle?.trim()) {
        newErrors.jobTitle = 'Job title is required for employers';
      }
      if (!formData.linkedinProfile?.trim()) {
        newErrors.linkedinProfile = 'LinkedIn profile is required for employers';
      } else {
        // LinkedIn URL validation
        const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
        if (!linkedinRegex.test(formData.linkedinProfile)) {
          newErrors.linkedinProfile = 'Please enter a valid LinkedIn profile URL';
        }
      }

      // Company email validation for employers
      if (formData.email) {
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
        const emailDomain = formData.email.split('@')[1]?.toLowerCase();
        if (commonDomains.includes(emailDomain)) {
          newErrors.email = 'Please use your company email address, not a personal email';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof SignupForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRoleChange = (role: 'candidate' | 'employer') => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      // Clear employer-specific fields when switching to candidate
      ...(role === 'candidate' && {
        linkedinProfile: '',
        companyName: '',
        jobTitle: '',
      })
    }));
    // Clear role-specific errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.linkedinProfile;
      delete newErrors.companyName;
      delete newErrors.jobTitle;
      return newErrors;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of professionals finding their dream jobs
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleRoleChange('candidate')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.role === 'candidate'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <User className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Job Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('employer')}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.role === 'employer'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Building className="w-6 h-6 mx-auto mb-2" />
                <span className="font-medium">Recruiter</span>
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="John"
                error={errors.firstName}
                required
              />
            </div>
            <div>
              <Input
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Doe"
                error={errors.lastName}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <Input
              label={formData.role === 'employer' ? 'Company Email' : 'Email'}
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={formData.role === 'employer' ? 'john@company.com' : 'john@example.com'}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
            />
            {formData.role === 'employer' && (
              <p className="mt-1 text-xs text-gray-500">
                Use your company email address for verification
              </p>
            )}
          </div>

          {/* Employer-specific fields */}
          {formData.role === 'employer' && (
            <>
              <div>
                <Input
                  label="Company Name"
                  value={formData.companyName || ''}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Acme Corporation"
                  leftIcon={<Building className="w-4 h-4" />}
                  error={errors.companyName}
                  required
                />
              </div>

              <div>
                <Input
                  label="Job Title"
                  value={formData.jobTitle || ''}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="HR Manager, Talent Acquisition Lead"
                  leftIcon={<Briefcase className="w-4 h-4" />}
                  error={errors.jobTitle}
                  required
                />
              </div>

              <div>
                <Input
                  label="LinkedIn Profile"
                  value={formData.linkedinProfile || ''}
                  onChange={(e) => handleInputChange('linkedinProfile', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  error={errors.linkedinProfile}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Required for recruiter verification
                </p>
              </div>

              {/* Verification Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Recruiter Verification Required</p>
                    <p>
                      After signup, you'll need to verify your email with OTP and complete 
                      a detailed application. Our team will review and approve your account 
                      before you can access pricing and post jobs.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                `Create ${formData.role === 'employer' ? 'Recruiter' : 'Job Seeker'} Account`
              )}
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedSignupForm;
