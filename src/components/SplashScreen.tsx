export default function SplashScreen() {
  return (
    <div
      style={{
        height: "100vh",
        background: "#F4F1EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}
    >
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
          color: "#7A4F3A",
          fontSize: 18,
          opacity: 0.8,
        }}
      >
        Waking up Leave Tracker…
      </div>
    </div>
  );
}