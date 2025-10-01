import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, CloudRain, Thermometer, Wind, Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PredictionData {
  sleep: number[];
  stress: number[];
  activity: number[];
  temperature: string;
  humidity: string;
  pressure: string;
  pollution: string;
}

interface PredictionResult {
  risk: 'Low' | 'Medium' | 'High';
  confidence: number;
  suggestions: string[];
}

const PredictionTool = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [formData, setFormData] = useState<PredictionData>({
    sleep: [7],
    stress: [3],
    activity: [5],
    temperature: '',
    humidity: '',
    pressure: '',
    pollution: ''
  });

  // Mock AI prediction function
  const generatePrediction = (data: PredictionData): PredictionResult => {
    const sleepScore = data.sleep[0];
    const stressScore = data.stress[0];
    const activityScore = data.activity[0];
    const temp = parseFloat(data.temperature) || 20;
    const humidity = parseFloat(data.humidity) || 50;
    const pressure = parseFloat(data.pressure) || 1013;
    const pollution = parseFloat(data.pollution) || 50;
    
    // Simple risk calculation algorithm
    let riskScore = 0;
    
    // Sleep factor (optimal around 7-8 hours)
    if (sleepScore < 6 || sleepScore > 9) riskScore += 30;
    else if (sleepScore < 5 || sleepScore > 10) riskScore += 50;
    
    // Stress factor (high stress increases risk)
    riskScore += stressScore * 10;
    
    // Activity factor (very low or very high activity)
    if (activityScore < 3 || activityScore > 8) riskScore += 20;
    
    // Weather factors
    if (temp < 10 || temp > 30) riskScore += 15;
    if (humidity > 80 || humidity < 30) riskScore += 10;
    if (pressure < 1000 || pressure > 1025) riskScore += 15;
    if (pollution > 75) riskScore += 20;
    
    // Determine risk level
    let risk: 'Low' | 'Medium' | 'High';
    let confidence: number;
    let suggestions: string[];
    
    if (riskScore < 30) {
      risk = 'Low';
      confidence = 85 + Math.random() * 10;
      suggestions = [
        "Continue your current healthy routine",
        "Stay hydrated throughout the day", 
        "Maintain regular sleep schedule"
      ];
    } else if (riskScore < 70) {
      risk = 'Medium';
      confidence = 75 + Math.random() * 15;
      suggestions = [
        "Ensure adequate hydration - drink water regularly",
        "Consider a 10-minute relaxation break",
        "Dim bright lights if possible",
        "Avoid known dietary triggers"
      ];
    } else {
      risk = 'High';
      confidence = 80 + Math.random() * 15;
      suggestions = [
        "Take preventive medication if prescribed",
        "Rest in a quiet, dark room",
        "Apply cold compress to forehead",
        "Avoid strenuous activities",
        "Consider canceling non-essential appointments"
      ];
    }
    
    return { risk, confidence: Math.round(confidence), suggestions };
  };

  const handlePredict = async () => {
    // Validate form
    if (!formData.temperature || !formData.humidity || !formData.pressure || !formData.pollution) {
      toast({
        title: "Missing Information",
        description: "Please fill in all environmental data fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = generatePrediction(formData);
    setPrediction(result);
    setIsLoading(false);
    
    toast({
      title: "Prediction Complete",
      description: `Migraine risk: ${result.risk} (${result.confidence}% confidence)`,
      variant: result.risk === 'High' ? 'destructive' : 'default'
    });
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'text-warning';
      case 'Medium': return 'text-success';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch(risk) {
      case 'Low': return <CheckCircle className="w-8 h-8 text-warning" />;
      case 'Medium': return <AlertTriangle className="w-8 h-8 text-success" />;
      case 'High': return <XCircle className="w-8 h-8 text-destructive" />;
      default: return null;
    }
  };

  return (
    <section id="prediction-tool" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">AI Prediction Tool</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our migraine prediction system with real-time AI analysis
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Input Form */}
          <Card className="prediction-card">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary" />
              Input Your Data
            </h3>
            
            <div className="space-y-8">
              {/* Lifestyle Data */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-primary">Lifestyle Factors</h4>
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Sleep Hours: {formData.sleep[0]}h
                  </Label>
                  <Slider
                    value={formData.sleep}
                    onValueChange={(value) => setFormData({...formData, sleep: value})}
                    max={12}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Stress Level: {formData.stress[0]}/10
                  </Label>
                  <Slider
                    value={formData.stress}
                    onValueChange={(value) => setFormData({...formData, stress: value})}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Physical Activity: {formData.activity[0]}/10
                  </Label>
                  <Slider
                    value={formData.activity}
                    onValueChange={(value) => setFormData({...formData, activity: value})}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Environmental Data */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-accent">Environmental Factors</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Thermometer className="w-4 h-4 mr-2" />
                      Temperature (°C)
                    </Label>
                    <Input
                      type="number"
                      placeholder="20"
                      value={formData.temperature}
                      onChange={(e) => setFormData({...formData, temperature: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <CloudRain className="w-4 h-4 mr-2" />
                      Humidity (%)
                    </Label>
                    <Input
                      type="number"
                      placeholder="65"
                      value={formData.humidity}
                      onChange={(e) => setFormData({...formData, humidity: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Wind className="w-4 h-4 mr-2" />
                      Air Pressure (hPa)
                    </Label>
                    <Input
                      type="number"
                      placeholder="1013"
                      value={formData.pressure}
                      onChange={(e) => setFormData({...formData, pressure: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Air Quality Index
                    </Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={formData.pollution}
                      onChange={(e) => setFormData({...formData, pollution: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handlePredict}
                disabled={isLoading}
                className="btn-prediction w-full"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing...
                  </div>
                ) : (
                  "Predict Migraine Risk"
                )}
              </Button>
            </div>
          </Card>
          
          {/* Results */}
          <Card className="prediction-card">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-accent" />
              Prediction Results
            </h3>
            
            {prediction ? (
              <div className="space-y-6">
                {/* Risk Level */}
                <div className="text-center p-6 bg-gradient-to-r from-white/50 to-white/30 rounded-2xl border border-primary/10">
                  <div className="flex justify-center mb-4">
                    {getRiskIcon(prediction.risk)}
                  </div>
                  <h4 className="text-3xl font-bold mb-2">
                    <span className={getRiskColor(prediction.risk)}>
                      {prediction.risk} Risk
                    </span>
                  </h4>
                  <p className="text-muted-foreground">
                    {prediction.confidence}% Confidence
                  </p>
                  <div className="w-full bg-muted rounded-full h-2 mt-4">
                    <div 
                      className={`h-2 rounded-full ${
                        prediction.risk === 'Low' ? 'bg-warning' :
                        prediction.risk === 'Medium' ? 'bg-success' : 'bg-destructive'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
                
                {/* Suggestions */}
                <div>
                  <h5 className="text-lg font-semibold mb-4 text-primary">Personalized Suggestions:</h5>
                  <div className="space-y-3">
                    {prediction.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter your data and click "Predict" to see your migraine risk forecast
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* 24 Hours Risk Forecast */}
        {prediction && (
          <div className="mt-12 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">24-Hour Risk Forecast</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Live Updates</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => {
                const currentHour = new Date().getHours();
                const hour = (currentHour + index) % 24;
                const isNow = index === 0;
                
                // Generate varying risk levels
                const riskFactor = Math.abs(hour - 14) / 10 + Math.random() * 0.4;
                let hourRisk: 'Low' | 'Medium' | 'High';
                let riskPercentage: number;
                let keyFactors: string[];
                
                if (riskFactor < 0.45) {
                  hourRisk = 'Low';
                  riskPercentage = 15 + Math.floor(Math.random() * 25);
                  keyFactors = ['Good sleep', 'Low stress', 'Optimal weather'];
                } else if (riskFactor < 0.75) {
                  hourRisk = 'Medium';
                  riskPercentage = 35 + Math.floor(Math.random() * 25);
                  keyFactors = ['Low sleep', 'High humidity', 'Barometric change'];
                } else {
                  hourRisk = 'High';
                  riskPercentage = 65 + Math.floor(Math.random() * 25);
                  keyFactors = ['Stress spike', 'Barometric change', 'Bright light', 'Peak stress'];
                }
                
                const getRiskIcon = () => {
                  if (hourRisk === 'Low') return <TrendingDown className="w-4 h-4" />;
                  if (hourRisk === 'Medium') return <Minus className="w-4 h-4" />;
                  return <AlertTriangle className="w-4 h-4" />;
                };
                
                const getRiskBadgeColor = () => {
                  if (hourRisk === 'Low') return 'bg-warning text-white';
                  if (hourRisk === 'Medium') return 'bg-success text-white';
                  return 'bg-destructive text-white';
                };
                
                const getRiskCardColor = () => {
                  if (hourRisk === 'Low') return 'bg-warning';
                  if (hourRisk === 'Medium') return 'bg-success';
                  return 'bg-destructive';
                };
                
                return (
                  <Card key={index} className="prediction-card hover:shadow-lg transition-shadow">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {isNow ? 'Now' : `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`}
                        </span>
                        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getRiskBadgeColor()}`}>
                          {getRiskIcon()}
                          <span>{hourRisk} Risk</span>
                        </div>
                      </div>
                      
                      {/* Risk Percentage Card */}
                      <div className={`${getRiskCardColor()} rounded-2xl p-6 text-center text-white`}>
                        <div className="text-5xl font-bold mb-2">{riskPercentage}%</div>
                        <div className="text-white/90 font-medium">Risk Level</div>
                      </div>
                      
                      {/* Key Factors */}
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Key Factors:</h4>
                        <div className="space-y-2">
                          {keyFactors.slice(0, 2).map((factor, i) => (
                            <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>Note:</strong> This is a demonstration of our AI prediction system. 
            In the full version, predictions are based on comprehensive machine learning models 
            trained on extensive migraine and lifestyle datasets.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PredictionTool;