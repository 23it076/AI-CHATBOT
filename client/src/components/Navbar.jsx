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
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="font-bold text-2xl flex items-center cursor-pointer tracking-tight hover:opacity-90 transition-opacity text-foreground">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl mr-3 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <i className="fas fa-graduation-cap text-white"></i>
                  </div>
                  StudentGuide<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">AI</span>
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
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
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
                    className="text-muted-foreground font-semibold hover:text-primary hover:bg-primary/5"
                    onClick={() => handleOpenAuthModal(true)}
                  >
                    Log in
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6 shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                    onClick={() => handleOpenAuthModal(false)}
                  >
                    Sign up
                  </Button>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-transparent hover:border-primary transition-all shadow-sm">
                      <AvatarImage src={currentUser.photoURL || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {currentUser.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-border bg-card">
                    <DropdownMenuLabel className="font-semibold text-foreground">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer text-muted-foreground hover:text-primary hover:bg-muted focus:text-primary focus:bg-muted rounded-lg">
                        <i className="fas fa-user w-5 text-center mr-2"></i>
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10 focus:text-destructive focus:bg-destructive/10 rounded-lg mt-1"
                    >
                      <i className="fas fa-sign-out-alt w-5 text-center mr-2"></i>
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
                className="text-muted-foreground hover:text-primary hover:bg-muted rounded-xl"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} h-5 w-5`}></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 border-b border-border" : "max-h-0"}`}>
          <div className="px-4 pt-2 pb-6 bg-background space-y-1 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location === link.href || (link.href !== '/' && location.startsWith(link.href));
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            
            <div className="mt-6 pt-6 border-t border-border">
              {!currentUser ? (
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl font-semibold border-border text-foreground hover:bg-muted"
                    onClick={() => {
                      handleOpenAuthModal(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log in
                  </Button>
                  <Button
                    className="w-full justify-center bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
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
                      className="w-full justify-start rounded-xl font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className="fas fa-user w-5 mr-3"></i>
                      Profile
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-xl font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <i className="fas fa-sign-out-alt w-5 mr-3"></i>
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