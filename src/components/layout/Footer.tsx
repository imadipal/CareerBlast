import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Jobs by Location',
      links: [
        { label: 'Jobs in Bangalore', href: '/jobs?location=bangalore' },
        { label: 'Jobs in Delhi / NCR', href: '/jobs?location=delhi' },
        { label: 'Jobs in Hyderabad', href: '/jobs?location=hyderabad' },
        { label: 'Jobs in Mumbai', href: '/jobs?location=mumbai' },
      ],
    },
    {
      title: 'Jobs by Function',
      links: [
        { label: 'Software Engineering Jobs', href: '/jobs?function=engineering' },
        { label: 'Marketing Jobs', href: '/jobs?function=marketing' },
        { label: 'Sales Jobs', href: '/jobs?function=sales' },
        { label: 'Internship Jobs', href: '/jobs?type=internship' },
      ],
    },
    {
      title: 'For Employers',
      links: [
        { label: 'Post Your Jobs', href: '/employer/dashboard' },
        { label: 'Success Stories', href: '/success-stories' },
        { label: 'Resources', href: '/resources' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'MyNexJob',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dots-subtle opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-glow">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">MyNexJob</span>
            </Link>
            <p className="text-gray-300 text-base mb-8 leading-relaxed">
              Your dream job awaits. Connect with top companies and find opportunities that match your skills and aspirations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm hover:translate-x-1 transform duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700/50 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © {currentYear} MyNexJob. All rights reserved. Made with ❤️ for job seekers.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors hover:underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors hover:underline">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white text-sm transition-colors hover:underline">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
