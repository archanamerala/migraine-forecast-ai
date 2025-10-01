import { Brain, Cloud, Heart, Smartphone, TrendingUp, Users, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AboutSection = () => {
  const features = [
    {
      icon: Brain,
      title: "AI & Machine Learning",
      description: "Advanced neural networks analyze patterns in your lifestyle and health data"
    },
    {
      icon: Cloud,
      title: "Weather Integration",
      description: "Environmental factors like temperature, humidity, and air pressure"
    },
    {
      icon: Heart,
      title: "Lifestyle Tracking",
      description: "Sleep patterns, diet, stress levels, and physical activity monitoring"
    },
    {
      icon: TrendingUp,
      title: "Predictive Analytics",
      description: "Hour-by-hour migraine risk forecasting with personalized insights"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-6">
        {/* Get in Touch Section */}
        <div className="wellness-card max-w-4xl mx-auto mb-16 p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="text-gradient">Get in Touch</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3 p-4 bg-white/30 rounded-lg hover:bg-white/40 transition-all">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground break-all">archanamerala7@gmail.com</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white/30 rounded-lg hover:bg-white/40 transition-all">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">91+ 7671937201</span>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-white/30 rounded-lg hover:bg-white/40 transition-all">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-foreground">Puttur, AP</span>
            </div>
          </div>
          
          {/* Stay Updated Section */}
          <div className="border-t border-border pt-8">
            <h3 className="text-xl font-semibold mb-4 text-center text-foreground">Stay Updated</h3>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-1"
              />
              <Button className="bg-gradient-primary hover:opacity-90 transition-opacity">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-gradient">Our Project</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionary AI system that predicts migraine attacks before they occur, 
            empowering individuals to take proactive measures and improve their quality of life.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="wellness-card text-center group relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Small elegant corner icon */}
                <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-gradient-primary rounded-full" />
                </div>
                
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-soft">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
        
        <div className="wellness-card max-w-4xl mx-auto p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gradient">The Problem</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Migraines are a debilitating neurological disorder affecting millions worldwide. 
                Traditional approaches focus on treatment after onset, leaving patients reactive 
                rather than proactive in their care.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our system changes this paradigm by providing early warning alerts and 
                personalized intervention strategies, similar to weather forecasting but for your health.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center space-x-8 mb-4">
                <div>
                  <div className="text-3xl font-bold text-primary">39M</div>
                  <div className="text-sm text-muted-foreground">Americans affected</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">85%</div>
                  <div className="text-sm text-muted-foreground">Prediction accuracy</div>
                </div>
              </div>
              <Users className="w-16 h-16 text-primary/20 mx-auto" />
            </div>
          </div>
        </div>
        
        {/* Small Technology Icons Row */}
        <div className="mt-16 text-center">
          <h4 className="text-lg font-medium text-muted-foreground mb-8">Core Technologies</h4>
          <div className="flex justify-center items-center space-x-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">AI & ML</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-light rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Weather</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Lifestyle</span>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 bg-gradient-to-r from-warning to-warning/80 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">Analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;