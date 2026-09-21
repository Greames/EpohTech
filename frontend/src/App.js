import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import AuthCallback from "@/components/AuthCallback";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import HomePage from "@/pages/HomePage";
import BuildPage from "@/pages/BuildPage";
import InvestorsPage from "@/pages/InvestorsPage";
import SupportPage from "@/pages/SupportPage";
import EpohTechPage from "@/pages/EpohTechPage";
import StoryPage from "@/pages/StoryPage";
import InsightsPage from "@/pages/InsightsPage";
import ContactPage from "@/pages/ContactPage";
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
      <Route path="/build" element={<BuildPage />} />
      <Route path="/investors" element={<InvestorsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/epohtech" element={<EpohTechPage />} />
      <Route path="/story" element={<StoryPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/opportunities" element={<OpportunitiesPage />} />
      <Route path="/my-venture" element={<FounderPortalPage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
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
          <HeaderNav />
          <main>
            <AppRouter />
          </main>
          <Footer />
          <Toaster theme="dark" position="top-center" richColors />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
