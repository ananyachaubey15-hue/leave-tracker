import Dashboard from "./screens/Dashboard";
import AddLeave from "./screens/AddLeave";
import History from "./screens/History";
import CalendarView from "./screens/CalendarView";
import OfflineBanner from "./components/OfflineBanner";
import SplashScreen from "./components/SplashScreen";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./context/AuthContext";
import Welcome from "./screens/Welcome";

function App() {
  const { user, loading } = useAuth();
  const path = window.location.pathname;

  // 🔄 Show splash while checking auth
  if (loading) {
    return <SplashScreen />;
  }

  // 🔐 Not logged in → show Welcome
  if (!user) {
    return <Welcome />;
  }

  // ✅ Logged in → show app
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