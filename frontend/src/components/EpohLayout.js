import { Outlet } from "react-router-dom";
import EpohNav from "@/components/EpohNav";
import EpohFooter from "@/components/EpohFooter";

export default function EpohLayout() {
  return (
    <div data-testid="epoh-layout">
      <EpohNav />
      <Outlet />
      <EpohFooter />
    </div>
  );
}
