import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import EpohNav from "@/components/EpohNav";
import EpohFooter from "@/components/EpohFooter";

const DESCRIPTION =
  "EPOHTECH is your IT department, on-demand — data engineering, Oracle ERP & OIC, cloud and day-to-day IT, with consulting support across India and the US.";

const TITLES = {
  "/epohtech": "EPOHTECH — Your IT Department, On-Demand",
  "/epohtech/services": "Services — EPOHTECH",
  "/epohtech/programs": "Internship Program — EPOHTECH",
  "/epohtech/about": "About — EPOHTECH",
  "/epohtech/contact": "Book a Consultation — EPOHTECH",
};

// index.html carries Anvaya Partners' title and description; swap in EPOHTECH's
// while these pages are shown and put the originals back on the way out.
function useEpohDocumentMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const prevTitle = document.title;
    const prevDescription = meta?.getAttribute("content");
    document.title = TITLES[pathname.replace(/\/+$/, "")] || TITLES["/epohtech"];
    meta?.setAttribute("content", DESCRIPTION);
    return () => {
      document.title = prevTitle;
      if (prevDescription != null) meta?.setAttribute("content", prevDescription);
    };
  }, [pathname]);
}

export default function EpohLayout() {
  useEpohDocumentMeta();
  return (
    <div data-testid="epoh-layout">
      <EpohNav />
      <Outlet />
      <EpohFooter />
    </div>
  );
}
