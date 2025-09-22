import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Activity } from "lucide-react";
import heroImage from "@/assets/hero-health-ai.jpg";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background/30 backdrop-blur-sm" />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 opacity-30">
        <Brain className="w-16 h-16 text-primary float-animation" />
      </div>
      <div className="absolute bottom-32 right-16 opacity-20">
        <Activity className="w-20 h-20 text-accent float-animation" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <div className="space-y-8 slide-up">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-hero-gradient">AI-Powered</span><br />
            <span className="text-foreground">Migraine Prediction</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground font-light max-w-2xl mx-auto leading-relaxed">
            Predicting migraines before they strike using advanced AI and lifestyle data
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              className="btn-hero text-lg px-8 py-4"
              onClick={() => scrollToSection('prediction-tool')}
            >
              Try Prediction Tool
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="text-lg px-8 py-4 bg-white/10 backdrop-blur-sm border-white/20 text-foreground hover:bg-white/20"
              onClick={() => scrollToSection('about')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default HeroSection;