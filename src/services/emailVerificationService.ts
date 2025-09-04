import type { EmailVerification } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth headers
const getAuthHeaders = (token?: string | null) => ({
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` }),
});

export class EmailVerificationService {
  /**
   * Send OTP to email address
   */
  static async sendOTP(email: string): Promise<{ success: boolean; expiresAt: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send OTP');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(email: string, otp: string): Promise<{ success: boolean; token?: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid verification code');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Resend OTP (with rate limiting)
   */
  static async resendOTP(email: string): Promise<{ success: boolean; expiresAt: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resend OTP');
    }

    const data = await response.json();
    return data;
  }

  /**
   * Check email verification status
   */
  static async checkVerificationStatus(email: string): Promise<EmailVerification> {
    const response = await fetch(`${API_BASE_URL}/auth/verification-status?email=${encodeURIComponent(email)}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to check verification status');
    }

    const data = await response.json();
    return data.verification;
  }

  /**
   * Validate email domain for company emails
   */
  static validateCompanyEmail(email: string): { isValid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }

    // Check against common personal email domains
    const personalDomains = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'protonmail.com',
      'mail.com',
      'yandex.com',
      'zoho.com',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (personalDomains.includes(domain)) {
      return { 
        isValid: false, 
        error: 'Please use your company email address, not a personal email' 
      };
    }

    return { isValid: true };
  }

  /**
   * Validate LinkedIn profile URL
   */
  static validateLinkedInProfile(url: string): { isValid: boolean; error?: string } {
    if (!url.trim()) {
      return { isValid: false, error: 'LinkedIn profile is required' };
    }

    const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
    if (!linkedinRegex.test(url)) {
      return { 
        isValid: false, 
        error: 'Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourprofile)' 
      };
    }

    return { isValid: true };
  }

  /**
   * Generate OTP (for testing/demo purposes)
   */
  static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Check if OTP is expired
   */
  static isOTPExpired(expiresAt: string): boolean {
    return new Date() > new Date(expiresAt);
  }

  /**
   * Format time remaining for OTP
   */
  static getTimeRemaining(expiresAt: string): number {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const remaining = Math.max(0, expiry - now);
    return Math.floor(remaining / 1000); // Return seconds
  }

  /**
   * Check rate limiting for OTP requests
   */
  static checkRateLimit(email: string): { canSend: boolean; waitTime?: number } {
    const key = `otp_rate_limit_${email}`;
    const lastSent = localStorage.getItem(key);
    
    if (lastSent) {
      const timeSinceLastSent = Date.now() - parseInt(lastSent);
      const waitTime = 60000; // 1 minute rate limit
      
      if (timeSinceLastSent < waitTime) {
        return { 
          canSend: false, 
          waitTime: Math.ceil((waitTime - timeSinceLastSent) / 1000) 
        };
      }
    }

    return { canSend: true };
  }

  /**
   * Record OTP send time for rate limiting
   */
  static recordOTPSent(email: string): void {
    const key = `otp_rate_limit_${email}`;
    localStorage.setItem(key, Date.now().toString());
  }

  /**
   * Clear rate limit record (for testing)
   */
  static clearRateLimit(email: string): void {
    const key = `otp_rate_limit_${email}`;
    localStorage.removeItem(key);
  }
}

export default EmailVerificationService;
