import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export default function NoticeToast({ message, onClose }) {
  useEffect(() => {
    if (!message) return;

    const timeoutId = setTimeout(onClose, 3500);

    return () => clearTimeout(timeoutId);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed right-4 top-20 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
    >
      <CheckCircle2
        size={20}
        className="mt-0.5 shrink-0 text-emerald-600"
      />

      <p className="flex-1 text-sm leading-5 text-slate-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss notification"
        className="text-slate-400 hover:text-slate-700"
      >
        <X size={17} />
      </button>
    </div>
  );
}