import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../ui';

interface EmailVerificationFormProps {
  email: string;
  onVerificationComplete: (otp: string) => void;
  onResendOTP: () => void;
  loading?: boolean;
  error?: string;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  email,
  onVerificationComplete,
  onResendOTP,
  loading = false,
  error,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (otpValue?: string) => {
    const otpToSubmit = otpValue || otp.join('');
    if (otpToSubmit.length === 6) {
      setAttempts(prev => prev + 1);
      onVerificationComplete(otpToSubmit);
    }
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimeLeft(300);
    setCanResend(false);
    setAttempts(0);
    onResendOTP();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isBlocked = attempts >= maxAttempts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            <Mail className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-900">{email}</p>
        </div>

        <div className="mt-8 space-y-6">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
              Enter verification code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading || isBlocked}
                  className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    error && attempts > 0
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500'
                  } ${(loading || isBlocked) ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          {/* Attempts Warning */}
          {attempts > 0 && attempts < maxAttempts && (
            <div className="text-center text-yellow-600 text-sm">
              {maxAttempts - attempts} attempts remaining
            </div>
          )}

          {/* Blocked Message */}
          {isBlocked && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Too many failed attempts</p>
                  <p>Please request a new verification code.</p>
                </div>
              </div>
            </div>
          )}

          {/* Timer and Resend */}
          <div className="text-center">
            {!canResend && !isBlocked ? (
              <p className="text-sm text-gray-600">
                Resend code in <span className="font-medium">{formatTime(timeLeft)}</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center mx-auto"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Resend verification code
              </button>
            )}
          </div>

          {/* Manual Submit Button */}
          <div>
            <Button
              onClick={() => handleSubmit()}
              disabled={loading || otp.some(digit => !digit) || isBlocked}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-600">
            <p>Didn't receive the code?</p>
            <ul className="mt-2 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure {email} is correct</li>
              <li>• Wait a few minutes and try resending</li>
            </ul>
          </div>

          {/* Change Email */}
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Wrong email? Go back to change it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationForm;
