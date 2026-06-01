import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, GraduationCap, MapPin, Check } from "lucide-react";

const ResourcesPage = () => {
  return (
    <div className="flex-grow flex flex-col items-center min-h-[calc(100vh-80px)] w-full bg-white animate-in fade-in duration-500 py-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Resources
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Your gateway to academic information and opportunities
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Engineering Cutoffs Card */}
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl bg-white group">
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Engineering Cutoffs</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                Explore previous year cutoff ranks for engineering programs across Gujarat.
              </p>
              
              <ul className="space-y-3 mb-8">
                {['College wise cutoffs', 'Branch wise analysis', 'Category wise data', 'Opening & Closing ranks'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-indigo-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href="/engineering-cutoffs">
                <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl py-6 shadow-md shadow-[#4f46e5]/20 font-semibold flex items-center justify-center group-hover:shadow-lg transition-all">
                  View Cutoffs
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Scholarships Card */}
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl bg-white group">
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Scholarships</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                Find and apply for scholarships that match your profile and eligibility criteria.
              </p>
              
              <ul className="space-y-3 mb-8">
                {['Merit-based scholarships', 'Category-based scholarships', 'Government schemes', 'Application deadlines'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-teal-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href="/resources/scholarships">
                <Button className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl py-6 shadow-md shadow-[#4f46e5]/20 font-semibold flex items-center justify-center group-hover:shadow-lg transition-all">
                  Browse Scholarships
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Button>
              </Link>
            </div>
          </Card>

          {/* Colleges by Location Card */}
          <Card className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl bg-white group">
            <div className="p-8">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Colleges by Location</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">
                Discover colleges in Gujarat based on your preferred location and programs.
              </p>
              
              <ul className="space-y-3 mb-8">
                {['District wise colleges', 'Program availability', 'College profiles', 'Contact information'].map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-600">
                    <Check className="w-4 h-4 text-orange-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link href="/colleges-by-location">
                <Button className="w-full bg-[#d97757] hover:bg-[#c26245] text-white rounded-xl py-6 shadow-md shadow-[#d97757]/20 font-semibold flex items-center justify-center group-hover:shadow-lg transition-all">
                  Find Colleges
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                </Button>
              </Link>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;