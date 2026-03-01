import { useEffect } from "react";

type Props = {
  onFinish: () => void;
};

function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1500); // ⏱️ 1.5 sec cozy pause

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        height: "100vh",
        background: "#0f172a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* 🐱 sleepy cat logo */}
      <img
        src="/pwa-512.png"
        alt="Sleepy Cat"
        style={{
          width: 120,
          height: 120,
          borderRadius: 24,
        }}
      />

      <div
        style={{
          color: "#e5e7eb",
          fontSize: 18,
          opacity: 0.8,
        }}
      >
        LeaveApp waking up…
      </div>
    </div>
  );
}

export default SplashScreen;