import React, { useState } from 'react';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { AboutSection } from '../components/profile/AboutSection';
import { ExperienceSection } from '../components/profile/ExperienceSection';
import { EducationSection } from '../components/profile/EducationSection';
import { SkillsSection } from '../components/profile/SkillsSection';
import ResumeManager from '../components/resume/ResumeManager';
import { mockCandidateProfile } from '../data/candidates';
import { useAuth } from '../hooks/useAuth';

export const CandidateProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile] = useState(mockCandidateProfile);

  // Check if this is the user's own profile
  const isOwnProfile = user?.id === profile.userId;

  const handleEditProfile = () => {
    console.log('Edit profile');
    // Implement edit profile modal/page
  };

  const handleEditAbout = () => {
    console.log('Edit about section');
    // Implement edit about modal
  };

  const handleAddExperience = () => {
    console.log('Add experience');
    // Implement add experience modal
  };

  const handleEditExperience = (id: string) => {
    console.log('Edit experience:', id);
    // Implement edit experience modal
  };

  const handleDeleteExperience = (id: string) => {
    console.log('Delete experience:', id);
    // Implement delete confirmation
  };

  const handleAddEducation = () => {
    console.log('Add education');
    // Implement add education modal
  };

  const handleEditEducation = (id: string) => {
    console.log('Edit education:', id);
    // Implement edit education modal
  };

  const handleDeleteEducation = (id: string) => {
    console.log('Delete education:', id);
    // Implement delete confirmation
  };

  const handleAddSkill = () => {
    console.log('Add skill');
    // Implement add skill modal
  };

  const handleEditSkills = () => {
    console.log('Edit skills');
    // Implement edit skills modal
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEdit={handleEditProfile}
        />

        <AboutSection
          summary={profile.summary}
          isOwnProfile={isOwnProfile}
          onEdit={handleEditAbout}
        />

        <ExperienceSection
          experiences={profile.experience}
          isOwnProfile={isOwnProfile}
          onAdd={handleAddExperience}
          onEdit={handleEditExperience}
          onDelete={handleDeleteExperience}
        />

        <EducationSection
          education={profile.education}
          isOwnProfile={isOwnProfile}
          onAdd={handleAddEducation}
          onEdit={handleEditEducation}
          onDelete={handleDeleteEducation}
        />

        <SkillsSection
          skills={profile.skills}
          isOwnProfile={isOwnProfile}
          onAdd={handleAddSkill}
          onEdit={handleEditSkills}
        />

        {/* Resume Section - Only show for own profile */}
        {isOwnProfile && (
          <ResumeManager className="mb-8" />
        )}
      </div>
    </div>
  );
};
