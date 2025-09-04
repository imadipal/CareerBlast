import React from 'react';
import { ArrowLeft, FileText, Upload, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResumeSection } from '../components/resume/ResumeSection';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useResume } from '../hooks/useResume';

export const ResumePage: React.FC = () => {
  const { resumeInfo, loading } = useResume();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/profile" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resume Management</h1>
              <p className="text-gray-600 mt-2">
                Upload and manage your resume to help employers find you
              </p>
            </div>
            
            {resumeInfo?.hasResume && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Resume Uploaded</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resume Upload Section */}
        <ResumeSection 
          showTitle={false}
          className="mb-8"
        />

        {/* Resume Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">
              Drag and drop or click to upload your resume in PDF, DOC, or DOCX format
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Employer Visibility</h3>
            <p className="text-gray-600 text-sm">
              Your resume helps employers understand your background and qualifications
            </p>
          </Card>

          <Card className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Storage</h3>
            <p className="text-gray-600 text-sm">
              Your resume is securely stored and can be downloaded anytime
            </p>
          </Card>
        </div>

        {/* Resume Guidelines */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Guidelines</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">✅ Best Practices</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use a clean, professional format</li>
                <li>• Include relevant work experience</li>
                <li>• List your education and certifications</li>
                <li>• Add technical skills and competencies</li>
                <li>• Use action verbs and quantify achievements</li>
                <li>• Keep it concise (1-2 pages)</li>
                <li>• Proofread for spelling and grammar</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">📋 Technical Requirements</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>File formats:</strong> PDF, DOC, DOCX</li>
                <li>• <strong>Maximum size:</strong> 10MB</li>
                <li>• <strong>Recommended:</strong> PDF format for best compatibility</li>
                <li>• <strong>File name:</strong> Use your name (e.g., "John_Doe_Resume.pdf")</li>
                <li>• <strong>Security:</strong> Files are encrypted and securely stored</li>
                <li>• <strong>Privacy:</strong> Only visible to employers you apply to</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link to="/jobs">
            <Button variant="outline">
              Browse Jobs
            </Button>
          </Link>
          <Link to="/recommended-jobs">
            <Button>
              View Recommended Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
