














// modify the interface with any CRUD methods
// you might need
























export class MemStorage {









  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.cutoffs = new Map();
    this.scholarships = new Map();
    this.userId = 1;
    this.messageId = 1;
    this.cutoffId = 1;
    this.scholarshipId = 1;

    // Seed college cutoffs with sample data
    this.seedCollegeCutoffs();
  }

  seedCollegeCutoffs() {
    const sampleCutoffs = [
    {
      university: "Harvard University",
      program: "Computer Science",
      country: "United States",
      gpa: "3.9+",
      testScores: "SAT: 1550+",
      acceptanceRate: "5%",
      academicYear: "2023-2024"
    },
    {
      university: "Stanford University",
      program: "Computer Science",
      country: "United States",
      gpa: "3.9+",
      testScores: "SAT: 1500+",
      acceptanceRate: "4%",
      academicYear: "2023-2024"
    },
    {
      university: "MIT",
      program: "Computer Science",
      country: "United States",
      gpa: "3.9+",
      testScores: "SAT: 1540+",
      acceptanceRate: "7%",
      academicYear: "2023-2024"
    },
    {
      university: "Oxford University",
      program: "Computer Science",
      country: "United Kingdom",
      gpa: "3.8+",
      testScores: "A* A* A",
      acceptanceRate: "15%",
      academicYear: "2023-2024"
    },
    {
      university: "University of Toronto",
      program: "Computer Science",
      country: "Canada",
      gpa: "3.7+",
      testScores: "90%+",
      acceptanceRate: "25%",
      academicYear: "2023-2024"
    },
    {
      university: "Stanford University",
      program: "Medicine",
      country: "United States",
      gpa: "3.9+",
      testScores: "MCAT: 518+",
      acceptanceRate: "2%",
      academicYear: "2023-2024"
    },
    {
      university: "Harvard University",
      program: "Business",
      country: "United States",
      gpa: "3.8+",
      testScores: "GMAT: 730+",
      acceptanceRate: "10%",
      academicYear: "2023-2024"
    },
    {
      university: "University of Melbourne",
      program: "Engineering",
      country: "Australia",
      gpa: "3.5+",
      testScores: "ATAR: 95+",
      acceptanceRate: "30%",
      academicYear: "2023-2024"
    },
    {
      university: "University of British Columbia",
      program: "Computer Science",
      country: "Canada",
      gpa: "3.6+",
      testScores: "85%+",
      acceptanceRate: "20%",
      academicYear: "2023-2024"
    },
    {
      university: "Imperial College London",
      program: "Engineering",
      country: "United Kingdom",
      gpa: "3.7+",
      testScores: "A* A A",
      acceptanceRate: "12%",
      academicYear: "2023-2024"
    }];


    // Add each sample cutoff to the storage
    sampleCutoffs.forEach((cutoff) => {
      this.createCollegeCutoff(cutoff);
    });
  }

  // User operations
  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async getUserByFirebaseId(firebaseId) {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId
    );
  }

  async createUser(insertUser) {
    const id = this.userId++;
    const createdAt = new Date();
    const user = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Chat message operations
  async getChatMessages(userId) {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId || message.userId === undefined
    );
  }

  async createChatMessage(message) {
    const id = this.messageId++;
    const timestamp = new Date();
    const chatMessage = { ...message, id, timestamp };
    this.messages.set(id, chatMessage);
    return chatMessage;
  }

  // College cutoffs operations
  async getCollegeCutoffs(filters) {
    if (!filters) {
      return Array.from(this.cutoffs.values());
    }

    return Array.from(this.cutoffs.values()).filter((cutoff) => {
      for (const [key, value] of Object.entries(filters)) {
        if (cutoff[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async createCollegeCutoff(cutoff) {
    const id = this.cutoffId++;
    const collegeCutoff = { ...cutoff, id };
    this.cutoffs.set(id, collegeCutoff);
    return collegeCutoff;
  }

  async getUniqueCollegeCutoffPrograms() {
    const allCutoffs = Array.from(this.cutoffs.values());
    const uniquePrograms = new Set();

    // Add "All" as the first option
    uniquePrograms.add("All");

    // Add all unique programs from the cutoffs
    allCutoffs.forEach((cutoff) => {
      if (cutoff.program) {
        uniquePrograms.add(cutoff.program);
      }
    });

    return Array.from(uniquePrograms);
  }

  async getUniqueCollegeCutoffUniversities() {
    const allCutoffs = Array.from(this.cutoffs.values());
    const uniqueUniversities = new Set();

    // Add "All" as the first option
    uniqueUniversities.add("All");

    // Add all unique universities from the cutoffs
    allCutoffs.forEach((cutoff) => {
      if (cutoff.university) {
        uniqueUniversities.add(cutoff.university);
      }
    });

    return Array.from(uniqueUniversities);
  }

  async getUniqueCollegeCutoffCountries() {
    const allCutoffs = Array.from(this.cutoffs.values());
    const uniqueCountries = new Set();

    // Add "All" as the first option
    uniqueCountries.add("All");

    // Add all unique countries from the cutoffs
    allCutoffs.forEach((cutoff) => {
      if (cutoff.country) {
        uniqueCountries.add(cutoff.country);
      }
    });

    return Array.from(uniqueCountries);
  }

  // Scholarship operations
  async getScholarships(filters) {
    if (!filters) {
      return Array.from(this.scholarships.values());
    }

    return Array.from(this.scholarships.values()).filter((scholarship) => {
      for (const [key, value] of Object.entries(filters)) {
        if (scholarship[key] !== value) {
          return false;
        }
      }
      return true;
    });
  }

  async createScholarship(scholarship) {
    const id = this.scholarshipId++;
    const newScholarship = { ...scholarship, id };
    this.scholarships.set(id, newScholarship);
    return newScholarship;
  }
}

export const storage = new MemStorage();