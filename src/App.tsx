import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import AddLeave from "./screens/AddLeave";
import History from "./screens/History";
import CalendarView from "./screens/CalendarView";
import OfflineBanner from "./components/OfflineBanner";

function App() {
  const path = window.location.pathname;

  if (path === "/dashboard") return <Dashboard />;
  if (path === "/add-leave") return <AddLeave />;
  if (path === "/history") return <History />;
  if (path === "/calendar") return <CalendarView />;

  <>
  <OfflineBanner />
  {/* your routes/components */}
</>

  return <Login />;
}

export default App;