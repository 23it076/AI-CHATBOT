import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/lib/firebase";
import AuthModal from "./AuthModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [location] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleOpenAuthModal = (loginMode) => {
    setIsLogin(loginMode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging you out",
        variant: "destructive"
      });
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Chat", href: "/chat" },
    { name: "Resources", href: "/resources" },
    { name: "Engineering Cutoffs", href: "/engineering-cutoffs" }
  ];

  if (currentUser?.email === "admin@example.com" || currentUser?.email === "parinp157@gmail.com") {
    navLinks.push({ name: "Admin Dashboard", href: "/admin-dashboard" });
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="text-[#4f46e5] font-bold text-2xl flex items-center cursor-pointer tracking-tight hover:opacity-90 transition-opacity">
                  <div className="bg-[#4f46e5]/10 p-2 rounded-xl mr-2">
                    <i className="fas fa-robot text-[#4f46e5]"></i>
                  </div>
                  StudyAI
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navLinks.map((link) => {
                const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
                return (
                  <Link 
                    key={link.name}
                    href={link.href}
                    className={`relative text-sm font-semibold transition-colors duration-200 py-2 ${
                      isActive 
                        ? "text-[#4f46e5]" 
                        : "text-gray-600 hover:text-[#4f46e5]"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4f46e5] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex md:items-center space-x-4">
              {!currentUser ? (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600 font-semibold hover:text-[#4f46e5] hover:bg-[#4f46e5]/5"
                    onClick={() => handleOpenAuthModal(true)}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-full px-6 shadow-md shadow-[#4f46e5]/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    onClick={() => handleOpenAuthModal(false)}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-transparent hover:border-[#4f46e5] transition-all shadow-sm">
                      <AvatarImage src={currentUser.photoURL || undefined} />
                      <AvatarFallback className="bg-[#4f46e5] text-white font-semibold">
                        {currentUser.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-gray-100">
                    <DropdownMenuLabel className="font-semibold text-gray-900">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer text-gray-700 hover:text-[#4f46e5] hover:bg-gray-50 focus:text-[#4f46e5] focus:bg-gray-50 rounded-lg">
                        <i className="fas fa-user w-5 text-center mr-2 text-gray-400"></i>
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 rounded-lg mt-1"
                    >
                      <i className="fas fa-sign-out-alt w-5 text-center mr-2 text-red-400"></i>
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-[#4f46e5] hover:bg-gray-100 rounded-xl"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} h-5 w-5`}></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 border-b border-gray-100" : "max-h-0"}`}>
          <div className="px-4 pt-2 pb-6 bg-white space-y-1 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive 
                      ? "bg-[#4f46e5]/10 text-[#4f46e5]" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#4f46e5]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              {!currentUser ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl font-semibold border-gray-200 text-gray-700"
                    onClick={() => {
                      handleOpenAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    className="w-full justify-center bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold rounded-xl"
                    onClick={() => {
                      handleOpenAuthModal(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign up
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="w-full justify-start rounded-xl font-semibold text-gray-600 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fas fa-user w-5 mr-3 text-gray-400"></i>
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="fas fa-sign-out-alt w-5 mr-3 text-red-400"></i>
                    Log out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        isLogin={isLogin}
        setIsLogin={setIsLogin} 
      />
    </>
  );
};

export default Navbar;