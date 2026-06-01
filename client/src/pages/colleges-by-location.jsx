import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { populateColleges } from "@/utils/populate-colleges";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";














const gujaratDistricts = [
"Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch",
"Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhoomi Dwarka",
"Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch",
"Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
"Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar",
"Tapi", "Vadodara", "Valsad"];


const collegeTypes = ["Engineering", "Medical", "Arts", "Commerce", "Science", "Law", "Pharmacy", "Management"];

const CollegesByLocation = () => {
  const { currentUser } = useAuth();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // For demonstration purposes, we'll consider admin emails
  const isAdmin = currentUser?.email === "admin@example.com" ||
  currentUser?.email === "parinp157@gmail.com";

  // Function to handle populating the database with colleges data
  const handlePopulateColleges = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive"
      });
      return;
    }

    try {
      setImporting(true);
      const addedCount = await populateColleges();

      toast({
        title: "Success!",
        description: `Successfully added ${addedCount} colleges to the database.`,
        variant: "default"
      });

      // Refresh the colleges list
      window.location.reload();
    } catch (error) {
      console.error("Error populating colleges:", error);
      toast({
        title: "Error",
        description: "Failed to populate colleges data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  // Fetch colleges data
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const collegesRef = collection(db, "colleges");
        const q = query(collegesRef, orderBy("name"));
        const querySnapshot = await getDocs(q);

        // Use a Map to deduplicate colleges by name
        const uniqueColleges = new Map();
        querySnapshot.forEach((doc) => {
          const college = { id: doc.id, ...doc.data() };
          if (!uniqueColleges.has(college.name)) {
            uniqueColleges.set(college.name, college);
          }
        });

        const collegesList = Array.from(uniqueColleges.values());

        // If no colleges in Firebase yet, use sample data
        if (collegesList.length === 0) {
          setColleges(sampleColleges);
          setFilteredColleges(sampleColleges);
        } else {
          setColleges(collegesList);
          setFilteredColleges(collegesList);
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
        // Use sample data as fallback
        setColleges(sampleColleges);
        setFilteredColleges(sampleColleges);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Filter colleges based on search term, district and type
  useEffect(() => {
    let results = colleges;

    if (searchTerm) {
      results = results.filter(
        (college) => college.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict && selectedDistrict !== "all") {
      results = results.filter(
        (college) => college.district === selectedDistrict
      );
    }

    if (selectedType && selectedType !== "all") {
      results = results.filter(
        (college) => college.type === selectedType
      );
    }

    setFilteredColleges(results);
  }, [searchTerm, selectedDistrict, selectedType, colleges]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
  };

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedDistrict("all");
    setSelectedType("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4">Colleges in Gujarat</h1>
        <p className="text-lg text-gray-600 mb-6">
          Find colleges across various districts in Gujarat. Use the filters below to narrow down your search.
        </p>
        
        {/* Search and filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <Input
              type="text"
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full" />
            
          </div>
          
          <div>
            <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {gujaratDistricts.map((district) =>
                <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="College Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {collegeTypes.map((type) =>
                <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Button
              variant="outline"
              onClick={resetFilters}
              className="w-full">
              
              Reset Filters
            </Button>
          </div>
        </div>
        
        {/* Results count and admin import button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="text-sm text-gray-500">
            Showing {filteredColleges.length} of {colleges.length} colleges
          </div>
          
          {isAdmin &&
          <Button
            onClick={handlePopulateColleges}
            disabled={importing}
            variant="outline"
            size="sm"
            className="ml-auto">
            
              {importing ? 'Importing...' : 'Import Gujarat Colleges'}
            </Button>
          }
        </div>
      </div>
      
      {/* Colleges grid */}
      {loading ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) =>
        <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-1/3 ml-auto" />
              </CardFooter>
            </Card>
        )}
        </div> :
      filteredColleges.length === 0 ?
      <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No colleges found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search filters.</p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div> :

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college) =>
        <Card key={college.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div
            className="h-48 bg-cover bg-center bg-gray-200"
            style={{
              backgroundImage: college.imageUrl ?
              `url(${college.imageUrl})` :
              "url('https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')"
            }}>
          </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{college.name}</CardTitle>
                <CardDescription>{college.district} District</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-2">
                  <span className="font-medium text-primary">{college.type}</span> College
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {college.description || `${college.name} is a leading institution in ${college.district} district of Gujarat, offering various courses and programs to students.`}
                </p>
              </CardContent>
              {college.website &&
          <CardFooter className="flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={college.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </Button>
                </CardFooter>
          }
            </Card>
        )}
        </div>
      }
    </div>);

};

