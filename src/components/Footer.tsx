import { Brain, Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-primary/10 via-background to-accent/10 border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gradient">MigrAI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              AI-powered migraine prediction system using lifestyle and weather data 
              to provide proactive healthcare solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
            <div className="space-y-2">
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                About Project
              </a>
              <a href="#features" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Features
              </a>
              <a href="#how-it-works" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                How It Works
              </a>
              <a href="#prediction-tool" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Prediction Tool
              </a>
            </div>
          </div>
          
          {/* Research Areas */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Research Focus</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Machine Learning</p>
              <p>• Neural Networks</p>
              <p>• Healthcare AI</p>
              <p>• Preventive Medicine</p>
              <p>• Environmental Health</p>
            </div>
          </div>
          
          {/* Project Team */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">Project Team</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Research Domain:</strong></p>
              <p>AI in Healthcare</p>
              <p><strong>Supervisor:</strong></p>
              <p>AI Health Research Lab</p>
              <p><strong>Institution:</strong></p>
              <p>Advanced AI Research Center</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} AI Migraine Prediction Project. Research in progress.
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-destructive" />
              <span>for better healthcare</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;