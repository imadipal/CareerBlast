import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Mail } from 'lucide-react';
import { Card } from '../components/ui';

export const TermsPage: React.FC = () => {
  const lastUpdated = 'January 15, 2024';

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: FileText,
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing and using CareerBlast, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.',
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. Your continued use of the platform after any such changes constitutes your acceptance of the new terms.',
        },
      ],
    },
    {
      id: 'user-accounts',
      title: 'User Accounts and Responsibilities',
      icon: Users,
      content: [
        {
          subtitle: 'Account Creation',
          text: 'You must provide accurate, current, and complete information during registration and keep your account information updated. You are responsible for safeguarding your password and all activities under your account.',
        },
        {
          subtitle: 'Prohibited Uses',
          text: 'You may not use our platform for any unlawful purpose, to transmit harmful content, to impersonate others, or to interfere with the platform\'s operation. Violation of these terms may result in account termination.',
        },
        {
          subtitle: 'Content Responsibility',
          text: 'You are solely responsible for the content you post, including job listings, profiles, and communications. You warrant that your content does not violate any laws or third-party rights.',
        },
      ],
    },
    {
      id: 'platform-services',
      title: 'Platform Services',
      icon: Shield,
      content: [
        {
          subtitle: 'Service Description',
          text: 'CareerBlast provides a platform connecting job seekers with employers. We facilitate introductions but do not guarantee employment outcomes or the accuracy of user-provided information.',
        },
        {
          subtitle: 'Service Availability',
          text: 'We strive to maintain platform availability but do not guarantee uninterrupted service. We may modify, suspend, or discontinue services at any time with or without notice.',
        },
        {
          subtitle: 'Third-Party Services',
          text: 'Our platform may integrate with third-party services. We are not responsible for the availability, accuracy, or content of such external services.',
        },
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Scale,
      content: [
        {
          subtitle: 'Platform Content',
          text: 'All content on CareerBlast, including text, graphics, logos, and software, is our property or licensed to us and is protected by copyright and other intellectual property laws.',
        },
        {
          subtitle: 'User Content License',
          text: 'By posting content on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content in connection with our services.',
        },
        {
          subtitle: 'Respect for IP Rights',
          text: 'You must respect the intellectual property rights of others. We will respond to valid copyright infringement notices in accordance with applicable law.',
        },
      ],
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      icon: AlertTriangle,
      content: [
        {
          subtitle: 'Service Disclaimer',
          text: 'Our platform is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.',
        },
        {
          subtitle: 'Limitation of Liability',
          text: 'To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our platform.',
        },
        {
          subtitle: 'User Interactions',
          text: 'We are not responsible for the conduct of users or the accuracy of information they provide. You interact with other users at your own risk.',
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Please read these terms carefully before using our platform.
            By using CareerBlast, you agree to these terms.
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
              Welcome to CareerBlast. These Terms and Conditions ("Terms") govern your
              use of our website and services. CareerBlast is a platform that connects
              job seekers with employers and provides related career services. By accessing
              or using our platform, you agree to be bound by these Terms.
            </p>
          </div>
        </Card>

        {/* Terms Sections */}
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

        {/* Additional Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Privacy and Data Protection
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your privacy is important to us. Our collection and use of personal
              information is governed by our Privacy Policy, which is incorporated
              into these Terms by reference. Please review our Privacy Policy to
              understand our practices.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Governing Law
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              These Terms shall be governed by and construed in accordance with the
              laws of India. Any disputes arising under these Terms shall be subject
              to the exclusive jurisdiction of the courts in Bangalore, India.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Termination
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may terminate or suspend your account and access to our services
              immediately, without prior notice, for any reason, including breach
              of these Terms. Upon termination, your right to use our platform
              will cease immediately.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Severability
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid,
              that provision will be limited or eliminated to the minimum extent
              necessary so that these Terms will otherwise remain in full force and effect.
            </p>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="p-8 mt-12 bg-primary-50 border-primary-200">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-primary-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">
              Questions About These Terms?
            </h3>
          </div>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p><strong>Email:</strong> legal@careerblast.com</p>
            <p><strong>Address:</strong> CareerBlast Legal Team, Koramangala, Bangalore, India</p>
            <p><strong>Phone:</strong> +91 80 1234 5678</p>
          </div>
        </Card>
      </div>
    </div>
  );
};
