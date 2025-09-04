import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { DataProvider } from './contexts/DataContext';
import { MatchingProvider } from './contexts/MatchingContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';
import { HomePage } from './pages/HomePage';
import { JobsPage } from './pages/JobsPage';
import { LoginPage } from './pages/LoginPage';
// import { SignupPage } from './pages/SignupPage'; // Using EnhancedSignupPage instead
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { EmployerDashboardPage } from './pages/EmployerDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { RecommendedJobsPage } from './pages/RecommendedJobsPage';
import { SmartJobsPage } from './pages/SmartJobsPage';
import TeamManagementPage from './pages/TeamManagementPage';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
import RecruiterApplicationPage from './pages/RecruiterApplicationPage';
import AdminRecruiterManagementPage from './pages/AdminRecruiterManagementPage';
import EnhancedSignupPage from './pages/EnhancedSignupPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import SubscriptionSuccessPage from './pages/SubscriptionSuccessPage';
import SubscriptionManagePage from './pages/SubscriptionManagePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RoutingTestPage } from './pages/RoutingTestPage';
import ResumePage from './pages/ResumePage';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <DataProvider>
            <MatchingProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route
                    path="/login"
                    element={
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <PublicRoute>
                        <EnhancedSignupPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <PublicRoute>
                        <ForgotPasswordPage />
                      </PublicRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute requiredRole="candidate">
                        <CandidateProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/resume"
                    element={
                      <ProtectedRoute requiredRole="candidate">
                        <ResumePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/welcome"
                    element={
                      <ProtectedRoute requiredRole="candidate">
                        <WelcomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employer/dashboard"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <EmployerDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/about" element={<AboutPage />} />
                  <Route
                    path="/recommended-jobs"
                    element={
                      <ProtectedRoute requiredRole="candidate">
                        <RecommendedJobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/smart-jobs"
                    element={
                      <ProtectedRoute requiredRole="candidate">
                        <SmartJobsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/routing-test" element={<RoutingTestPage />} />
                  <Route
                    path="/pricing"
                    element={
                      <ProtectedRoute requiredRole="employer" requireApproval={true}>
                        <PricingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <TeamManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/invite/accept" element={<AcceptInvitationPage />} />
                  <Route path="/recruiter/apply" element={<RecruiterApplicationPage />} />
                  <Route
                    path="/admin/recruiters"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <AdminRecruiterManagementPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription/payment"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription/success"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <SubscriptionSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscription/manage"
                    element={
                      <ProtectedRoute requiredRole="employer">
                        <SubscriptionManagePage />
                      </ProtectedRoute>
                    }
                  />
                  {/* Catch-all route for 404 pages */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </MatchingProvider>
          </DataProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
