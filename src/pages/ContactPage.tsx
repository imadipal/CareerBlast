import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle, Briefcase } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactForm = z.infer<typeof contactSchema>;

export const ContactPage: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsLoading(true);
    try {
      // Mock form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Contact form submitted:', data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us an email and we\'ll respond within 24 hours',
      contact: 'hello@careerblast.com',
      action: 'mailto:hello@careerblast.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our team during business hours',
      contact: '+91 80 1234 5678',
      action: 'tel:+918012345678',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Come visit our office in the heart of Bangalore',
      contact: 'Koramangala, Bangalore, India',
      action: '#',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      description: 'We\'re here to help during these hours',
      contact: 'Mon-Fri: 9AM-6PM IST',
      action: '#',
    },
  ];

  const faqs = [
    {
      icon: HelpCircle,
      title: 'General Support',
      description: 'Questions about using CareerBlast, account issues, or general inquiries',
    },
    {
      icon: Briefcase,
      title: 'For Employers',
      description: 'Help with job posting, candidate management, or employer features',
    },
    {
      icon: MessageCircle,
      title: 'Technical Issues',
      description: 'Report bugs, technical problems, or feature requests',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Have questions, feedback, or need help? We'd love to hear from you.
            Our team is here to assist you with anything you need.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Your full name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="your.email@example.com"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                  </div>

                  <Input
                    label="Subject"
                    placeholder="What is this regarding?"
                    error={errors.subject?.message}
                    {...register('subject')}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      rows={6}
                      placeholder="Tell us more about your inquiry..."
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{info.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{info.description}</p>
                      {info.action.startsWith('#') ? (
                        <p className="text-sm font-medium text-gray-900">{info.contact}</p>
                      ) : (
                        <a
                          href={info.action}
                          className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          {info.contact}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What can we help you with?
              </h3>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.title} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <faq.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{faq.title}</h4>
                      <p className="text-xs text-gray-600">{faq.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-primary-50 border-primary-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Check out our FAQ section or browse our help documentation for quick answers.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  View FAQ
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Help Documentation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
