import { useState } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription } from
"@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
"@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger } from
"@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  School,
  Search,
  GraduationCap,
  Building,
  IndianRupee,
  Globe,
  Mail,
  Phone } from
"lucide-react";

const ScholarshipsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Scholarship data from the provided text file
  const scholarshipData = [
  {
    id: 1,
    name: "Mukhyamantri Yuva Swavalamban Yojana",
    category: "state",
    eligibility: "- Class 12th students with 80th percentile or above\n- Diploma students with 65% or above\n- Family income within limits",
    amount: "50% of tuition fees up to ₹50,000/- annually",
    website: "https://mysy.guj.nic.in/",
    email: "mysygujarat2019@gmail.com, mysy.acpc@gmail.com, mysytechnical@gmail.com",
    phone: "079-26566000, 7043333181"
  },
  {
    id: 2,
    name: "Merit Cum Means Based Scholarship",
    category: "minority",
    eligibility: "- For Muslims, Sikhs, Christians, Buddhists, Jain and Zoroastrians (Parsis)\n- Previous year percentage minimum 50%\n- Annual income below ₹2.50 lakh",
    amount: "₹25,000/- per annum",
    website: "www.scholarships.gov.in",
    email: "ddcw-minority@gujarat.gov.in, dcraj1@gmail.com",
    phone: "9824528273, 7923253265, 9998861161"
  },
  {
    id: 3,
    name: "Central Sector Scheme of Scholarship",
    category: "central",
    eligibility: "- Class 12th students with 80th percentile\n- Annual income below ₹8.00 lakh",
    amount: "₹10,000/- per annum",
    website: "www.scholarships.gov.in",
    email: "scholarshipche10@gmail.com",
    phone: "9824794102, 079-23253994"
  },
  {
    id: 4,
    name: "Post Matric Scholarship for SC Students (GOI)",
    category: "sc",
    eligibility: "- For SC category students (Freeship Card holders only)\n- Annual income below ₹2.50 lakh",
    amount: "100% of tuition fees annually",
    website: "www.digitalgujarat.gov.in",
    email: "swo-raj@gujarat.gov.in",
    phone: "0281 2444902"
  },
  {
    id: 5,
    name: "Post Matric Scholarship of Government of India for OBC Students",
    category: "sebc",
    eligibility: "- For OBC category students\n- Annual income below ₹2.00 lakh",
    amount: "₹5,000/- to ₹10,000/- annually",
    website: "www.digitalgujarat.gov.in",
    email: "dcraj1@gmail.com",
    phone: "0281 2447362"
  },
  {
    id: 6,
    name: "Educational Assistance for NTDNT Students Studying in Self Financed College",
    category: "sebc",
    eligibility: "- For NTDNT category students\n- Annual income below ₹2.00 lakh",
    amount: "Up to ₹50,000/- annually",
    website: "www.digitalgujarat.gov.in",
    email: "dcraj1@gmail.com",
    phone: "0281 2447362"
  },
  {
    id: 7,
    name: "Umbrella Scheme for Education of ST",
    category: "st",
    eligibility: "- For ST category students\n- Annual income below ₹2.50 lakh",
    amount: "100% of tuition fees annually",
    website: "www.digitalgujarat.gov.in",
    email: "vo-tdd-raj@gujarat.gov.in",
    phone: "0281 2478375"
  },
  {
    id: 8,
    name: "AICTE - Pragati Scholarship Scheme",
    category: "girls",
    eligibility: "- For female students only\n- 2 girl children per family\n- Annual family income less than ₹8 lakh",
    amount: "₹30,000/- per annum",
    website: "www.aicte-pragati-saksham-gov.in",
    email: "",
    phone: ""
  },
  {
    id: 9,
    name: "Prime Minister's Scholarship Scheme (PMSS)",
    category: "special",
    eligibility: "- Dependent wards of Ex-Servicemen / Ex-Coast Guard personnel and their widows",
    amount: "₹2,000/- for boys, ₹2,000/- for girls",
    website: "www.ksb.gov.in",
    email: "",
    phone: ""
  },
  {
    id: 10,
    name: "Construction Workers' Children Scholarship",
    category: "special",
    eligibility: "- Children of workers in construction sectors (including carpenters, electricians, welders, etc.)",
    amount: "₹25,000/- for degree courses",
    website: "",
    email: "",
    phone: ""
  },
  {
    id: 11,
    name: "Education Loan for EWS Students",
    category: "ews",
    eligibility: "- For Economically Weaker Section students",
    amount: "Education loan with subsidies and food bill assistance",
    website: "www.gueedc.gujarat.gov.in, www.vidyalakshmi.co.in/Students/",
    email: "",
    phone: ""
  }];


  // Filter scholarships based on search query and category
  const filteredScholarships = scholarshipData.filter((scholarship) => {
    const matchesSearch = scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scholarship.amount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || scholarship.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Categories for filtering
  const categories = [
  { id: "all", name: "All Scholarships" },
  { id: "state", name: "State Government" },
  { id: "central", name: "Central Government" },
  { id: "sc", name: "SC Category" },
  { id: "st", name: "ST Category" },
  { id: "sebc", name: "SEBC/OBC Category" },
  { id: "minority", name: "Minority" },
  { id: "girls", name: "For Girls" },
  { id: "ews", name: "EWS" },
  { id: "special", name: "Special Categories" }];


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <GraduationCap className="mr-2" size={30} />
            Scholarships
          </h1>
          <p className="text-gray-600 mt-2">
            Find scholarships to support your educational journey in Gujarat and across India
          </p>
          <div className="mt-3">
            <a
              href="https://www.buddy4study.com/scholarships?filter=eyJSRUxJR0lPTiI6W10sIkdFTkRFUiI6W10sIkVEVUNBVElPTiI6WyIyMiJdLCJDT1VOVFJZIjpbXSwiQ09VUlNFIjpbXSwiU1RBVEUiOltdLCJGT1JFSUdOIjpbXSwic29ydE9yZGVyIjoiREVBRExJTkUifQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center">
              
              <Globe className="h-4 w-4 mr-1" />
              Browse more scholarships on Buddy4Study
            </a>
          </div>
        </div>
        <div className="relative w-full md:w-64 mt-4 md:mt-0">
          <Input
            type="text"
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9" />
          
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      {/* Banner for Buddy4Study */}
      <div className="bg-primary/10 rounded-lg p-4 mb-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-primary/20 p-3 rounded-full mr-4">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-medium">Looking for more scholarships?</h3>
            <p className="text-sm text-gray-600">Discover hundreds of additional engineering scholarships on Buddy4Study (filter already applied)</p>
          </div>
        </div>
        <a
          href="https://www.buddy4study.com/scholarships?filter=eyJSRUxJR0lPTiI6W10sIkdFTkRFUiI6W10sIkVEVUNBVElPTiI6WyIyMiJdLCJDT1VOVFJZIjpbXSwiQ09VUlNFIjpbXSwiU1RBVEUiOltdLCJGT1JFSUdOIjpbXSwic29ydE9yZGVyIjoiREVBRExJTkUifQ=="
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
          
          Visit Buddy4Study
        </a>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) =>
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="mb-2">
              
                {category.name}
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="table" className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Scholarship Name</TableHead>
                <TableHead>Eligibility</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="w-[150px]">Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScholarships.length > 0 ?
              filteredScholarships.map((scholarship) =>
              <TableRow key={scholarship.id}>
                    <TableCell className="font-medium">{scholarship.name}</TableCell>
                    <TableCell className="whitespace-pre-line">{scholarship.eligibility}</TableCell>
                    <TableCell>{scholarship.amount}</TableCell>
                    <TableCell>
                      {scholarship.website &&
                  <div className="flex items-center text-sm mb-1">
                          <Globe className="h-4 w-4 mr-1 text-primary" />
                          <a href={scholarship.website.startsWith('http') ? scholarship.website : `https://${scholarship.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate">
                            {scholarship.website.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                          </a>
                        </div>
                  }
                    </TableCell>
                  </TableRow>
              ) :

              <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No scholarships found matching your search criteria.
                  </TableCell>
                </TableRow>
              }
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.length > 0 ?
            filteredScholarships.map((scholarship) =>
            <Card key={scholarship.id} className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-start">
                      <IndianRupee className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-1" />
                      <span>{scholarship.name}</span>
                    </CardTitle>
                    <CardDescription>
                      {getCategoryLabel(scholarship.category)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm flex items-center mb-1">
                        <School className="h-4 w-4 mr-1 text-primary" />
                        Eligibility Criteria
                      </h4>
                      <p className="text-sm text-gray-600 whitespace-pre-line">
                        {scholarship.eligibility}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm flex items-center mb-1">
                        <Building className="h-4 w-4 mr-1 text-primary" />
                        Scholarship Amount
                      </h4>
                      <p className="text-sm text-gray-600">
                        {scholarship.amount}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Contact Information</h4>
                      
                      {scholarship.website &&
                  <div className="flex items-center text-sm mb-1">
                          <Globe className="h-4 w-4 mr-1 text-primary" />
                          <a href={scholarship.website.startsWith('http') ? scholarship.website : `https://${scholarship.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate">
                            {scholarship.website.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '')}
                          </a>
                        </div>
                  }
                      
                      {scholarship.email &&
                  <div className="flex items-center text-sm mb-1">
                          <Mail className="h-4 w-4 mr-1 text-primary" />
                          <a href={`mailto:${scholarship.email.split(',')[0].trim()}`}
                    className="text-primary hover:underline truncate">
                            {scholarship.email.split(',')[0].trim()}
                          </a>
                        </div>
                  }
                      
                      {scholarship.phone &&
                  <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-1 text-primary" />
                          <span className="text-gray-600">{scholarship.phone.split(',')[0].trim()}</span>
                        </div>
                  }
                    </div>
                  </CardContent>
                </Card>
            ) :

            <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No scholarships found matching your search criteria.</p>
              </div>
            }
          </div>
        </TabsContent>
      </Tabs>
    </div>);

};

// Helper function to get readable category labels
function getCategoryLabel(category) {
  const labels = {
    state: "State Government",
    central: "Central Government",
    sc: "SC Category",
    st: "ST Category",
    sebc: "SEBC/OBC Category",
    minority: "Minority Scholarship",
    girls: "For Female Students",
    ews: "Economically Weaker Section",
    special: "Special Category"
  };

  return labels[category] || category;
}

export default ScholarshipsPage;