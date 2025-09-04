import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  Trash2, 
  Eye, 
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { resumeAPI } from '../../services/resumeAPI';
import ResumeUpload from './ResumeUpload';
import type { ResumeInfo } from '../../types/resume';

interface ResumeManagerProps {
  className?: string;
  showUploadButton?: boolean;
}

const ResumeManager: React.FC<ResumeManagerProps> = ({
  className = '',
  showUploadButton = true
}) => {
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResumeInfo();
  }, []);

  const loadResumeInfo = async () => {
    try {
      setLoading(true);
      const info = await resumeAPI.getResumeInfo();
      setResumeInfo(info);
    } catch (err) {
      setError('Failed to load resume information');
      console.error('Error loading resume info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const downloadResponse = await resumeAPI.generateDownloadUrl();
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = downloadResponse.downloadUrl;
      link.download = downloadResponse.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download resume');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }

    try {
      await resumeAPI.deleteResume();
      await loadResumeInfo();
      setError(null);
    } catch (err) {
      setError('Failed to delete resume');
    }
  };

  const handleUploadSuccess = async () => {
    await loadResumeInfo();
    setShowUpload(false);
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (showUpload) {
    return (
      <div className={className}>
        <ResumeUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
        <button
          onClick={() => setShowUpload(false)}
          className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Resume
        </h2>
        
        {resumeInfo?.hasResume && showUploadButton && (
          <button
            onClick={() => setShowUpload(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
          >
            <Upload className="w-4 h-4 mr-1" />
            Replace
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {resumeInfo?.hasResume ? (
        <div className="space-y-4">
          {/* Resume Status */}
          <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-green-900">Resume uploaded successfully</p>
              <p className="text-sm text-green-700">Your resume is visible to employers</p>
            </div>
          </div>

          {/* Resume Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">File Name</label>
                <p className="text-gray-900">{resumeInfo.fileName}</p>
              </div>
              
              {resumeInfo.fileSize && (
                <div>
                  <label className="text-sm font-medium text-gray-700">File Size</label>
                  <p className="text-gray-900">{resumeAPI.formatFileSize(resumeInfo.fileSize)}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {resumeInfo.contentType && (
                <div>
                  <label className="text-sm font-medium text-gray-700">File Type</label>
                  <p className="text-gray-900">{resumeInfo.contentType}</p>
                </div>
              )}
              
              {resumeInfo.lastModified && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="text-gray-900 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(resumeInfo.lastModified)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </button>
            
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Resume Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Keep your resume updated with latest experience and skills</li>
              <li>• Use keywords relevant to your target job roles</li>
              <li>• Ensure your contact information is current</li>
              <li>• Consider having different versions for different job types</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resume uploaded</h3>
          <p className="text-gray-600 mb-6">
            Upload your resume to increase your chances of getting hired. 
            Employers can view and download your resume when you apply for jobs.
          </p>
          
          {showUploadButton && (
            <button
              onClick={() => setShowUpload(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Resume
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
