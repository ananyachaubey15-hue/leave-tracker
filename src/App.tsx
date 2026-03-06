import Dashboard from "./screens/Dashboard";
import AddLeave from "./screens/AddLeave";
import History from "./screens/History";
import CalendarView from "./screens/CalendarView";
import OfflineBanner from "./components/OfflineBanner";
import SplashScreen from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";   // 👈 HERE
import { useAuth } from "./context/AuthContext";
import Welcome from "./screens/Welcome";

function App() {
  const { mode } = useAuth();
  const path = window.location.pathname;

  // 🔄 Show splash while checking auth
  if (mode === "loading") {
    return <SplashScreen />;
  }

  // 👤 Guest mode
 if (mode === "guest") {
  return <Welcome />;
}

  // 🔐 Logged in → show main app
  let Screen;

  if (path === "/dashboard") Screen = <Dashboard />;
  else if (path === "/add-leave") Screen = <AddLeave />;
  else if (path === "/history") Screen = <History />;
  else if (path === "/calendar") Screen = <CalendarView />;
  else Screen = <Dashboard />;

return (
  <>
    <OfflineBanner />
    <div className="pb-16">
      {Screen}
    </div>
    <BottomNav />
  </>
);
}

export default App;