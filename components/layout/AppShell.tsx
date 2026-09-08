"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { ModuleRail } from "./ModuleRail";
import { BottomTabBar } from "./BottomTabBar";
import { MailList } from "@/components/mail/MailList";
import { ReadingPane } from "@/components/mail/ReadingPane";
import { CustomizerPanel } from "@/components/customizer/CustomizerPanel";
import { ComposeModal } from "@/components/compose/ComposeModal";
import { ProductTour } from "@/components/tour/ProductTour";
import { GlobalBanner, type GlobalBannerTone } from "@/components/banner/GlobalBanner";
import { SessionExpiryPopover } from "@/components/overlay/SessionExpiryPopover";
import { useTheme } from "@/context/theme-context";
import { useMail } from "@/context/mail-context";
import { useToast } from "@/context/toast-context";

// Top-level shell for the main mail view ("/"): three-pane layout (folder
// sidebar, mail list, reading pane) plus everything that only lives on this
// page — the theme customizer, compose modal, product tour, and a simulated
// session-expiry countdown. Other routes render their own simpler layouts
// and don't use this component.
type MobileNav = "folders" | "list";

const SESSION_KEY = "gxmail:session-expires-at";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
const SESSION_WARNING_MS = 5 * 60 * 1000;
const DELEGATE_ACCOUNT = "한지우";

export function AppShell() {
  const t = useTranslations("appShell");
  const router = useRouter();
  const { draft } = useTheme();
  const { selectedEmailId, clearSelection } = useMail();
  const toast = useToast();
  const [mobileNav, setMobileNav] = useState<MobileNav>("list");
  const [showTour, setShowTour] = useState(false);
  const [showMaintenance, setShowMaintenance] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [delegateActive, setDelegateActive] = useState(false);
  const [sessionMinutesLeft, setSessionMinutesLeft] = useState<number | null>(null);

  // On mobile there's only room for one pane at a time. Selecting an email
  // always shows the reading pane, regardless of which nav tab was active,
  // so `mobileNav` alone isn't enough to know what to render.
  const mobileView = selectedEmailId ? "reading" : mobileNav;
  const sidebarFirst = draft.sidebarPosition === "left";

  const logout = () => {
    try {
      window.localStorage.removeItem("gxmail:session");
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // storage unavailable; navigate anyway
    }
    router.push("/login");
  };

  const extendSession = () => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, String(Date.now() + SESSION_DURATION_MS));
    } catch {
      // storage unavailable; session simply won't persist across reloads
    }
    setSessionMinutesLeft(null);
  };

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Simulated session-expiry countdown: there's no real backend session, so
  // this just tracks a timestamp in sessionStorage and logs the user out
  // client-side once it elapses, warning a few minutes beforehand.
  useEffect(() => {
    let expiresAt: number;
    try {
      const stored = window.sessionStorage.getItem(SESSION_KEY);
      expiresAt = stored ? Number(stored) : Date.now() + SESSION_DURATION_MS;
      window.sessionStorage.setItem(SESSION_KEY, String(expiresAt));
    } catch {
      expiresAt = Date.now() + SESSION_DURATION_MS;
    }

    const tick = () => {
      const msLeft = expiresAt - Date.now();
      if (msLeft <= 0) {
        logout();
        return;
      }
      setSessionMinutesLeft(msLeft <= SESSION_WARNING_MS ? Math.max(1, Math.ceil(msLeft / 60000)) : null);
    };

    tick();
    const interval = setInterval(tick, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only one global banner shows at a time; offline takes priority over the
  // scheduled-maintenance notice, which takes priority over the delegate banner.
  const bannerTone: GlobalBannerTone | null = !isOnline
    ? "offline"
    : showMaintenance
      ? "maintenance"
      : delegateActive
        ? "delegate"
        : null;

  return (
    <div className="flex h-dvh overflow-hidden bg-(--surface-app) text-(--text-app)">
      <div className="hidden lg:block">
        <ModuleRail />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {bannerTone === "offline" && (
          <GlobalBanner
            tone="offline"
            message={t("offline")}
            actionLabel={t("reconnect")}
            onAction={() => setIsOnline(navigator.onLine)}
          />
        )}
        {bannerTone === "maintenance" && (
          <GlobalBanner
            tone="maintenance"
            message={t("maintenanceNotice")}
            actionLabel={t("maintenanceDetails")}
            onAction={() => toast.info(t("maintenanceDetailsBody"))}
            onDismiss={() => setShowMaintenance(false)}
          />
        )}
        {bannerTone === "delegate" && (
          <GlobalBanner
            tone="delegate"
            message={t("delegateActive", { name: DELEGATE_ACCOUNT })}
            actionLabel={t("delegateEnd")}
            onAction={() => {
              setDelegateActive(false);
              toast.info(t("delegateEnded"));
            }}
          />
        )}
        <TopBar
          onMenuClick={() => setMobileNav("folders")}
          onOpenTour={() => setShowTour(true)}
          onToggleDelegate={
            delegateActive
              ? undefined
              : () => {
                  setDelegateActive(true);
                  toast.info(t("delegateStarted", { name: DELEGATE_ACCOUNT }));
                }
          }
        />

        <div className="flex min-h-0 flex-1 flex-row-reverse lg:flex-row">
          <div
            className={`h-full w-full shrink-0 lg:w-64 ${
              mobileView === "folders" ? "block" : "hidden"
            } lg:block ${sidebarFirst ? "lg:order-1" : "lg:order-3"}`}
          >
            <Sidebar onNavigate={() => setMobileNav("list")} />
          </div>

          <div
            className={`h-full w-full shrink-0 lg:order-2 lg:w-[360px] ${
              mobileView === "list" ? "block" : "hidden"
            } lg:block`}
          >
            <MailList />
          </div>

          <div
            className={`h-full min-w-0 flex-1 lg:order-2 ${
              mobileView === "reading" ? "block" : "hidden"
            } lg:block`}
          >
            <ReadingPane
              onBack={() => {
                clearSelection();
                setMobileNav("list");
              }}
            />
          </div>
        </div>

        {mobileView !== "reading" && <BottomTabBar />}
      </div>

      <CustomizerPanel />
      <ComposeModal />
      {showTour && <ProductTour onClose={() => setShowTour(false)} />}
      {sessionMinutesLeft !== null && (
        <SessionExpiryPopover minutesLeft={sessionMinutesLeft} onLogout={logout} onExtend={extendSession} />
      )}
    </div>
  );
}
