import { useState, useEffect, useMemo } from "react";
import { Search, MapPin, Filter, SortAsc, SortDesc, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ITEMS_PER_PAGE = 20;

const EngineeringCutoffs = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [district, setDistrict] = useState("All");
  const [course, setCourse] = useState("All");
  const [category, setCategory] = useState("All");
  const [studentRank, setStudentRank] = useState("");
  
  // Sorting state
  const [sortOrder, setSortOrder] = useState("asc"); // asc = lowest cutoff first

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const fetchCutoffs = async () => {
      try {
        setIsLoading(true);
        const snapshot = await getDocs(collection(db, "acpcCutoffs"));
        const cutoffsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(cutoffsData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching cutoffs:", err);
        setError("Failed to load cutoff data.");
        setIsLoading(false);
      }
    };
    fetchCutoffs();
  }, []);

  // Derived options for filters
  const districts = useMemo(() => ["All", ...new Set(data.map(item => item.district).filter(Boolean))].sort(), [data]);
  const courses = useMemo(() => ["All", ...new Set(data.map(item => item.courseName).filter(Boolean))].sort(), [data]);
  const categories = useMemo(() => ["All", ...new Set(data.map(item => item.category).filter(Boolean))].sort(), [data]);

  // Apply filters and sorting
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery) {
      result = result.filter(item => 
        item.collegeName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (district !== "All") {
      result = result.filter(item => item.district === district);
    }
    if (course !== "All") {
      result = result.filter(item => item.courseName === course);
    }
    if (category !== "All") {
      result = result.filter(item => item.category === category);
    }
    if (studentRank) {
      const rank = parseInt(studentRank, 10);
      if (!isNaN(rank)) {
        // Show colleges where closing rank is greater than or equal to student rank
        // Meaning the student is eligible
        result = result.filter(item => item.closingRank >= rank && item.closingRank > 0);
      }
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.closingRank - b.closingRank;
      } else {
        return b.closingRank - a.closingRank;
      }
    });

    return result;
  }, [data, searchQuery, district, course, category, studentRank, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, district, course, category, studentRank, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Filter className="h-8 w-8 text-[#4f46e5]" />
            ACPC Cutoffs Explorer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Find your dream college based on previous year cutoffs.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Admission Year</label>
          <Select defaultValue="2024">
            <SelectTrigger className="w-32 bg-white">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="mb-8 border-none shadow-lg bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
        <CardHeader className="pb-4">
          <CardTitle>Smart Filters</CardTitle>
          <CardDescription>Narrow down your options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="space-y-2 lg:col-span-2">
              <label className="text-sm font-medium">Search College</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g. L.D. College..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Rank Matcher */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Merit Rank</label>
              <Input
                type="number"
                placeholder="Enter rank"
                value={studentRank}
                onChange={e => setStudentRank(e.target.value)}
              />
            </div>

            {/* District Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="District" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Course Filter */}
            <div className="space-y-2 lg:col-span-3">
              <label className="text-sm font-medium">Branch / Course</label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Toggle */}
            <div className="space-y-2 lg:col-span-2 flex flex-col justify-end">
              <Button 
                variant="outline" 
                onClick={toggleSort}
                className="w-full flex items-center justify-center gap-2"
              >
                {sortOrder === "asc" ? (
                  <><SortAsc className="h-4 w-4" /> Lowest Cutoff First</>
                ) : (
                  <><SortDesc className="h-4 w-4" /> Highest Cutoff First</>
                )}
              </Button>
            </div>

          </div>
        </CardContent>
      </Card>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground animate-pulse">Loading ACPC Cutoffs...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 text-destructive">
            <p>{error}</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground flex flex-col items-center gap-3">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg font-medium">No colleges found</p>
            <p className="text-sm">Try adjusting your filters or rank.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800">
                  <TableRow>
                    <TableHead className="w-[300px]">College Name</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="text-right">Opening Rank</TableHead>
                    <TableHead className="text-right">Closing Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="line-clamp-2">{item.collegeName}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {item.district}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal text-xs">
                          {item.courseName}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.district}</TableCell>
                      <TableCell className="text-right font-mono text-sm text-slate-500">
                        {item.openingRank > 0 ? item.openingRank : '-'}
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-primary">
                        {item.closingRank > 0 ? item.closingRank : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t bg-slate-50 dark:bg-slate-800/50">
                <p className="text-sm text-muted-foreground hidden md:block">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)} of {filteredData.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <div className="text-sm font-medium px-4">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EngineeringCutoffs;