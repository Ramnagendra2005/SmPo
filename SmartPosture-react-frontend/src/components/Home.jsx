import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, Monitor, Activity, Users, Award, ArrowRight } from "lucide-react";

const Home = () => {
  return (
    <div className="w-full overflow-x-hidden scroll-smooth">
      {/* Hero Section with Image */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Benefits Section */}
      <BenefitsSection />
      
      {/* Call to Action */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

// Hero Section with animated elements and side image
const HeroSection = () => {
  return (
    <section className="relative flex items-center min-h-screen px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">
              Smart Posture
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h2 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 mt-6 mb-8">
              A Real-Time ML-Driven System for Posture Detection, Analysis and Personalized Exercise Recommendations
            </h2>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Improve your posture, reduce pain, and boost productivity with our AI-powered posture analysis system.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Your Analysis
            </button>
          </motion.div>
        </motion.div>
        
        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <img 
            src="https://imgs.search.brave.com/SmkmUJBZJCYgDoYXy5uf-XiiKp18MHIvexlHlkdAiMk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4t/cHJvZC5tZWRpY2Fs/bmV3c3RvZGF5LmNv/bS9jb250ZW50L2lt/YWdlcy9hcnRpY2xl/cy8zMjEvMzIxODYz/L2NvcnJlY3Qtc2l0/dGluZy1wb3N0dXJl/LWRpYWdyYW0tYXQt/YS1jb21wdXRlci1k/ZXNrLmpwZw"
            alt="Correct sitting posture"
            className="rounded-lg shadow-xl max-w-full max-h-96 object-contain"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2, duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-indigo-600"
        >
          <ChevronDown size={36} />
        </motion.div>
      </div>
    </section>
  );
};

// Features Section with animated cards
const FeaturesSection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  const features = [
    {
      icon: <Monitor size={48} />,
      title: "Real-Time Detection",
      description: "Instantly analyze your sitting posture through your webcam with advanced ML algorithms"
    },
    {
      icon: <Activity size={48} />,
      title: "Detailed Analysis",
      description: "Get comprehensive insights about your posture patterns and potential improvements"
    },
    {
      icon: <Users size={48} />,
      title: "Personalized Recommendations",
      description: "Receive customized exercise suggestions based on your unique posture profile"
    }
  ];
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Powerful Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Smart Posture uses cutting-edge technology to monitor and improve your sitting habits
          </p>
        </motion.div>
        
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-indigo-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// How It Works section with animated steps
const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Enable Camera",
      description: "Grant camera access to begin posture detection"
    },
    {
      number: "02",
      title: "Get Analyzed",
      description: "Our ML model accurately evaluates your sitting position in real-time"
    },
    {
      number: "03",
      title: "View Results",
      description: "Receive detailed feedback on your posture and potential issues"
    },
    {
      number: "04",
      title: "Follow Recommendations",
      description: "Practice suggested exercises to correct and strengthen"
    }
  ];
  
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Four simple steps to better posture and improved well-being
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-indigo-600 text-white text-2xl font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {step.number.split('')[1]}
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-12 w-full h-0.5 bg-indigo-200"></div>
              )}
              <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Benefits section with statistics and illustrations
const BenefitsSection = () => {
  const benefits = [
    {
      metric: "70%",
      title: "Reduction in Back Pain",
      description: "Users report significant decreases in discomfort after 4 weeks"
    },
    {
      metric: "83%",
      title: "Improved Productivity",
      description: "Better posture leads to better focus and energy levels"
    },
    {
      metric: "2x",
      title: "Better Awareness",
      description: "Users become twice as aware of their posture habits"
    }
  ];
  
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-900 to-violet-900 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transform Your Health</h2>
          <p className="text-lg text-indigo-200 max-w-3xl mx-auto">
            The benefits of good posture extend beyond just sitting correctly
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl text-center"
            >
              <div className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                {benefit.metric}
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-indigo-200">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center justify-center space-x-4 bg-white bg-opacity-10 backdrop-blur-lg py-4 px-8 rounded-full">
            <Award size={24} className="text-yellow-300" />
            <span className="text-lg">Based on surveys from over 10,000 Smart Posture users</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Call to Action section
const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-indigo-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/3 p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to improve your posture?</h2>
            <p className="text-indigo-100 text-lg mb-8">
              Start your journey to better health and comfort with Smart Posture's advanced analysis
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-bold text-lg shadow-lg inline-flex items-center"
            >
              Start Analysis <ArrowRight size={20} className="ml-2" />
            </motion.button>
          </div>
          <div className="md:w-1/3 bg-indigo-900 flex items-center justify-center p-8">
            <PostureIllustration />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Simple Footer
const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Smart Posture</h3>
            <p className="text-gray-400">Improving health through better sitting habits</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Real-time Detection</li>
              <li>Posture Analysis</li>
              <li>Exercise Recommendations</li>
              <li>Progress Tracking</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Blog</li>
              <li>Research</li>
              <li>Help Center</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: hello@smartposture.app</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Health St, Wellness City</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>© 2025 Smart Posture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Reused from sign-in page
const PostureIllustration = () => {
  return (
    <svg width="200" height="200" viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Desk */}
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        x="40" y="140" width="200" height="10" fill="#e0e7ff"
      />
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        x="50" y="150" width="180" height="60" fill="#c7d2fe"
      />
      
      {/* Computer */}
      <motion.rect
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        x="110" y="100" width="60" height="40" rx="2" fill="#a5b4fc"
      />
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        x="130" y="140" width="20" height="5" fill="#818cf8"
      />
      
      {/* Chair */}
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        x="110" y="170" width="60" height="10" rx="2" fill="#6366f1"
      />
      <motion.rect
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        x="130" y="180" width="20" height="40" fill="#4f46e5"
      />
      
      {/* Person silhouette (with proper posture) */}
      {/* Head */}
      <motion.circle
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.7, type: "spring" }}
        cx="140" cy="80" r="15" fill="#eef2ff"
      />
      
      {/* Body with proper spine alignment */}
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ delay: 0.9, duration: 1.5 }}
        d="M140 95 L140 130 L140 160" 
        stroke="#eef2ff" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      
      {/* Arms */}
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ delay: 1.1, duration: 1 }}
        d="M140 110 L110 130 M140 110 L170 130" 
        stroke="#eef2ff" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Legs */}
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 1, pathLength: 1 }}
        transition={{ delay: 1.3, duration: 1 }}
        d="M140 160 L120 200 M140 160 L160 200" 
        stroke="#eef2ff" 
        strokeWidth="4" 
        strokeLinecap="round"
      />
      
      {/* Posture guidelines - subtle alignment indicators */}
      <motion.path
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        d="M140 50 L140 220" 
        stroke="#a5b4fc" 
        strokeWidth="1" 
        strokeDasharray="4 4"
      />
      
      {/* Motion lines to indicate real-time analysis */}
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.7, pathLength: 1 }}
        transition={{ delay: 1.7, duration: 0.7, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
        d="M95 80 L115 80 M165 80 L185 80" 
        stroke="#a5b4fc" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <motion.path
        initial={{ opacity: 0, pathLength: 0 }}
        animate={{ opacity: 0.7, pathLength: 1 }}
        transition={{ delay: 1.9, duration: 0.7, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
        d="M100 130 L120 120 M160 120 L180 130" 
        stroke="#a5b4fc" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>  
  );
};

export default Home;