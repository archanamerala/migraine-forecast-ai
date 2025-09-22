import { Clock, Brain, Lightbulb, Smartphone, TrendingUp, Shield } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Hour-by-Hour Forecasting",
      description: "Real-time migraine risk predictions updated every hour, just like weather forecasts",
      gradient: "from-primary to-primary-light"
    },
    {
      icon: Brain,
      title: "Personalized AI Predictions",
      description: "Machine learning models adapt to your unique triggers and patterns over time",
      gradient: "from-accent to-accent-light"
    },
    {
      icon: Lightbulb,
      title: "Proactive Suggestions",
      description: "Actionable recommendations like hydration, rest, or environment adjustments",
      gradient: "from-success to-success/80"
    },
    {
      icon: Smartphone,
      title: "Smart Device Integration",
      description: "Automatic environment control with smart lights, thermostats, and reminders",
      gradient: "from-warning to-warning/80"
    },
    {
      icon: TrendingUp,
      title: "Pattern Recognition",
      description: "Advanced analytics identify subtle correlations in lifestyle and environmental data",
      gradient: "from-primary-dark to-accent-dark"
    },
    {
      icon: Shield,
      title: "Preventive Care Focus",
      description: "Shift from reactive treatment to proactive prevention and quality of life improvement",
      gradient: "from-accent-dark to-primary"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-secondary/20 via-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful <span className="text-gradient">Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive AI-driven features designed to predict, prevent, and manage migraines proactively
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="wellness-card h-full group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 mb-6 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-soft`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="mt-4 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-full font-medium">
            <TrendingUp className="w-5 h-5" />
            <span>85% Average Prediction Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;