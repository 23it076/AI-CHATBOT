import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/home";
import ChatPage from "./pages/chat";
import ResourcesPage from "./pages/resources";
import EngineeringCutoffsPage from "./pages/engineering-cutoffs";
import ScholarshipsPage from "./pages/scholarships";
import CollegesByLocationPage from "./pages/colleges-by-location";
import ProfilePage from "./pages/profile";
import AboutPage from "./pages/about";
import AdminDashboardPage from "./pages/admin-dashboard";
import NotFound from "./pages/not-found";
import { AuthProvider } from "./context/AuthContext";

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/chat" component={ChatPage} />
          <Route path="/resources" component={ResourcesPage} />
          <Route path="/engineering-cutoffs" component={EngineeringCutoffsPage} />
          <Route path="/resources/scholarships" component={ScholarshipsPage} />
          <Route path="/colleges-by-location" component={CollegesByLocationPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/admin-dashboard" component={AdminDashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>);

}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>);

}

export default App;