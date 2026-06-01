import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger } from
"@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { populateColleges } from "@/utils/populate-colleges";

import { serverTimestamp } from "firebase/firestore";


const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const [saving, setSaving] = useState(false);

  // Admin states
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [adminRole, setAdminRole] = useState("editor");

  // College states
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [collegeDistrict, setCollegeDistrict] = useState("");
  const [collegeType, setCollegeType] = useState("");
  const [collegeWebsite, setCollegeWebsite] = useState("");
  const [collegeContact, setCollegeContact] = useState("");
  const [collegeCourses, setCollegeCourses] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  // States for scholarships form
  const [scholarshipName, setScholarshipName] = useState("");
  const [scholarshipProvider, setScholarshipProvider] = useState("");
  const [scholarshipAmount, setScholarshipAmount] = useState("");
  const [scholarshipCategory, setScholarshipCategory] = useState("merit");
  const [scholarshipEligibility, setScholarshipEligibility] = useState("");
  const [scholarshipDeadline, setScholarshipDeadline] = useState("");
  const [scholarshipLink, setScholarshipLink] = useState("");

  // States for college cutoffs form
  const [university, setUniversity] = useState("");
  const [program, setProgram] = useState("");
  const [country, setCountry] = useState("India");
  const [gpa, setGpa] = useState("");
  const [testScores, setTestScores] = useState("");
  const [acceptanceRate, setAcceptanceRate] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-2026");

  // States for loading indicators
  const [addingScholarship, setAddingScholarship] = useState(false);
  const [addingCutoff, setAddingCutoff] = useState(false);
  const [importingColleges, setImportingColleges] = useState(false);
  const [addingCollege, setAddingCollege] = useState(false);


  const isAdmin = currentUser?.email === "admin@example.com" ||
  currentUser?.email === "parinp157@gmail.com";

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2">You do not have permission to access this page.</p>
      </div>);

  }

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "admins"), {
        email: newAdminEmail,
        name: newAdminName,
        role: adminRole,
        createdAt: new Date(),
        createdBy: currentUser?.email
      });
      setNewAdminEmail("");
      setNewAdminName("");
      setAdminRole("editor");
      toast({
        title: "Success!",
        description: "Admin added successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: "Failed to add admin. Please try again.",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  const handleAddCollege = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, "colleges"), {
        name: collegeName,
        location: collegeLocation,
        district: collegeDistrict,
        type: collegeType,
        website: collegeWebsite,
        contact: collegeContact,
        courses: collegeCourses.split(",").map((course) => course.trim()),
        description: collegeDescription,
        createdAt: new Date(),
        createdBy: currentUser?.email
      });

      setCollegeName("");
      setCollegeLocation("");
      setCollegeDistrict("");
      setCollegeType("");
      setCollegeWebsite("");
      setCollegeContact("");
      setCollegeCourses("");
      setCollegeDescription("");

      toast({
        title: "Success!",
        description: "College added successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error("Error adding college:", error);
      toast({
        title: "Error",
        description: "Failed to add college. Please try again.",
        variant: "destructive"
      });
    }
    setSaving(false);
  };

  // Handle scholarship submission
  const handleAddScholarship = async (e) => {
    e.preventDefault();

    if (!scholarshipName || !scholarshipProvider || !scholarshipCategory) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingScholarship(true);

      // Create scholarship object
      const scholarshipData = {
        name: scholarshipName,
        provider: scholarshipProvider,
        amount: scholarshipAmount,
        category: scholarshipCategory,
        eligibility: scholarshipEligibility,
        deadline: scholarshipDeadline,
        link: scholarshipLink,
        createdAt: serverTimestamp()
      };

      // Add to Firestore
      const scholarshipsRef = collection(db, "scholarships");
      await addDoc(scholarshipsRef, scholarshipData);

      toast({
        title: "Success!",
        description: "Scholarship added successfully.",
        variant: "default"
      });

      // Reset form
      setScholarshipName("");
      setScholarshipProvider("");
      setScholarshipAmount("");
      setScholarshipCategory("merit");
      setScholarshipEligibility("");
      setScholarshipDeadline("");
      setScholarshipLink("");
    } catch (error) {
      console.error("Error adding scholarship:", error);
      toast({
        title: "Error",
        description: "Failed to add scholarship. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingScholarship(false);
    }
  };

  // Handle cutoff submission
  const handleAddCutoff = async (e) => {
    e.preventDefault();

    if (!university || !program || !gpa) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingCutoff(true);

      // Create cutoff object
      const cutoffData = {
        university,
        program,
        country,
        gpa,
        testScores,
        acceptanceRate,
        academicYear
      };

      // Add to Firestore
      const cutoffsRef = collection(db, "collegeCutoffs");
      await addDoc(cutoffsRef, cutoffData);

      toast({
        title: "Success!",
        description: "College cutoff added successfully.",
        variant: "default"
      });

      // Reset form
      setUniversity("");
      setProgram("");
      setGpa("");
      setTestScores("");
      setAcceptanceRate("");
    } catch (error) {
      console.error("Error adding college cutoff:", error);
      toast({
        title: "Error",
        description: "Failed to add college cutoff. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAddingCutoff(false);
    }
  };


  // Handle importing colleges data
  const handleImportColleges = async () => {
    try {
      setImportingColleges(true);
      const addedCount = await populateColleges();

      toast({
        title: "Success!",
        description: `Successfully imported ${addedCount} colleges.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error importing colleges:", error);
      toast({
        title: "Error",
        description: "Failed to import colleges data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setImportingColleges(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Manage application data including administrators, colleges, and more.
      </p>

      <Tabs defaultValue="admins" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="cutoffs">College Cutoffs</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
        </TabsList>

        {/* Admins Tab */}
        <TabsContent value="admins">
          <Card>
            <CardHeader>
              <CardTitle>Add New Admin</CardTitle>
              <CardDescription>
                Add new administrators to manage the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-name">Admin Name</Label>
                  <Input
                    id="admin-name"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="John Doe"
                    required />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-role">Role</Label>
                  <Select value={adminRole} onValueChange={setAdminRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Adding..." : "Add Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Colleges Tab */}
        <TabsContent value="colleges">
          <Card>
            <CardHeader>
              <CardTitle>Add New College</CardTitle>
              <CardDescription>
                Add new colleges to the database.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCollege} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="college-name">College Name *</Label>
                  <Input
                    id="college-name"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="Gujarat Technical University"
                    required />
                  
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college-location">Location *</Label>
                    <Input
                      id="college-location"
                      value={collegeLocation}
                      onChange={(e) => setCollegeLocation(e.target.value)}
                      placeholder="Ahmedabad"
                      required />
                    
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college-district">District *</Label>
                    <Input
                      id="college-district"
                      value={collegeDistrict}
                      onChange={(e) => setCollegeDistrict(e.target.value)}
                      placeholder="Ahmedabad"
                      required />
                    
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-type">Type *</Label>
                  <Select value={collegeType} onValueChange={setCollegeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select college type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="aided">Government-Aided</SelectItem>
                      <SelectItem value="deemed">Deemed</SelectItem>
                      <SelectItem value="autonomous">Autonomous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-website">Website</Label>
                  <Input
                    id="college-website"
                    type="url"
                    value={collegeWebsite}
                    onChange={(e) => setCollegeWebsite(e.target.value)}
                    placeholder="https://www.gtu.ac.in" />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-contact">Contact Information</Label>
                  <Input
                    id="college-contact"
                    value={collegeContact}
                    onChange={(e) => setCollegeContact(e.target.value)}
                    placeholder="Phone, email, etc." />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-courses">Courses Offered</Label>
                  <Input
                    id="college-courses"
                    value={collegeCourses}
                    onChange={(e) => setCollegeCourses(e.target.value)}
                    placeholder="B.Tech, M.Tech, MBA (comma-separated)" />
                  
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college-description">Description</Label>
                  <Textarea
                    id="college-description"
                    value={collegeDescription}
                    onChange={(e) => setCollegeDescription(e.target.value)}
                    placeholder="Brief description of the college..." />
                  
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? "Adding..." : "Add College"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scholarships Tab */}
        <TabsContent value="scholarships">
          <Card>
            <CardHeader>
              <CardTitle>Add New Scholarship</CardTitle>
              <CardDescription>
                Add scholarship opportunities for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddScholarship}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="scholarship-name">Scholarship Name *</Label>
                    <Input
                      id="scholarship-name"
                      value={scholarshipName}
                      onChange={(e) => setScholarshipName(e.target.value)}
                      placeholder="Gujarat Merit Scholarship"
                      required />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scholarship-provider">Provider *</Label>
                    <Input
                      id="scholarship-provider"
                      value={scholarshipProvider}
                      onChange={(e) => setScholarshipProvider(e.target.value)}
                      placeholder="Gujarat Education Department"
                      required />
                    
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="scholarship-amount">Amount</Label>
                    <Input
                      id="scholarship-amount"
                      value={scholarshipAmount}
                      onChange={(e) => setScholarshipAmount(e.target.value)}
                      placeholder="₹50,000 per year" />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scholarship-category">Category *</Label>
                    <Select
                      value={scholarshipCategory}
                      onValueChange={setScholarshipCategory}
                      required>
                      
                      <SelectTrigger id="scholarship-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="merit">Merit-based</SelectItem>
                        <SelectItem value="need">Need-based</SelectItem>
                        <SelectItem value="minority">Minority</SelectItem>
                        <SelectItem value="gender">Gender-specific</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                        <SelectItem value="sports">Sports</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="scholarship-deadline">Application Deadline</Label>
                    <Input
                      id="scholarship-deadline"
                      type="date"
                      value={scholarshipDeadline}
                      onChange={(e) => setScholarshipDeadline(e.target.value)} />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scholarship-link">Website/Application Link</Label>
                    <Input
                      id="scholarship-link"
                      value={scholarshipLink}
                      onChange={(e) => setScholarshipLink(e.target.value)}
                      placeholder="https://scholarship-website.com"
                      type="url" />
                    
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label htmlFor="scholarship-eligibility">Eligibility Criteria</Label>
                  <Textarea
                    id="scholarship-eligibility"
                    value={scholarshipEligibility}
                    onChange={(e) => setScholarshipEligibility(e.target.value)}
                    placeholder="Minimum 80% in 12th standard, Gujarat domicile..."
                    className="min-h-[100px]" />
                  
                </div>
                <Button type="submit" disabled={addingScholarship} className="w-full">
                  {addingScholarship ? "Adding..." : "Add Scholarship"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* College Cutoffs Tab */}
        <TabsContent value="cutoffs">
          <Card>
            <CardHeader>
              <CardTitle>Add College Cutoff Data</CardTitle>
              <CardDescription>
                Add admission cutoffs and requirements for colleges and programs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCutoff}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="university">University/College Name *</Label>
                    <Input
                      id="university"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="Gujarat Technological University"
                      required />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="program">Program/Course *</Label>
                    <Input
                      id="program"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      placeholder="B.Tech Computer Engineering"
                      required />
                    
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India" />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academic-year">Academic Year</Label>
                    <Select
                      value={academicYear}
                      onValueChange={setAcademicYear}>
                      
                      <SelectTrigger id="academic-year">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                        <SelectItem value="2024-2025">2024-2025</SelectItem>
                        <SelectItem value="2023-2024">2023-2024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="gpa">GPA/Percentage Required *</Label>
                    <Input
                      id="gpa"
                      value={gpa}
                      onChange={(e) => setGpa(e.target.value)}
                      placeholder="Minimum 75%"
                      required />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-scores">Test Scores</Label>
                    <Input
                      id="test-scores"
                      value={testScores}
                      onChange={(e) => setTestScores(e.target.value)}
                      placeholder="GUJCET: 90+ / JEE: 95+ percentile" />
                    
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acceptance-rate">Acceptance Rate</Label>
                    <Input
                      id="acceptance-rate"
                      value={acceptanceRate}
                      onChange={(e) => setAcceptanceRate(e.target.value)}
                      placeholder="15%" />
                    
                  </div>
                </div>
                <Button type="submit" disabled={addingCutoff} className="w-full">
                  {addingCutoff ? "Adding..." : "Add College Cutoff"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Import Tab */}
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>
                Bulk import options for populating database with predefined data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Gujarat Colleges Data</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Import a comprehensive collection of colleges and universities across Gujarat districts.
                  This includes 30+ institutions with detailed information.
                </p>
                <Button
                  onClick={handleImportColleges}
                  disabled={importingColleges}
                  variant="outline">
                  
                  {importingColleges ? "Importing..." : "Import Gujarat Colleges Data"}
                </Button>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="text-lg font-medium mb-2">Sample Engineering Cutoffs</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This option is currently in development. Check back later for updates.
                </p>
                <Button disabled variant="outline">
                  Import Engineering Cutoffs (Coming Soon)
                </Button>
              </div>
              <Separator className="my-4" />
              <div>
                <h3 className="text-lg font-medium mb-2">Sample Scholarships</h3>
                <p className="text-sm text-gray-500 mb-4">
                  This option is currently in development. Check back later for updates.
                </p>
                <Button disabled variant="outline">
                  Import Scholarships (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

};

export default AdminDashboard;