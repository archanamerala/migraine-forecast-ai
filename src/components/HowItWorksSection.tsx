import { Database, Brain, TrendingUp, Bell } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Database,
      number: "01",
      title: "Data Collection",
      description: "Gather lifestyle data (sleep, diet, stress) and environmental factors (weather, air quality)",
      color: "text-primary"
    },
    {
      icon: Brain,
      number: "02", 
      title: "AI Analysis",
      description: "Advanced machine learning models analyze patterns and correlations in your personal data",
      color: "text-accent"
    },
    {
      icon: TrendingUp,
      number: "03",
      title: "Risk Prediction",
      description: "Generate hour-by-hour migraine risk forecasts with confidence intervals",
      color: "text-success"
    },
    {
      icon: Bell,
      number: "04",
      title: "Proactive Alerts",
      description: "Receive personalized suggestions and smart device integrations to prevent attacks",
      color: "text-warning"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-r from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How <span className="text-gradient">It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our four-step process transforms your data into actionable migraine prevention insights
          </p>
        </div>
        
        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-success transform -translate-y-1/2 opacity-20" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="relative wellness-card text-center group hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-card">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 mx-auto mb-6 bg-white rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-card transition-all duration-300`}>
                    <Icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="mt-6 w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 bg-gradient-to-r ${
                        index === 0 ? 'from-primary to-primary-light' :
                        index === 1 ? 'from-accent to-accent-light' :
                        index === 2 ? 'from-success to-success/80' :
                        'from-warning to-warning/80'
                      } rounded-full transition-all duration-1000`}
                      style={{ width: `${25 + index * 25}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-primary/10 shadow-soft">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-foreground font-medium">Processing your health data continuously</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;