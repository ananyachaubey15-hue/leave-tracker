import { useState } from "react";

import Dashboard from "./screens/Dashboard";
import AddLeave from "./screens/AddLeave";
import History from "./screens/History";
import CalendarView from "./screens/CalendarView";
import OfflineBanner from "./components/OfflineBanner";
import SplashScreen from "./components/SplashScreen";

function App() {
  const path = window.location.pathname;
  const [showSplash, setShowSplash] = useState(true);

  // 🐱 Splash first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 🎯 Decide which screen to show
  let Screen;

  if (path === "/dashboard") Screen = <Dashboard />;
  else if (path === "/add-leave") Screen = <AddLeave />;
  else if (path === "/history") Screen = <History />;
  else if (path === "/calendar") Screen = <CalendarView />;
  else Screen = <Dashboard />;

  // ✅ ALWAYS render banner + screen
  return (
    <>
      <OfflineBanner />
      {Screen}
    </>
  );
}

export default App;