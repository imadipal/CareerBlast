#!/usr/bin/env node

/**
 * Security Audit Script for MyNexJob
 * Scans codebase for potential security vulnerabilities
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security patterns to check for
const SECURITY_PATTERNS = {
  // Sensitive data logging (excluding documentation and comments)
  PASSWORD_LOGGING: [
    /console\.log.*password(?!.*(?:reset|validation|requirement|strength|message|error|documentation))/i,
    /console\.info.*password(?!.*(?:reset|validation|requirement|strength|message|error|documentation))/i,
    /console\.debug.*password(?!.*(?:reset|validation|requirement|strength|message|error|documentation))/i,
    /console\.warn.*password(?!.*(?:reset|validation|requirement|strength|message|error|documentation))/i,
    /console\.error.*password(?!.*(?:reset|validation|requirement|strength|message|error|documentation))/i,
    /console\.log.*token(?!.*(?:validation|message|error|documentation))/i,
    /console\.log.*secret(?!.*(?:validation|message|error|documentation))/i,
    /console\.log.*key(?!.*(?:validation|message|error|documentation))/i,
  ],
  
  // Hardcoded secrets (excluding validation messages)
  HARDCODED_SECRETS: [
    /(?<!newErrors\.)password\s*[:=]\s*["'][^"']{8,}["']/i,
    /(?<!message.*|error.*|validation.*)secret\s*[:=]\s*["'][^"']+["']/i,
    /api[_-]?key\s*[:=]\s*["'][^"']{10,}["']/i,
    /(?<!invite-|test-|mock-)token\s*[:=]\s*["'][^"']{10,}["']/i,
    /jwt[_-]?secret\s*[:=]\s*["'][^"']+["']/i,
  ],
  
  // Unsafe practices
  UNSAFE_PRACTICES: [
    /eval\s*\(/,
    /innerHTML\s*=/,
    /dangerouslySetInnerHTML/,
    /document\.write\s*\(/,
    /window\.location\s*=.*user/i,
  ],
  
  // Missing validation
  MISSING_VALIDATION: [
    /req\.body\.[a-zA-Z_]+.*without.*validation/i,
    /params\.[a-zA-Z_]+.*without.*validation/i,
  ],
};

// Files to exclude from security scan
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.log$/,
  /\.md$/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /security-audit\.js$/, // Exclude this script itself
];

// File extensions to scan
const SCAN_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.java', '.json'];

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.scannedFiles = 0;
    this.startTime = Date.now();
  }

  /**
   * Main audit function
   */
  async audit(rootDir = '.') {
    console.log('🔍 Starting security audit...\n');
    
    await this.scanDirectory(rootDir);
    
    this.generateReport();
  }

  /**
   * Recursively scan directory for security issues
   */
  async scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (this.shouldExclude(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        await this.scanDirectory(fullPath);
      } else if (entry.isFile() && this.shouldScanFile(fullPath)) {
        await this.scanFile(fullPath);
      }
    }
  }

  /**
   * Check if file/directory should be excluded
   */
  shouldExclude(filePath) {
    return EXCLUDE_PATTERNS.some(pattern => pattern.test(filePath));
  }

  /**
   * Check if file should be scanned
   */
  shouldScanFile(filePath) {
    const ext = path.extname(filePath);
    return SCAN_EXTENSIONS.includes(ext);
  }

  /**
   * Scan individual file for security issues
   */
  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      this.scannedFiles++;
      
      lines.forEach((line, lineNumber) => {
        this.checkLine(filePath, line, lineNumber + 1);
      });
      
    } catch (error) {
      console.warn(`⚠️  Could not scan ${filePath}: ${error.message}`);
    }
  }

  /**
   * Check individual line for security issues
   */
  checkLine(filePath, line, lineNumber) {
    // Check for password logging
    SECURITY_PATTERNS.PASSWORD_LOGGING.forEach(pattern => {
      if (pattern.test(line)) {
        this.addIssue('CRITICAL', 'Password/Token Logging', filePath, lineNumber, line.trim());
      }
    });

    // Check for hardcoded secrets
    SECURITY_PATTERNS.HARDCODED_SECRETS.forEach(pattern => {
      if (pattern.test(line)) {
        this.addIssue('HIGH', 'Hardcoded Secret', filePath, lineNumber, line.trim());
      }
    });

    // Check for unsafe practices
    SECURITY_PATTERNS.UNSAFE_PRACTICES.forEach(pattern => {
      if (pattern.test(line)) {
        this.addIssue('MEDIUM', 'Unsafe Practice', filePath, lineNumber, line.trim());
      }
    });
  }

  /**
   * Add security issue to list
   */
  addIssue(severity, type, file, line, code) {
    this.issues.push({
      severity,
      type,
      file,
      line,
      code: code.substring(0, 100) + (code.length > 100 ? '...' : '')
    });
  }

  /**
   * Generate security audit report
   */
  generateReport() {
    const duration = Date.now() - this.startTime;
    
    console.log('🔒 SECURITY AUDIT REPORT');
    console.log('========================\n');
    
    console.log(`📊 Scan Summary:`);
    console.log(`   Files scanned: ${this.scannedFiles}`);
    console.log(`   Issues found: ${this.issues.length}`);
    console.log(`   Scan duration: ${duration}ms\n`);
    
    if (this.issues.length === 0) {
      console.log('✅ No security issues found!\n');
      return;
    }
    
    // Group issues by severity
    const critical = this.issues.filter(i => i.severity === 'CRITICAL');
    const high = this.issues.filter(i => i.severity === 'HIGH');
    const medium = this.issues.filter(i => i.severity === 'MEDIUM');
    
    if (critical.length > 0) {
      console.log('🚨 CRITICAL ISSUES:');
      critical.forEach(issue => this.printIssue(issue));
      console.log();
    }
    
    if (high.length > 0) {
      console.log('⚠️  HIGH SEVERITY ISSUES:');
      high.forEach(issue => this.printIssue(issue));
      console.log();
    }
    
    if (medium.length > 0) {
      console.log('⚡ MEDIUM SEVERITY ISSUES:');
      medium.forEach(issue => this.printIssue(issue));
      console.log();
    }
    
    // Security recommendations
    console.log('🛡️  SECURITY RECOMMENDATIONS:');
    console.log('   1. Use secureLog utility for all logging');
    console.log('   2. Never log passwords, tokens, or sensitive data');
    console.log('   3. Use environment variables for secrets');
    console.log('   4. Validate all user inputs');
    console.log('   5. Use HTTPS in production');
    console.log('   6. Implement proper error handling\n');
    
    // Exit with error code if critical issues found
    if (critical.length > 0) {
      console.log('❌ Critical security issues found! Please fix before deployment.\n');
      process.exit(1);
    }
  }

  /**
   * Print individual security issue
   */
  printIssue(issue) {
    console.log(`   ${issue.type} in ${issue.file}:${issue.line}`);
    console.log(`   Code: ${issue.code}`);
    console.log();
  }
}

// Run security audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new SecurityAuditor();
  auditor.audit(process.argv[2] || '.')
    .catch(error => {
      console.error('❌ Security audit failed:', error);
      process.exit(1);
    });
}

export default SecurityAuditor;
