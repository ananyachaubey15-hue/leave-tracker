import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const { loginWithGoogle, continueAsGuest } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-r from-[#C9A4C4] via-[#B48FB9] to-[#1F1C2C] p-6">

      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-10">

        {/* LEFT GLASS CARD */}
        <div className="
          w-full md:w-1/2 
          bg-white/20 backdrop-blur-xl 
          border border-white/30 
          rounded-3xl p-10 
          shadow-[0_20px_60px_rgba(0,0,0,0.4)]
        ">

          <h2 className="text-3xl font-semibold text-white mb-8">
            Welcome to Leave Tracker
          </h2>

          <div className="space-y-6">

            <button
              onClick={loginWithGoogle}
              className="
                w-full py-3 rounded-xl 
                bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] 
                text-white font-semibold 
                shadow-lg hover:scale-[1.02] 
                transition-all duration-300
              "
            >
              Sign in with Google
            </button>

            <button
              onClick={continueAsGuest}
              className="
                w-full py-3 rounded-xl 
                bg-white/30 text-white 
                border border-white/40
                hover:bg-white/40 
                transition-all duration-300
              "
            >
              Continue as Guest
            </button>

          </div>

          <p className="text-white/70 mt-8 text-sm">
            Calm. Organized. In Control.
          </p>
        </div>

        {/* RIGHT IMAGE PANEL */}
        <div className="w-full md:w-1/2 flex justify-center">

          <div className="
            rounded-3xl overflow-hidden 
            shadow-[0_30px_80px_rgba(0,0,0,0.6)]
            transform hover:scale-[1.02]
            transition-all duration-500
          ">
            <img
              src="/chonky.jpg"
              alt="Sleeping Cat"
              className="w-[450px] h-[450px] object-cover"
            />
          </div>

        </div>

      </div>
    </div>
  );
}