import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  acceptedTypes: string[];
  maxSize: number; // in MB
  currentFile?: {
    name: string;
    url?: string;
    size?: number;
  };
  uploadType: 'resume' | 'profile-picture' | 'company-logo' | 'document';
  disabled?: boolean;
  error?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes,
  maxSize,
  currentFile,
  uploadType,
  disabled = false,
  error,
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getUploadConfig = () => {
    switch (uploadType) {
      case 'resume':
        return {
          title: 'Upload Resume',
          description: 'PDF, DOC, or DOCX files up to 5MB',
          icon: File,
          acceptText: 'PDF, DOC, DOCX',
        };
      case 'profile-picture':
        return {
          title: 'Upload Profile Picture',
          description: 'JPG, PNG files up to 2MB',
          icon: Image,
          acceptText: 'JPG, PNG',
        };
      case 'company-logo':
        return {
          title: 'Upload Company Logo',
          description: 'JPG, PNG, SVG files up to 1MB',
          icon: Image,
          acceptText: 'JPG, PNG, SVG',
        };
      case 'document':
        return {
          title: 'Upload Document',
          description: 'PDF, JPG, PNG files up to 10MB',
          icon: File,
          acceptText: 'PDF, JPG, PNG',
        };
      default:
        return {
          title: 'Upload File',
          description: 'Select a file to upload',
          icon: File,
          acceptText: 'Various formats',
        };
    }
  };

  const config = getUploadConfig();
  const IconComponent = config.icon;

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload ${config.acceptText} files only.`;
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError(null);
    onFileSelect(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    setUploadError(null);
    if (onFileRemove) {
      onFileRemove();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayError = error || uploadError;

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {currentFile ? (
        // Show current file
        <div className="border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {uploadType === 'profile-picture' || uploadType === 'company-logo' ? (
                  currentFile.url ? (
                    <img
                      src={currentFile.url}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gray-400" />
                    </div>
                  )
                ) : (
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {currentFile.name}
                </p>
                {currentFile.size && (
                  <p className="text-sm text-gray-500">
                    {formatFileSize(currentFile.size)}
                  </p>
                )}
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            {!disabled && (
              <button
                onClick={handleRemove}
                className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {!disabled && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                className="w-full"
              >
                Replace File
              </Button>
            </div>
          )}
        </div>
      ) : (
        // Show upload area
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400'
          } ${displayError ? 'border-red-300 bg-red-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
              displayError 
                ? 'bg-red-100' 
                : dragActive 
                ? 'bg-blue-100' 
                : 'bg-gray-100'
            }`}>
              {displayError ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <Upload className={`w-6 h-6 ${
                  dragActive ? 'text-blue-600' : 'text-gray-400'
                }`} />
              )}
            </div>
            
            <h3 className={`text-sm font-medium mb-1 ${
              displayError ? 'text-red-900' : 'text-gray-900'
            }`}>
              {dragActive ? 'Drop file here' : config.title}
            </h3>
            
            <p className={`text-xs mb-4 ${
              displayError ? 'text-red-600' : 'text-gray-500'
            }`}>
              {displayError || config.description}
            </p>
            
            {!disabled && (
              <Button
                variant="outline"
                size="sm"
                className={dragActive ? 'border-blue-500 text-blue-600' : ''}
              >
                Choose File
              </Button>
            )}
          </div>
        </div>
      )}

      {/* File requirements */}
      <div className="mt-2 text-xs text-gray-500">
        <p>Accepted formats: {config.acceptText}</p>
        <p>Maximum size: {maxSize}MB</p>
      </div>
    </div>
  );
};

export default FileUpload;
