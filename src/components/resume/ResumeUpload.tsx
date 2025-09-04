import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Download, Trash2 } from 'lucide-react';
import { resumeAPI } from '../../services/resumeAPI';
import type { ResumeInfo } from '../../types/resume';

interface ResumeUploadProps {
  onUploadSuccess?: () => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing resume info on component mount
  React.useEffect(() => {
    loadResumeInfo();
  }, []);

  const loadResumeInfo = async () => {
    try {
      const info = await resumeAPI.getResumeInfo();
      setResumeInfo(info);
    } catch (err) {
      console.error('Error loading resume info:', err);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      await resumeAPI.uploadResume(file, (progress) => {
        setUploadProgress(progress);
      });

      // Reload resume info
      await loadResumeInfo();
      
      onUploadSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    try {
      await resumeAPI.deleteResume();
      await loadResumeInfo();
    } catch (err) {
      setError('Failed to delete resume');
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // If resume exists, show resume info
  if (resumeInfo?.hasResume) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Download Resume"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Resume"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-green-900">{resumeInfo.fileName}</p>
            {resumeInfo.fileSize && (
              <p className="text-sm text-green-700">
                {resumeAPI.formatFileSize(resumeInfo.fileSize)}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={openFileDialog}
          className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Replace Resume
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  // Upload interface
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Resume</h3>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Uploading...</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <File className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Supports PDF, DOC, DOCX (max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mt-4 text-xs text-gray-500">
        <p>• Accepted formats: PDF, DOC, DOCX</p>
        <p>• Maximum file size: 10MB</p>
        <p>• Your resume will be securely stored and can be accessed by employers</p>
      </div>
    </div>
  );
};

export default ResumeUpload;
