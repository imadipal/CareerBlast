import React, { useState } from 'react';
import { Search, Briefcase, Filter } from 'lucide-react';
import { Input, Select, Button, Card, Modal } from '../ui';
import type { JobFilters as JobFiltersType } from '../../types';
import { useResponsive } from '../../hooks/useResponsive';

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  onClearFilters: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { isMobile } = useResponsive();
  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'pune', label: 'Pune' },
    { value: 'chennai', label: 'Chennai' },
  ];

  const experienceOptions = [
    { value: '', label: 'All Experience' },
    { value: '0-1 years', label: '0-1 years' },
    { value: '1-3 years', label: '1-3 years' },
    { value: '3-5 years', label: '3-5 years' },
    { value: '5-8 years', label: '5-8 years' },
    { value: '8+ years', label: '8+ years' },
  ];

  const jobTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  const salaryOptions = [
    { value: '', label: 'All Salaries' },
    { value: '0-500000', label: 'Up to ₹5L' },
    { value: '500000-1000000', label: '₹5L - ₹10L' },
    { value: '1000000-1500000', label: '₹10L - ₹15L' },
    { value: '1500000-2500000', label: '₹15L - ₹25L' },
    { value: '2500000-5000000', label: '₹25L - ₹50L' },
    { value: '5000000+', label: '₹50L+' },
  ];

  const handleFilterChange = (key: keyof JobFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleSalaryChange = (value: string) => {
    if (!value) {
      handleFilterChange('salary', undefined);
      return;
    }

    if (value === '5000000+') {
      handleFilterChange('salary', { min: 5000000 });
    } else {
      const [min, max] = value.split('-').map(Number);
      handleFilterChange('salary', { min, max });
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && 
    (typeof value !== 'object' || Object.keys(value).length > 0)
  );

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Input
          placeholder="Search jobs, companies, skills..."
          leftIcon={<Search className="w-5 h-5" />}
          value={filters.company || ''}
          onChange={(e) => handleFilterChange('company', e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          options={locationOptions}
          value={filters.location || ''}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          placeholder="Location"
        />

        <Select
          options={experienceOptions}
          value={filters.experience || ''}
          onChange={(e) => handleFilterChange('experience', e.target.value)}
          placeholder="Experience"
        />

        <Select
          options={jobTypeOptions}
          value={filters.type?.[0] || ''}
          onChange={(e) => handleFilterChange('type', e.target.value ? [e.target.value] : undefined)}
          placeholder="Job Type"
        />

        <Select
          options={salaryOptions}
          value={
            filters.salary
              ? filters.salary.max
                ? `${filters.salary.min}-${filters.salary.max}`
                : `${filters.salary.min}+`
              : ''
          }
          onChange={(e) => handleSalaryChange(e.target.value)}
          placeholder="Salary Range"
        />
      </div>

      {/* Skills Input */}
      <div>
        <Input
          placeholder="Skills (e.g., React, Python, AWS)"
          leftIcon={<Briefcase className="w-5 h-5" />}
          value={filters.skills?.join(', ') || ''}
          onChange={(e) => {
            const skills = e.target.value
              .split(',')
              .map(skill => skill.trim())
              .filter(skill => skill.length > 0);
            handleFilterChange('skills', skills.length > 0 ? skills : undefined);
          }}
        />
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Mobile Search Bar */}
        <Card className="mb-4">
          <div className="p-4">
            <Input
              placeholder="Search jobs, companies, skills..."
              leftIcon={<Search className="w-5 h-5" />}
              value={filters.company || ''}
              onChange={(e) => handleFilterChange('company', e.target.value)}
            />
          </div>
        </Card>

        {/* Mobile Filter Button */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-600"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Mobile Filter Modal */}
        <Modal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          title="Filter Jobs"
          size="sm"
        >
          <FilterContent />
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsFilterModalOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </Modal>
      </>
    );
  }

  return (
    <Card className="mb-6">
      <FilterContent />
    </Card>
  );
};