// Sample data for initial development
const sampleColleges = [
{
  id: "1",
  name: "Gujarat Technological University",
  location: "Ahmedabad",
  district: "Ahmedabad",
  type: "Engineering",
  website: "https://www.gtu.ac.in",
  description: "Gujarat Technological University is a premier university offering various engineering and technology courses across Gujarat."
},
{
  id: "2",
  name: "Sardar Patel University",
  location: "Vallabh Vidyanagar",
  district: "Anand",
  type: "Arts",
  website: "https://www.spuvvn.edu",
  description: "Sardar Patel University offers numerous programs in arts, science, and commerce."
},
{
  id: "3",
  name: "Maharaja Sayajirao University of Baroda",
  location: "Vadodara",
  district: "Vadodara",
  type: "Science",
  website: "https://www.msubaroda.ac.in",
  description: "MSU Baroda is one of the oldest universities in Gujarat known for its excellence in education."
},
{
  id: "4",
  name: "Saurashtra University",
  location: "Rajkot",
  district: "Rajkot",
  type: "Commerce",
  website: "https://www.saurashtrauniversity.edu",
  description: "Saurashtra University is a state university offering various programs in Rajkot."
},
{
  id: "5",
  name: "GMERS Medical College",
  location: "Sola, Ahmedabad",
  district: "Ahmedabad",
  type: "Medical",
  description: "GMERS Medical College offers MBBS and other medical courses with state-of-the-art facilities."
},
{
  id: "6",
  name: "Government Engineering College",
  location: "Bhavnagar",
  district: "Bhavnagar",
  type: "Engineering",
  description: "GEC Bhavnagar offers quality engineering education to students from Bhavnagar and surrounding areas."
},
{
  id: "7",
  name: "Sir P. P. Institute of Science",
  location: "Bhavnagar",
  district: "Bhavnagar",
  type: "Science",
  description: "Sir P. P. Institute of Science is a prestigious science college in Bhavnagar district."
},
{
  id: "8",
  name: "R. K. University",
  location: "Rajkot",
  district: "Rajkot",
  type: "Engineering",
  website: "https://www.rku.ac.in",
  description: "R. K. University is a private university offering various professional courses in Rajkot."
},
{
  id: "9",
  name: "Dharmsinh Desai University",
  location: "Nadiad",
  district: "Kheda",
  type: "Engineering",
  website: "https://www.ddu.ac.in",
  description: "DDU is known for its quality engineering and management education in Kheda district."
},
{
  id: "10",
  name: "Government Medical College",
  location: "Surat",
  district: "Surat",
  type: "Medical",
  description: "Government Medical College, Surat offers MBBS and various specializations in medical education."
},
{
  id: "11",
  name: "Nirma University",
  location: "Ahmedabad",
  district: "Ahmedabad",
  type: "Engineering",
  website: "https://www.nirmauni.ac.in",
  description: "Nirma University is a private university known for its excellence in engineering and management education."
},
{
  id: "12",
  name: "Gujarat University",
  location: "Ahmedabad",
  district: "Ahmedabad",
  type: "Arts",
  website: "https://www.gujaratuniversity.ac.in",
  description: "Gujarat University is one of the oldest universities in the state offering various undergraduate and postgraduate programs."
}];


export default CollegesByLocation;