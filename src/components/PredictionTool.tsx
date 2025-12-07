import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Brain, CloudRain, Thermometer, Wind, Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus, Database, Cpu, RefreshCw, Bell, Sparkles, Filter, Zap, Target, BookOpen, ChevronDown, ChevronUp, Clock, History, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface PredictionData {
  sleep: number[];
  stress: number[];
  activity: number[];
  screenTime: number[];
  medication: string;
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

interface HistoryEntry {
  id: string;
  timestamp: Date;
  result: PredictionResult;
  formData: PredictionData;
}

interface MLPipelineStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  features: { icon: React.ReactNode; text: string }[];
  status: string;
  progress: number;
}

const PredictionTool = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [expandedPipeline, setExpandedPipeline] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<HistoryEntry[]>([]);
  const [formData, setFormData] = useState<PredictionData>({
    sleep: [7],
    stress: [3],
    activity: [5],
    screenTime: [4],
    medication: '',
    temperature: '',
    humidity: '',
    pressure: '',
    pollution: ''
  });

  // Generate 24-hour forecast data for chart
  const forecastData = useMemo(() => {
    const currentHour = new Date().getHours();
    return Array.from({ length: 24 }).map((_, index) => {
      const hour = (currentHour + index) % 24;
      const riskFactor = Math.abs(hour - 14) / 10 + Math.sin(index * 0.5) * 0.2;
      let riskPercentage: number;
      
      if (riskFactor < 0.4) {
        riskPercentage = 15 + Math.floor(Math.random() * 20);
      } else if (riskFactor < 0.7) {
        riskPercentage = 35 + Math.floor(Math.random() * 25);
      } else {
        riskPercentage = 65 + Math.floor(Math.random() * 25);
      }
      
      return {
        hour: `${hour % 12 || 12}${hour >= 12 ? 'PM' : 'AM'}`,
        risk: Math.min(riskPercentage, 95),
        fullHour: hour
      };
    });
  }, [prediction]);

  const mlPipelineSteps: MLPipelineStep[] = [
    {
      id: 'preprocessing',
      title: 'Data Preprocessing',
      description: 'Feature engineering & data cleaning pipeline',
      icon: <Database className="w-6 h-6" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      features: [
        { icon: <Filter className="w-4 h-4" />, text: 'Missing value imputation using KNN algorithm' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Min-max feature normalization (0-1 scale)' },
        { icon: <TrendingUp className="w-4 h-4" />, text: 'Time-series lag feature encoding' },
        { icon: <Zap className="w-4 h-4" />, text: 'Z-score outlier detection & removal' }
      ],
      status: 'Complete',
      progress: 100
    },
    {
      id: 'ml',
      title: 'ML Prediction',
      description: 'Deep learning model for risk assessment',
      icon: <Cpu className="w-6 h-6" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      features: [
        { icon: <Brain className="w-4 h-4" />, text: 'Ensemble of 5 neural networks (voting)' },
        { icon: <TrendingUp className="w-4 h-4" />, text: 'LSTM for 72-hour temporal patterns' },
        { icon: <Target className="w-4 h-4" />, text: '92.3% cross-validated accuracy' },
        { icon: <Activity className="w-4 h-4" />, text: '<100ms inference latency' }
      ],
      status: 'Active',
      progress: 85
    },
    {
      id: 'personalization',
      title: 'Personalization',
      description: 'Adaptive learning from your patterns',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      features: [
        { icon: <BookOpen className="w-4 h-4" />, text: 'Individual trigger sensitivity mapping' },
        { icon: <RefreshCw className="w-4 h-4" />, text: 'Weekly model fine-tuning cycles' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Behavioral pattern clustering' },
        { icon: <TrendingUp className="w-4 h-4" />, text: 'Accuracy improvement tracking' }
      ],
      status: 'Learning',
      progress: 67
    },
    {
      id: 'alerts',
      title: 'Alerts & Recs',
      description: 'Smart notifications & action items',
      icon: <Bell className="w-6 h-6" />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      features: [
        { icon: <Bell className="w-4 h-4" />, text: 'Configurable push notification rules' },
        { icon: <AlertTriangle className="w-4 h-4" />, text: '2-hour advance warning system' },
        { icon: <CheckCircle className="w-4 h-4" />, text: 'Evidence-based preventive actions' },
        { icon: <Target className="w-4 h-4" />, text: 'Priority-ranked action queue' }
      ],
      status: 'Enabled',
      progress: 100
    }
  ];

  // Mock AI prediction function
  const generatePrediction = (data: PredictionData): PredictionResult => {
    const sleepScore = data.sleep[0];
    const stressScore = data.stress[0];
    const activityScore = data.activity[0];
    const temp = parseFloat(data.temperature) || 20;
    const humidity = parseFloat(data.humidity) || 50;
    const pressure = parseFloat(data.pressure) || 1013;
    const pollution = parseFloat(data.pollution) || 50;
    
    let riskScore = 0;
    
    if (sleepScore < 6 || sleepScore > 9) riskScore += 30;
    else if (sleepScore < 5 || sleepScore > 10) riskScore += 50;
    
    riskScore += stressScore * 10;
    
    if (activityScore < 3 || activityScore > 8) riskScore += 20;
    
    if (temp < 10 || temp > 30) riskScore += 15;
    if (humidity > 80 || humidity < 30) riskScore += 10;
    if (pressure < 1000 || pressure > 1025) riskScore += 15;
    if (pollution > 75) riskScore += 20;
    
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
    if (!formData.temperature || !formData.humidity || !formData.pressure || !formData.pollution) {
      toast({
        title: "Missing Information",
        description: "Please fill in all environmental data fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = generatePrediction(formData);
    setPrediction(result);
    
    // Add to history
    const historyEntry: HistoryEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      result,
      formData: { ...formData }
    };
    setPredictionHistory(prev => [historyEntry, ...prev].slice(0, 10));
    
    setIsLoading(false);
    
    toast({
      title: "Prediction Complete",
      description: `Migraine risk: ${result.risk} (${result.confidence}% confidence)`,
      variant: result.risk === 'High' ? 'destructive' : 'default'
    });
  };

  const clearHistory = () => {
    setPredictionHistory([]);
    toast({
      title: "History Cleared",
      description: "All prediction history has been removed."
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

  const togglePipeline = (id: string) => {
    setExpandedPipeline(expandedPipeline === id ? null : id);
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
        
        {/* Input Form - Lifestyle & Environmental Side by Side */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="prediction-card">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary" />
              Input Your Data
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Lifestyle Factors */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-primary flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Lifestyle Factors
                </h4>
                
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
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Screen Time: {formData.screenTime[0]}h
                  </Label>
                  <Slider
                    value={formData.screenTime}
                    onValueChange={(value) => setFormData({...formData, screenTime: value})}
                    max={16}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    Medication Taken
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., Ibuprofen, Sumatriptan"
                    value={formData.medication}
                    onChange={(e) => setFormData({...formData, medication: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Environmental Factors */}
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-accent flex items-center">
                  <CloudRain className="w-5 h-5 mr-2" />
                  Environmental Factors
                </h4>
                
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
              className="btn-prediction w-full mt-8"
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
          </Card>
        </div>

        {/* Interactive ML Pipeline */}
        <div className="max-w-7xl mx-auto mb-12">
          <h3 className="text-2xl font-bold mb-6 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-primary" />
            ML Pipeline
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mlPipelineSteps.map((step) => (
              <Card 
                key={step.id}
                className={`prediction-card cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  expandedPipeline === step.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => togglePipeline(step.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${step.bgColor}`}>
                        <span className={step.color}>{step.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    {expandedPipeline === step.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={step.color}>{step.status}</span>
                    </div>
                    <Progress value={step.progress} className="h-2" />
                  </div>
                  
                  {/* Expanded Content */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedPipeline === step.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-4 border-t border-border space-y-3">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-sm animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                          <span className={step.color}>{feature.icon}</span>
                          <span className="text-muted-foreground">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Prediction Results */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="prediction-card">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-accent" />
              Prediction Results
            </h3>
            
            {prediction ? (
              <div className="space-y-6">
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
                      className={`h-2 rounded-full transition-all duration-500 ${
                        prediction.risk === 'Low' ? 'bg-warning' :
                        prediction.risk === 'Medium' ? 'bg-success' : 'bg-destructive'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <h5 className="text-lg font-semibold mb-4 text-primary">Personalized Suggestions:</h5>
                  <div className="grid md:grid-cols-2 gap-3">
                    {prediction.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-white/30 rounded-lg animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
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

        {/* Risk Trend Chart */}
        {prediction && (
          <div className="max-w-7xl mx-auto mb-12">
            <Card className="prediction-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                  24-Hour Risk Trend
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Live Updates</span>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={forecastData}>
                    <defs>
                      <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="hour" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`${value}%`, 'Risk Level']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      fill="url(#riskGradient)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Risk Level Legend */}
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span className="text-sm text-muted-foreground">Low (0-35%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">Medium (36-65%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span className="text-sm text-muted-foreground">High (66-100%)</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* 24 Hours Risk Forecast Cards */}
        {prediction && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">24-Hour Risk Forecast</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Updated just now</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forecastData.slice(0, 6).map((data, index) => {
                const isNow = index === 0;
                let hourRisk: 'Low' | 'Medium' | 'High';
                
                if (data.risk < 35) hourRisk = 'Low';
                else if (data.risk < 65) hourRisk = 'Medium';
                else hourRisk = 'High';
                
                const getHourRiskIcon = () => {
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
                
                const keyFactors = hourRisk === 'Low' 
                  ? ['Good sleep', 'Low stress'] 
                  : hourRisk === 'Medium' 
                  ? ['Low sleep', 'High humidity']
                  : ['Stress spike', 'Barometric change'];
                
                return (
                  <Card key={index} className="prediction-card hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {isNow ? 'Now' : data.hour}
                        </span>
                        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getRiskBadgeColor()}`}>
                          {getHourRiskIcon()}
                          <span>{hourRisk} Risk</span>
                        </div>
                      </div>
                      
                      <div className={`${getRiskCardColor()} rounded-2xl p-6 text-center text-white`}>
                        <div className="text-5xl font-bold mb-2">{data.risk}%</div>
                        <div className="text-white/90 font-medium">Risk Level</div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Key Factors:</h4>
                        <div className="space-y-2">
                          {keyFactors.map((factor, i) => (
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

        {/* Prediction History */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="prediction-card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <History className="w-6 h-6 mr-2 text-accent" />
                Prediction History
              </h3>
              {predictionHistory.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
            
            {predictionHistory.length > 0 ? (
              <div className="space-y-4">
                {predictionHistory.map((entry, index) => (
                  <div 
                    key={entry.id} 
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        entry.result.risk === 'Low' ? 'bg-warning/20' :
                        entry.result.risk === 'Medium' ? 'bg-success/20' : 'bg-destructive/20'
                      }`}>
                        {entry.result.risk === 'Low' ? (
                          <CheckCircle className="w-5 h-5 text-warning" />
                        ) : entry.result.risk === 'Medium' ? (
                          <AlertTriangle className="w-5 h-5 text-success" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getRiskColor(entry.result.risk)}`}>
                            {entry.result.risk} Risk
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ({entry.result.confidence}% confidence)
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{entry.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Sleep: {entry.formData.sleep[0]}h | Stress: {entry.formData.stress[0]}/10</div>
                      <div>Temp: {entry.formData.temperature}°C | Humidity: {entry.formData.humidity}%</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No predictions yet. Make your first prediction to start tracking history.
                </p>
              </div>
            )}
          </Card>
        </div>
        
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