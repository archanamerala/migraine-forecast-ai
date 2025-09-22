import { Brain, Cloud, Heart, Smartphone, TrendingUp, Users } from "lucide-react";

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
                className="wellness-card text-center group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
      </div>
    </section>
  );
};

export default AboutSection;