import { useState } from "react";

export default function ConsentBanner() {
  const [accepted, setAccepted] = useState(
    typeof window !== "undefined" && localStorage.getItem("ayurbalance_consent") === "true"
  );

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 flex flex-col md:flex-row items-center justify-between z-50 minimal-shadow">
      <span className="text-sm text-deep-brown">
        By using AyurBalance, you agree to our <a href="/PRIVACY.md" target="_blank" className="underline warm-bg px-1 rounded">Privacy Policy</a>.
      </span>
      <button
        className="ml-4 mt-2 md:mt-0 warm-bg px-4 py-2 rounded"
        onClick={() => {
          localStorage.setItem("ayurbalance_consent", "true");
          setAccepted(true);
        }}
      >
        Accept
      </button>
    </div>
  );
}
