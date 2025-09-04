import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Search, Users, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMatching } from '../contexts/MatchingContext';
import { ProfileCompletionBanner } from '../components/profile/ProfileCompletionBanner';
import { JobMatchCard } from '../components/jobs/JobMatchCard';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { topMatches, fetchTopMatches, enableMatching } = useMatching();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'candidate') {
      fetchTopMatches(3);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-grid-subtle"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-brand-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-blue-200/20 rounded-full blur-xl"></div>

        <div className="relative py-20 sm:py-28 lg:py-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/20 text-sm font-medium text-brand-700 mb-8 shadow-soft">
                🚀 Join 50,000+ professionals finding their dream jobs
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 text-balance">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Find Your Dream Job with{' '}
                </span>
                <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
                  MyNexJob
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-600 mb-12 text-balance max-w-3xl mx-auto leading-relaxed">
                Connect with top companies, showcase your skills, and land your perfect role.
                Get <span className="font-semibold text-brand-600">5x higher response rates</span> with our AI-powered matching.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto shadow-glow hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/60 backdrop-blur-sm border-white/30 hover:bg-white/80">
                    Browse Jobs
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free forever plan
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personalized Section for Authenticated Users */}
      {isAuthenticated && user?.role === 'candidate' && (
        <section className="py-16 bg-gradient-to-br from-brand-50/50 to-purple-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Profile completion banner */}
            <div className="mb-8">
              <ProfileCompletionBanner
                completionPercentage={75} // This would come from user profile data
                isMatchingEnabled={false} // This would come from user profile data
                onEnableMatching={enableMatching}
              />
            </div>

            {/* Top matches */}
            {topMatches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl shadow-glow">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Your Top Matches</h2>
                      <p className="text-gray-600">Jobs perfectly tailored to your profile</p>
                    </div>
                  </div>
                  <Link to="/recommended-jobs">
                    <Button variant="outline" className="flex items-center space-x-2">
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {topMatches.map((jobMatch) => (
                    <JobMatchCard
                      key={jobMatch.job.id}
                      job={jobMatch.job}
                      matchPercentage={jobMatch.matchPercentage}
                      matchExplanation={jobMatch.matchExplanation}
                      salaryMatches={jobMatch.salaryMatches}
                      experienceMatches={jobMatch.experienceMatches}
                      onViewDetails={() => {/* Navigate to job details */}}
                      onApply={() => {/* Navigate to application */}}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Company Logos */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 mb-12 text-base font-medium">
            Trusted by professionals at leading companies worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix'].map((company) => (
              <div key={company} className="group flex items-center justify-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/20 shadow-soft hover:shadow-md transition-all duration-200 hover:scale-105">
                <span className="text-gray-600 font-semibold text-sm group-hover:text-gray-800 transition-colors">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 sm:py-28 lg:py-36 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50"></div>
        <div className="absolute inset-0 bg-dots-subtle"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-100/60 backdrop-blur-sm border border-brand-200/30 text-sm font-medium text-brand-700 mb-6">
              ✨ Why professionals choose us
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Choose MyNexJob?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We've reimagined job searching to be more effective, efficient, and respectful of your privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  5X Higher Response Rate
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI-powered matching algorithm connects you with companies actively looking for your skills,
                  resulting in significantly higher response rates than traditional job boards.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Curated Job Matches
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Skip the endless scrolling. We deliver personalized job recommendations
                  that perfectly match your skills, experience, and career aspirations.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-soft hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Complete Privacy Control
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your job search stays completely confidential. Control who can see your profile
                  and maintain privacy while exploring new opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <blockquote className="text-lg text-gray-700 mb-6">
                "It was a really cool experience with CareerBlast. It was very simple and clean without the bugging from job consultants. Keep up the good work guys!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-900">Tushar</p>
                  <p className="text-gray-600">Hired by Paytm as Senior Engineering Manager</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <blockquote className="text-lg text-gray-700 mb-6">
                "Little did I know about the reach of MyNexJob. They have hundreds of start-ups searching for candidates. I received a good number of offers!"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <p className="font-semibold text-gray-900">Pravesh</p>
                  <p className="text-gray-600">Hired by Wooplr as Software Developer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg">
                Your Dream Job →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
