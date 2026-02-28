import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      style={{
        background: "#ef4444",
        color: "white",
        padding: "8px 12px",
        textAlign: "center",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      ⚠️ You are offline — showing cached data
    </div>
  );
}