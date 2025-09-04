import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Minus } from 'lucide-react';
import { Button, Input, Select, Card, Modal } from '../ui';

const jobPostingSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  experience: z.string().min(1, 'Experience level is required'),
  salaryMin: z.number().min(0, 'Minimum salary must be positive'),
  salaryMax: z.number().min(0, 'Maximum salary must be positive'),
  description: z.string().min(50, 'Job description must be at least 50 characters'),
});

type JobPostingForm = z.infer<typeof jobPostingSchema> & {
  skills: string[];
  requirements: string[];
  benefits: string[];
};

interface JobPostingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobPostingForm) => void;
}

export const JobPostingForm: React.FC<JobPostingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [skills, setSkills] = useState<string[]>(['']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [benefits, setBenefits] = useState<string[]>(['']);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<JobPostingForm, 'skills' | 'requirements' | 'benefits'>>({
    resolver: zodResolver(jobPostingSchema),
  });

  const jobTypeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  const experienceOptions = [
    { value: '0-1 years', label: '0-1 years' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5-8 years', label: '5-8 years' },
    { value: '8+ years', label: '8+ years' },
  ];

  const handleArrayChange = (
    index: number,
    value: string,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };

  const addArrayItem = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setArray([...array, '']);
  };

  const removeArrayItem = (
    index: number,
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (array.length > 1) {
      const newArray = array.filter((_, i) => i !== index);
      setArray(newArray);
    }
  };

  const handleFormSubmit = (data: Omit<JobPostingForm, 'skills' | 'requirements' | 'benefits'>) => {
    const formData: JobPostingForm = {
      ...data,
      skills: skills.filter(skill => skill.trim() !== ''),
      requirements: requirements.filter(req => req.trim() !== ''),
      benefits: benefits.filter(benefit => benefit.trim() !== ''),
    };
    onSubmit(formData);
    reset();
    setSkills(['']);
    setRequirements(['']);
    setBenefits(['']);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post a New Job" size="xl">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job Title"
            placeholder="e.g., Senior Frontend Developer"
            error={errors.title?.message}
            {...register('title')}
          />

          <Input
            label="Location"
            placeholder="e.g., Bangalore, India"
            error={errors.location?.message}
            {...register('location')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Job Type"
            options={jobTypeOptions}
            placeholder="Select job type"
            error={errors.type?.message}
            {...register('type')}
          />

          <Select
            label="Experience Level"
            options={experienceOptions}
            placeholder="Select experience level"
            error={errors.experience?.message}
            {...register('experience')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Minimum Salary (₹)"
            type="number"
            placeholder="e.g., 1200000"
            error={errors.salaryMin?.message}
            {...register('salaryMin', { valueAsNumber: true })}
          />

          <Input
            label="Maximum Salary (₹)"
            type="number"
            placeholder="e.g., 2000000"
            error={errors.salaryMax?.message}
            {...register('salaryMax', { valueAsNumber: true })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            rows={4}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            {...register('description')}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Skills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Required Skills
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(skills, setSkills)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>
          <div className="space-y-2">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="e.g., React, TypeScript"
                  value={skill}
                  onChange={(e) => handleArrayChange(index, e.target.value, skills, setSkills)}
                />
                {skills.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(index, skills, setSkills)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(requirements, setRequirements)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Requirement
            </Button>
          </div>
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="e.g., 3+ years of experience with React"
                  value={requirement}
                  onChange={(e) => handleArrayChange(index, e.target.value, requirements, setRequirements)}
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(index, requirements, setRequirements)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Benefits
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addArrayItem(benefits, setBenefits)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Benefit
            </Button>
          </div>
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder="e.g., Health insurance, Flexible working hours"
                  value={benefit}
                  onChange={(e) => handleArrayChange(index, e.target.value, benefits, setBenefits)}
                />
                {benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem(index, benefits, setBenefits)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Post Job
          </Button>
        </div>
      </form>
    </Modal>
  );
};
