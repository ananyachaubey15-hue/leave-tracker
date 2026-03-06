function BottomNav() {
  const path = window.location.pathname;

  const navItem = (label: string, route: string) => {
    const isActive = path === route;

    return (
      <button
        onClick={() => (window.location.href = route)}
        className={`flex-1 py-4 text-xs font-medium transition ${
          isActive
            ? "text-[#7A4F3A]"
            : "text-gray-400 hover:text-[#7A4F3A]"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      {/* Floating Add Button */}
      <button
        onClick={() => (window.location.href = "/add-leave")}
        className="
          fixed bottom-20 left-1/2 -translate-x-1/2
          w-16 h-16 rounded-full
          bg-[#7A4F3A] text-white text-3xl
          shadow-[0_10px_25px_rgba(0,0,0,0.15)]
          flex items-center justify-center
          transition transform hover:scale-110 active:scale-95
          z-50
        "
      >
        +
      </button>

      {/* Bottom Navigation Bar */}
      <div className="
        fixed bottom-0 left-0 right-0
        bg-white
        border-t border-[#E8E2DD]
        shadow-[0_-5px_20px_rgba(0,0,0,0.05)]
      ">
        <div className="max-w-md mx-auto flex">
          {navItem("Dashboard", "/dashboard")}
          {navItem("History", "/history")}
          {navItem("Calendar", "/calendar")}
        </div>
      </div>
    </>
  );
}

export default BottomNav;