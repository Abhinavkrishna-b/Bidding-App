
import { Clock3, CheckCircle2 } from "lucide-react";

export default function AuctionStatus({ timeRemaining, isEnded }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
        isEnded
          ? "border-slate-200 bg-slate-100 text-slate-600"
          : "border-indigo-100 bg-indigo-50 text-indigo-700"
      }`}
    >
      {isEnded ? (
        <CheckCircle2 size={17} />
      ) : (
        <Clock3 size={17} />
      )}

      <span className="font-medium">
        {isEnded
          ? "Auction ended"
          : timeRemaining?.text
            ? `Time remaining: ${timeRemaining.text}`
            : "End time unavailable"}
      </span>
    </div>
  );
}
