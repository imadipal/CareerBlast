import React from 'react';
import { Shield, Eye, Lock, Users, FileText, Mail } from 'lucide-react';
import { Card } from '../components/ui';

export const PrivacyPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FileText,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, apply for jobs, post job listings, or contact us. This may include your name, email address, phone number, resume, work history, education, and other professional information.',
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect certain information about your use of our platform, including your IP address, browser type, operating system, referring URLs, access times, and pages viewed.',
        },
        {
          subtitle: 'Cookies and Tracking',
          text: 'We use cookies and similar tracking technologies to collect information about your browsing activities and to provide personalized experiences.',
        },
      ],
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        {
          subtitle: 'Platform Services',
          text: 'We use your information to provide, maintain, and improve our services, including matching candidates with job opportunities and helping employers find qualified candidates.',
        },
        {
          subtitle: 'Communication',
          text: 'We may use your information to send you job alerts, platform updates, promotional materials, and other communications related to our services.',
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage patterns to understand how our platform is used and to improve our services and user experience.',
        },
      ],
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Eye,
      content: [
        {
          subtitle: 'With Employers',
          text: 'When you apply for a job or make your profile visible to employers, we share relevant information from your profile with potential employers.',
        },
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who perform services on our behalf, such as hosting, analytics, and customer support.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law or if we believe such disclosure is necessary to protect our rights or comply with legal processes.',
        },
      ],
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.',
        },
        {
          subtitle: 'Data Encryption',
          text: 'We use industry-standard encryption to protect sensitive information during transmission and storage.',
        },
        {
          subtitle: 'Access Controls',
          text: 'We limit access to your personal information to employees and contractors who need it to perform their job functions.',
        },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: Shield,
      content: [
        {
          subtitle: 'Account Management',
          text: 'You can update, correct, or delete your account information at any time by logging into your account or contacting us.',
        },
        {
          subtitle: 'Privacy Settings',
          text: 'You can control the visibility of your profile and choose whether to receive certain communications from us.',
        },
        {
          subtitle: 'Data Portability',
          text: 'You have the right to request a copy of your personal information in a structured, machine-readable format.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Your privacy is important to us. This policy explains how we collect,
            use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed">
              CareerBlast ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our platform and services. Please read this
              privacy policy carefully. If you do not agree with the terms of this privacy
              policy, please do not access the platform.
            </p>
          </div>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <Card key={section.id} className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                  <section.icon className="w-5 h-5 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Data Retention
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We retain your personal information for as long as necessary to provide
              our services and fulfill the purposes outlined in this policy. When you
              delete your account, we will delete or anonymize your personal information
              within 30 days, except where we are required to retain it by law.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              International Transfers
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your information may be transferred to and processed in countries other
              than your own. We ensure that such transfers are conducted in accordance
              with applicable data protection laws and with appropriate safeguards in place.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Children's Privacy
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our platform is not intended for children under 16 years of age. We do
              not knowingly collect personal information from children under 16. If we
              learn that we have collected such information, we will delete it promptly.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Policy Updates
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update this privacy policy from time to time. We will notify you
              of any changes by posting the new policy on this page and updating the
              "last updated" date. Your continued use of our platform constitutes
              acceptance of the updated policy.
            </p>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="p-8 mt-12 bg-primary-50 border-primary-200">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-primary-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">
              Questions About This Policy?
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or our data practices,
            please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> privacy@careerblast.com</p>
            <p><strong>Address:</strong> CareerBlast Privacy Team, Koramangala, Bangalore, India</p>
            <p><strong>Phone:</strong> +91 80 1234 5678</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
