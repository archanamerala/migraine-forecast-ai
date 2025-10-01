import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Brain, CloudRain, Thermometer, Wind, Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
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
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch(risk) {
      case 'Low': return <CheckCircle className="w-8 h-8 text-success" />;
      case 'Medium': return <AlertTriangle className="w-8 h-8 text-warning" />;
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
                        prediction.risk === 'Low' ? 'bg-success' :
                        prediction.risk === 'Medium' ? 'bg-warning' : 'bg-destructive'
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
          <Card className="prediction-card mt-12 max-w-6xl mx-auto">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-primary" />
              24-Hour Risk Forecast
            </h3>
            
            <div className="space-y-4">
              <p className="text-muted-foreground mb-6">
                Predicted migraine risk levels throughout the day based on current conditions
              </p>
              
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
                {Array.from({ length: 24 }).map((_, hour) => {
                  // Generate varying risk levels for demonstration
                  const currentHour = new Date().getHours();
                  let hourRisk: 'Low' | 'Medium' | 'High';
                  
                  // Pattern: risk increases towards evening, peaks around stress hours
                  const riskFactor = Math.abs(hour - 14) / 10 + Math.random() * 0.3;
                  
                  if (riskFactor < 0.5) hourRisk = 'Low';
                  else if (riskFactor < 0.8) hourRisk = 'Medium';
                  else hourRisk = 'High';
                  
                  const isCurrentHour = hour === currentHour;
                  
                  return (
                    <div 
                      key={hour}
                      className={`flex flex-col items-center space-y-2 p-2 rounded-lg transition-all ${
                        isCurrentHour ? 'bg-primary/10 ring-2 ring-primary' : 'bg-white/30'
                      }`}
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {hour.toString().padStart(2, '0')}:00
                      </span>
                      <div 
                        className={`w-full h-16 rounded-lg ${
                          hourRisk === 'Low' ? 'bg-success' :
                          hourRisk === 'Medium' ? 'bg-warning' : 'bg-destructive'
                        } opacity-80 hover:opacity-100 transition-opacity`}
                        title={`${hourRisk} Risk`}
                      />
                      <span className="text-xs font-semibold">
                        {hourRisk}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-success" />
                  <span className="text-sm text-muted-foreground">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-warning" />
                  <span className="text-sm text-muted-foreground">Medium Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-destructive" />
                  <span className="text-sm text-muted-foreground">High Risk</span>
                </div>
              </div>
            </div>
          </Card>
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