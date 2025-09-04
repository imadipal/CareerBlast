import React from 'react';
import { Users, Target, Award, Heart, Briefcase, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui';

export const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe everyone deserves to find meaningful work that aligns with their skills and aspirations.',
    },
    {
      icon: Users,
      title: 'People-First',
      description: 'Our platform puts candidates and employers at the center, creating genuine connections.',
    },
    {
      icon: Award,
      title: 'Quality Focus',
      description: 'We curate opportunities and candidates to ensure the highest quality matches.',
    },
    {
      icon: Heart,
      title: 'Passionate',
      description: 'We are passionate about transforming the way people find and hire talent.',
    },
  ];

  const stats = [
    { label: 'Active Jobs', value: '10,000+' },
    { label: 'Companies', value: '2,500+' },
    { label: 'Successful Hires', value: '50,000+' },
    { label: 'Countries', value: '15+' },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://via.placeholder.com/150x150?text=SJ',
      bio: 'Former VP of Engineering at TechCorp with 15+ years in talent acquisition.',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://via.placeholder.com/150x150?text=MC',
      bio: 'Ex-Google engineer passionate about building scalable recruitment platforms.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      image: 'https://via.placeholder.com/150x150?text=ER',
      bio: 'Product leader with expertise in user experience and marketplace dynamics.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About CareerBlast
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to revolutionize how talented professionals connect with
            amazing opportunities. Our platform bridges the gap between exceptional
            candidates and forward-thinking companies.
          </p>
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  CareerBlast was born from a simple observation: the traditional job search
                  process was broken. Talented professionals were struggling to find roles
                  that matched their skills and aspirations, while companies were having
                  difficulty finding the right candidates.
                </p>
                <p>
                  Founded in 2020 by a team of former recruiters and engineers, we set out
                  to create a platform that would change this dynamic. We believed that
                  technology could make the hiring process more efficient, transparent,
                  and human.
                </p>
                <p>
                  Today, CareerBlast connects thousands of professionals with their dream
                  jobs every month, helping companies build amazing teams and individuals
                  advance their careers.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape how we build our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a diverse team of passionate individuals committed to transforming
              the future of work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card key={member.name} className="text-center p-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of professionals who have found their dream jobs through CareerBlast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Get Started Today
            </a>
            <a
              href="/jobs"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Browse Jobs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
