import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import AuthModal from "@/components/AuthModal";
import collegeBuilding from "../assets/college-building.svg";

const HomePage = () => {
  const { currentUser } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full overflow-hidden bg-background">
      
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12 relative">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <i className="fas fa-graduation-cap text-xs"></i>
            <span>Your AI-Powered Academic Companion</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
            Smart Guidance. <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Bright Future.</span>
          </h1>
          
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
            Get instant answers, explore scholarships, check engineering cutoffs, and discover the best colleges — all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
            {currentUser ? (
              <Link href="/chat">
                <Button className="w-full sm:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-1">
                  Start Chatting
                </Button>
              </Link>
            ) : (
              <Button 
                onClick={() => {
                  setIsLogin(false);
                  setAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:-translate-y-1"
              >
                Start Chatting
              </Button>
            )}
            
            <Link href="/engineering-cutoffs">
              <Button 
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 rounded-xl border-2 border-primary/30 text-foreground font-semibold text-lg hover:bg-primary/10 hover:border-primary/50 transition-all"
              >
                Explore Cutoffs
              </Button>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                <i className="fas fa-headset"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">AI Assistant</p>
                <p className="text-xs text-muted-foreground">24/7 Support</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Accurate Info</p>
                <p className="text-xs text-muted-foreground">Trusted Data</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                <i className="fas fa-layer-group"></i>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">All in One Place</p>
                <p className="text-xs text-muted-foreground">Everything You Need</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end z-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200 fill-mode-both">
          <div className="relative w-full max-w-lg aspect-square drop-shadow-2xl">
            <img
              src={collegeBuilding}
              alt="University Illustration"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin} 
      />
    </div>
  );
};

export default HomePage;