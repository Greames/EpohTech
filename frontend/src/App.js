import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import AuthCallback from "@/components/AuthCallback";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ApproachPage from "@/pages/ApproachPage";
import PortfolioPage from "@/pages/PortfolioPage";
import FoundersPage from "@/pages/FoundersPage";
import InvestorsPage from "@/pages/InvestorsPage";
import TeamPage from "@/pages/TeamPage";
import InsightsPage from "@/pages/InsightsPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import DisclaimerPage from "@/pages/DisclaimerPage";
import EpohLayout from "@/components/EpohLayout";
import EpohHomePage from "@/pages/EpohHomePage";
import EpohServicesPage from "@/pages/EpohServicesPage";
import EpohProgramsPage from "@/pages/EpohProgramsPage";
import EpohAboutPage from "@/pages/EpohAboutPage";
import EpohContactPage from "@/pages/EpohContactPage";
import AccountPage from "@/pages/AccountPage";
import AdminPage from "@/pages/AdminPage";
import OpportunitiesPage from "@/pages/OpportunitiesPage";
import FounderPortalPage from "@/pages/FounderPortalPage";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

function AppRouter() {
  const location = useLocation();
  // Detect session_id synchronously during render to avoid auth race conditions
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/approach" element={<ApproachPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/founders" element={<FoundersPage />} />
      <Route path="/build" element={<Navigate to="/founders" replace />} />
      <Route path="/investors" element={<InvestorsPage />} />
      <Route path="/team" element={<TeamPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />
      <Route path="/epohtech" element={<EpohLayout />}>
        <Route index element={<EpohHomePage />} />
        <Route path="services" element={<EpohServicesPage />} />
        <Route path="programs" element={<EpohProgramsPage />} />
        <Route path="about" element={<EpohAboutPage />} />
        <Route path="contact" element={<EpohContactPage />} />
      </Route>
      <Route path="/account" element={<AccountPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/opportunities" element={<OpportunitiesPage />} />
      <Route path="/my-venture" element={<FounderPortalPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

function SiteChrome() {
  const { pathname } = useLocation();
  const isEpoh = pathname.startsWith("/epohtech");
  return (
    <>
      {!isEpoh && <HeaderNav />}
      {!isEpoh && <WhatsAppButton />}
      <main>
        <AppRouter />
      </main>
      {!isEpoh && <Footer />}
    </>
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let rafId;
    const loop = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <div className="grain-overlay" aria-hidden="true" />
          <SiteChrome />
          <Toaster theme="dark" position="top-center" richColors />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
