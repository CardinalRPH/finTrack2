
import { redirect } from "next/navigation";
import Link from "next/link";
import { HiArrowRight, HiShieldCheck, HiOutlineSparkles } from "react-icons/hi2";
import { GiGoldBar } from "react-icons/gi";
import { FaDiscord } from "react-icons/fa";
import { AuthButton } from "./components/AuthButton";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();

  // If already logged in, send them to the internal dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GiGoldBar className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter">FinTrack</span>
        </div>
        <AuthButton />
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/20 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm mb-8">
            <HiOutlineSparkles className="text-indigo-400" />
            <span className="text-slate-400">Now with Real-time Gold tracking</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Track your <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Wealth</span>, <br />
            not just your wallet.
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            FinTrack combines your Cash, E-Wallets, and Gold assets into one seamless interface. 
            The most powerful way to visualize your financial growth in Rupiah.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/api/auth/signin" 
              className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all transform hover:-translate-y-1"
            >
              <FaDiscord className="w-5 h-5" />
              Get Started with Discord
            </Link>
            <button className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 border border-slate-800 rounded-2xl font-bold hover:bg-slate-800 transition-all">
              See Demo
              <HiArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={<HiShieldCheck className="w-8 h-8 text-indigo-400" />}
            title="Private & Secure"
            description="Your financial data is yours alone. Authenticated securely via Discord."
          />
          <FeatureCard 
            icon={<GiGoldBar className="w-8 h-8 text-yellow-500" />}
            title="Gold Portfolio"
            description="Track your physical gold in grams and see its real-time value in IDR automatically."
          />
          <FeatureCard 
            icon={<HiOutlineSparkles className="w-8 h-8 text-cyan-400" />}
            title="Multi-Wallet"
            description="Manage Bank, QRIS, and Cash in one place with simple transfer tracking."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-12 text-slate-600 text-sm border-t border-slate-900">
        © 2026 FinTrack. Built for those who build wealth.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="space-y-4 group">
      <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center transition-all group-hover:border-indigo-500/50 group-hover:bg-slate-800">
        {icon}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}