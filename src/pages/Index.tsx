import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PredictionTool from "@/components/PredictionTool";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Scroll reveal animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        rootMargin: '-100px 0px',
        threshold: 0.1
      }
    );

    // Observe elements with reveal-on-scroll class
    const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
    elementsToReveal.forEach((el) => observer.observe(el));

    return () => {
      elementsToReveal.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Project */}
      <div className="reveal-on-scroll">
        <AboutSection />
      </div>
      
      {/* Features */}
      <div className="reveal-on-scroll">
        <FeaturesSection />
      </div>
      
      {/* How It Works */}
      <div className="reveal-on-scroll">
        <HowItWorksSection />
      </div>
      
      {/* Prediction Tool */}
      <div className="reveal-on-scroll">
        <PredictionTool />
      </div>
      
      {/* Contact */}
      <div className="reveal-on-scroll">
        <ContactSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;