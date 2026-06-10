import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { PhysicsIcon } from "../lib/icons";

/* ── Types ─────────────────────────────────────────────────────── */

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
  action?: { label: string; onClick: () => void };
  duration?: number; /* ms — default 4000, 0 = persistent */
}

interface ToastContextValue {
  show: (toast: Omit<Toast, "id">) => string;
  dismiss: (id: string) => void;
  success: (title: string, message?: string, action?: Toast["action"]) => string;
  error:   (title: string, message?: string, action?: Toast["action"]) => string;
  warning: (title: string, message?: string, action?: Toast["action"]) => string;
  info:    (title: string, message?: string, action?: Toast["action"]) => string;
}

/* ── Context ───────────────────────────────────────────────────── */

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/* ── Provider ──────────────────────────────────────────────────── */

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((t: Omit<Toast, "id">): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => {
      /* cap stack at 4 */
      const next = [...prev, { ...t, id }];
      return next.length > 4 ? next.slice(next.length - 4) : next;
    });
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, action?: Toast["action"]) =>
    show({ variant: "success", title, message, action }), [show]);
  const error = useCallback((title: string, message?: string, action?: Toast["action"]) =>
    show({ variant: "error",   title, message, action }), [show]);
  const warning = useCallback((title: string, message?: string, action?: Toast["action"]) =>
    show({ variant: "warning", title, message, action }), [show]);
  const info = useCallback((title: string, message?: string, action?: Toast["action"]) =>
    show({ variant: "info",    title, message, action }), [show]);

  return (
    <ToastContext.Provider value={{ show, dismiss, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/* ── Container ─────────────────────────────────────────────────── */

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null;
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5"
      style={{ maxWidth: 360 }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

/* ── Single Toast ──────────────────────────────────────────────── */

const VARIANT_CONFIG: Record<ToastVariant, {
  border: string;
  icon: string;
  iconColor: string;
  progressColor: string;
  label: string;
}> = {
  success: {
    border:        "border-l-emerald-400",
    icon:          "check",
    iconColor:     "text-emerald-400",
    progressColor: "bg-emerald-400",
    label:         "Success",
  },
  error: {
    border:        "border-l-rose-400",
    icon:          "close",
    iconColor:     "text-rose-400",
    progressColor: "bg-rose-400",
    label:         "Error",
  },
  warning: {
    border:        "border-l-amber-400",
    icon:          "warning",
    iconColor:     "text-amber-400",
    progressColor: "bg-amber-400",
    label:         "Warning",
  },
  info: {
    border:        "border-l-science-500",
    icon:          "info",
    iconColor:     "text-science-400",
    progressColor: "bg-science-500",
    label:         "Info",
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { variant, title, message, action, duration = 4000, id } = toast;
  const cfg = VARIANT_CONFIG[variant];
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef(Date.now());
  const pausedRef = useRef(false);
  const remainingRef = useRef(duration);

  /* Spring entrance */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Auto-dismiss with live progress bar */
  useEffect(() => {
    if (duration === 0) return;
    const tick = 40; /* ms per interval */
    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct <= 0) handleDismiss();
    }, tick);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  const handleDismiss = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onDismiss(id), 300);
  };

  const pause = () => {
    pausedRef.current = true;
    remainingRef.current -= Date.now() - startRef.current;
  };

  const resume = () => {
    pausedRef.current = false;
    startRef.current = Date.now();
  };

  return (
    <div
      role="alert"
      aria-label={`${cfg.label}: ${title}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      style={{
        transform: visible && !exiting ? "translateX(0)" : "translateX(120%)",
        opacity:   visible && !exiting ? 1 : 0,
        transition: exiting
          ? "transform 280ms cubic-bezier(0.4, 0, 1, 1), opacity 280ms ease"
          : "transform 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease",
      }}
      className={`
        relative w-[340px] overflow-hidden rounded-xl border border-l-4
        ${cfg.border}
        backdrop-blur-xl
        border-white/[0.08]
        bg-[rgb(8_17_31/0.92)]
        shadow-[0_20px_56px_rgb(2_6_13/0.70),0_0_0_1px_rgb(255_255_255/0.04)]
      `}
    >
      {/* Specular top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />

      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        <span className={`mt-0.5 shrink-0 ${cfg.iconColor}`}>
          <PhysicsIcon name={cfg.icon as never} className="h-4 w-4" />
        </span>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold leading-tight text-space-50">{title}</p>
          {message && (
            <p className="mt-0.5 text-xs font-medium leading-relaxed text-space-200">{message}</p>
          )}
          {action && (
            <button
              onClick={() => { action.onClick(); handleDismiss(); }}
              className={`mt-2 text-xs font-black ${cfg.iconColor} underline-offset-2 hover:underline`}
            >
              {action.label}
            </button>
          )}
        </div>

        {/* Dismiss */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="mt-0.5 shrink-0 rounded p-0.5 text-space-300 transition-colors hover:text-space-50"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-[2px] w-full bg-white/[0.06]">
          <div
            className={`h-full ${cfg.progressColor} transition-none`}
            style={{ width: `${progress}%`, opacity: 0.7 }}
          />
        </div>
      )}
    </div>
  );
}
