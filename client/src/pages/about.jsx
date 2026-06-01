import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const AboutPage = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">About StudyAI</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Our Mission and Vision
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Empowering students with AI-powered educational resources and personalized guidance.
          </p>
        </div>

        <div className="mt-10">
          <div className="prose prose-lg prose-primary mx-auto">
            <p>
              StudyAI was created with a simple yet powerful vision: to democratize access to educational guidance and resources. We believe that every student, regardless of their background or location, deserves access to high-quality educational information and personalized assistance.
            </p>
            
            <h3>What We Offer</h3>
            <ul>
              <li>
                <strong>AI-Powered Chat Assistant:</strong> Our advanced AI chatbot provides instant answers to your academic questions, from specific subject matter inquiries to advice on college applications.
              </li>
              <li>
                <strong>College Cutoff Database:</strong> Access up-to-date information on admission requirements for universities worldwide, helping you make informed decisions about where to apply.
              </li>
              <li>
                <strong>Scholarship Repository:</strong> Discover scholarship opportunities matched to your profile, with detailed information on eligibility criteria, application deadlines, and award amounts.
              </li>
              <li>
                <strong>Personalized Guidance:</strong> Receive tailored recommendations and advice based on your academic goals, interests, and qualifications.
              </li>
            </ul>
            
            <h3>Our Values</h3>
            <p>
              At StudyAI, we are guided by core values that shape everything we do:
            </p>
            <ul>
              <li><strong>Accessibility:</strong> Making educational resources available to all students.</li>
              <li><strong>Accuracy:</strong> Providing reliable, up-to-date information you can trust.</li>
              <li><strong>Innovation:</strong> Continuously improving our AI technology to better serve your needs.</li>
              <li><strong>Privacy:</strong> Respecting your data and maintaining the highest privacy standards.</li>
            </ul>
            
            <h3>Our Team</h3>
            <p>
              StudyAI was founded by a diverse team of educators, technologists, and former college admissions officers who understand the challenges students face in navigating their educational journey. We're united by our passion for education and our belief in the power of technology to transform learning.
            </p>
            
            <h3>Join Us on This Journey</h3>
            <p>
              Whether you're a high school student exploring college options, an undergraduate looking for scholarships, or a graduate student seeking specialized resources, StudyAI is here to help you achieve your academic goals.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 p-8 rounded-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to transform your academic journey?</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link href="/chat">
                <Button size="lg" className="px-8">
                  Start Chatting <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </Link>
              <Link href="/resources">
                <Button variant="outline" size="lg" className="px-8">
                  Explore Resources
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl font-bold text-center text-gray-900 mb-8">Trusted by Students From</h3>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-1 flex justify-center items-center text-gray-400">
              <span className="text-3xl"><i className="fas fa-university mr-2"></i> Harvard</span>
            </div>
            <div className="col-span-1 flex justify-center items-center text-gray-400">
              <span className="text-3xl"><i className="fas fa-university mr-2"></i> Stanford</span>
            </div>
            <div className="col-span-1 flex justify-center items-center text-gray-400">
              <span className="text-3xl"><i className="fas fa-university mr-2"></i> MIT</span>
            </div>
            <div className="col-span-1 flex justify-center items-center text-gray-400">
              <span className="text-3xl"><i className="fas fa-university mr-2"></i> Oxford</span>
            </div>
            <div className="col-span-1 flex justify-center items-center text-gray-400 md:col-start-2 lg:col-start-auto">
              <span className="text-3xl"><i className="fas fa-university mr-2"></i> Berkeley</span>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default AboutPage;