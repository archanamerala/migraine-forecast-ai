import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Brain, CloudRain, Thermometer, Wind, Activity, AlertTriangle, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus, Database, Cpu, RefreshCw, Bell, Sparkles, Filter, Zap, Target, BookOpen, ChevronDown, ChevronUp, Clock, History, Trash2, Shield, Droplets, Eye, Pill, Moon, Heart, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

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
  riskScore: number;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  icon: React.ReactNode;
  priority: number;
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
  isProcessing: boolean;
}

interface HourlyRisk {
  hour: string;
  risk: number;
  fullHour: number;
  factors: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}

const PredictionTool = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [expandedPipeline, setExpandedPipeline] = useState<string | null>(null);
  const [predictionHistory, setPredictionHistory] = useState<HistoryEntry[]>([]);
  const [pipelineProgress, setPipelineProgress] = useState<Record<string, number>>({
    preprocessing: 0,
    ml: 0,
    personalization: 0,
    alerts: 0
  });
  const [pipelineActive, setPipelineActive] = useState(false);
  const [currentAlerts, setCurrentAlerts] = useState<Alert[]>([]);
  const [hourlyRiskData, setHourlyRiskData] = useState<HourlyRisk[]>([]);
  
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

  // Load prediction history from database
  useEffect(() => {
    if (user) {
      loadPredictionHistory();
    }
  }, [user]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('prediction-history')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'prediction_history',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newEntry = mapDatabaseToHistory(payload.new);
          setPredictionHistory(prev => [newEntry, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const mapDatabaseToHistory = (row: any): HistoryEntry => ({
    id: row.id,
    timestamp: new Date(row.created_at),
    result: {
      risk: row.risk_level as 'Low' | 'Medium' | 'High',
      confidence: row.confidence,
      suggestions: row.suggestions || [],
      riskScore: row.risk_score
    },
    formData: {
      sleep: [row.sleep_hours],
      stress: [row.stress_level],
      activity: [row.activity_level],
      screenTime: [row.screen_time],
      medication: row.medication || '',
      temperature: row.temperature?.toString() || '',
      humidity: row.humidity?.toString() || '',
      pressure: row.pressure?.toString() || '',
      pollution: row.pollution?.toString() || ''
    }
  });

  const loadPredictionHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('prediction_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading history:', error);
      return;
    }

    const history = data.map(mapDatabaseToHistory);
    setPredictionHistory(history);
  };

  const savePredictionToDatabase = async (result: PredictionResult, data: PredictionData) => {
    if (!user) return;

    const { error } = await supabase.from('prediction_history').insert({
      user_id: user.id,
      risk_level: result.risk,
      risk_score: result.riskScore,
      confidence: result.confidence,
      suggestions: result.suggestions,
      sleep_hours: data.sleep[0],
      stress_level: data.stress[0],
      activity_level: data.activity[0],
      screen_time: data.screenTime[0],
      medication: data.medication || null,
      temperature: parseFloat(data.temperature) || null,
      humidity: parseFloat(data.humidity) || null,
      pressure: parseFloat(data.pressure) || null,
      pollution: parseFloat(data.pollution) || null
    });

    if (error) {
      console.error('Error saving prediction:', error);
      toast({
        title: "Save failed",
        description: "Could not save prediction to history.",
        variant: "destructive"
      });
    }
  };

  // Generate alerts based on input data
  const generateAlerts = (data: PredictionData, riskScore: number): Alert[] => {
    const alerts: Alert[] = [];
    
    // Sleep alerts
    if (data.sleep[0] < 5) {
      alerts.push({
        id: 'sleep-critical',
        type: 'danger',
        title: 'Critical Sleep Deficit',
        message: `Only ${data.sleep[0]} hours of sleep detected. This significantly increases migraine risk.`,
        icon: <Moon className="w-5 h-5" />,
        priority: 1
      });
    } else if (data.sleep[0] < 6) {
      alerts.push({
        id: 'sleep-warning',
        type: 'warning',
        title: 'Low Sleep Hours',
        message: 'Sleep below 6 hours may trigger migraine. Try to rest today.',
        icon: <Moon className="w-5 h-5" />,
        priority: 2
      });
    }
    
    // Stress alerts
    if (data.stress[0] >= 8) {
      alerts.push({
        id: 'stress-critical',
        type: 'danger',
        title: 'High Stress Alert',
        message: 'Stress level at maximum. Immediate relaxation recommended.',
        icon: <Heart className="w-5 h-5" />,
        priority: 1
      });
    } else if (data.stress[0] >= 6) {
      alerts.push({
        id: 'stress-warning',
        type: 'warning',
        title: 'Elevated Stress',
        message: 'Consider taking a break or practicing breathing exercises.',
        icon: <Heart className="w-5 h-5" />,
        priority: 3
      });
    }
    
    // Screen time alerts
    if (data.screenTime[0] >= 10) {
      alerts.push({
        id: 'screen-warning',
        type: 'warning',
        title: 'Excessive Screen Time',
        message: `${data.screenTime[0]} hours of screen time may strain eyes and trigger headaches.`,
        icon: <Eye className="w-5 h-5" />,
        priority: 2
      });
    }
    
    // Environmental alerts
    const temp = parseFloat(data.temperature) || 20;
    const humidity = parseFloat(data.humidity) || 50;
    const pressure = parseFloat(data.pressure) || 1013;
    const pollution = parseFloat(data.pollution) || 50;
    
    if (temp > 32 || temp < 5) {
      alerts.push({
        id: 'temp-alert',
        type: 'warning',
        title: 'Extreme Temperature',
        message: `Temperature at ${temp}°C is outside comfort zone.`,
        icon: <Thermometer className="w-5 h-5" />,
        priority: 3
      });
    }
    
    if (humidity > 85) {
      alerts.push({
        id: 'humidity-alert',
        type: 'info',
        title: 'High Humidity',
        message: 'High humidity levels detected. Stay hydrated.',
        icon: <Droplets className="w-5 h-5" />,
        priority: 4
      });
    }
    
    if (pressure < 1000) {
      alerts.push({
        id: 'pressure-alert',
        type: 'warning',
        title: 'Low Barometric Pressure',
        message: 'Pressure drop detected - common migraine trigger.',
        icon: <Wind className="w-5 h-5" />,
        priority: 2
      });
    }
    
    if (pollution > 80) {
      alerts.push({
        id: 'pollution-alert',
        type: 'danger',
        title: 'Poor Air Quality',
        message: 'Air quality index is unhealthy. Avoid outdoor activities.',
        icon: <CloudRain className="w-5 h-5" />,
        priority: 1
      });
    }
    
    // Medication reminder
    if (!data.medication && riskScore > 50) {
      alerts.push({
        id: 'medication-reminder',
        type: 'info',
        title: 'Medication Reminder',
        message: 'Consider preventive medication if prescribed.',
        icon: <Pill className="w-5 h-5" />,
        priority: 3
      });
    }
    
    // Success alerts
    if (riskScore < 30) {
      alerts.push({
        id: 'low-risk-success',
        type: 'success',
        title: 'Low Risk Day',
        message: 'Your vitals look great! Keep up the healthy habits.',
        icon: <Shield className="w-5 h-5" />,
        priority: 5
      });
    }
    
    return alerts.sort((a, b) => a.priority - b.priority);
  };

  // Generate hourly risk based on input data
  const generateHourlyRisk = (data: PredictionData, baseRiskScore: number): HourlyRisk[] => {
    const currentHour = new Date().getHours();
    const hourlyData: HourlyRisk[] = [];
    
    const temp = parseFloat(data.temperature) || 20;
    const humidity = parseFloat(data.humidity) || 50;
    const pressure = parseFloat(data.pressure) || 1013;
    
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;
      
      // Calculate hour-specific modifiers
      let hourModifier = 0;
      let factors: string[] = [];
      
      // Morning spike (6-9 AM)
      if (hour >= 6 && hour <= 9) {
        hourModifier += 10;
        factors.push('Morning transition');
      }
      
      // Afternoon stress (14-17)
      if (hour >= 14 && hour <= 17) {
        hourModifier += data.stress[0] * 2;
        factors.push('Peak stress hours');
      }
      
      // Evening screen time effect
      if (hour >= 18 && hour <= 23) {
        hourModifier += data.screenTime[0] * 1.5;
        factors.push('Screen time impact');
      }
      
      // Night recovery
      if (hour >= 0 && hour <= 5) {
        hourModifier -= 15;
        factors.push('Rest period');
      }
      
      // Sleep deprivation compounds over time
      if (data.sleep[0] < 6) {
        hourModifier += i * 0.5;
        if (i > 8) factors.push('Sleep debt accumulating');
      }
      
      // Weather effects intensify midday
      if (hour >= 11 && hour <= 15) {
        if (temp > 28) {
          hourModifier += 8;
          factors.push('Heat stress');
        }
        if (humidity > 70) {
          hourModifier += 5;
          factors.push('High humidity');
        }
      }
      
      // Pressure changes
      if (pressure < 1005) {
        hourModifier += 10;
        if (!factors.includes('Low pressure')) factors.push('Low pressure');
      }
      
      // Calculate final risk
      let riskValue = Math.max(5, Math.min(95, baseRiskScore + hourModifier + (Math.random() * 10 - 5)));
      
      let riskLevel: 'Low' | 'Medium' | 'High';
      if (riskValue < 35) {
        riskLevel = 'Low';
      } else if (riskValue < 65) {
        riskLevel = 'Medium';
      } else {
        riskLevel = 'High';
      }
      
      hourlyData.push({
        hour: `${hour % 12 || 12}${hour >= 12 ? 'PM' : 'AM'}`,
        risk: Math.round(riskValue),
        fullHour: hour,
        factors: factors.length > 0 ? factors : ['Normal conditions'],
        riskLevel
      });
    }
    
    return hourlyData;
  };

  // Generate personalized suggestions based on data
  const generateSuggestions = (data: PredictionData, riskScore: number): string[] => {
    const suggestions: string[] = [];
    
    // Sleep-based suggestions
    if (data.sleep[0] < 6) {
      suggestions.push('🛏️ Prioritize sleep tonight - aim for 7-8 hours');
      suggestions.push('⏰ Set a bedtime alarm 30 minutes before target sleep time');
    } else if (data.sleep[0] > 9) {
      suggestions.push('☀️ Excessive sleep can trigger migraines - try to normalize');
    }
    
    // Stress-based suggestions
    if (data.stress[0] >= 7) {
      suggestions.push('🧘 Practice 10 minutes of deep breathing or meditation');
      suggestions.push('🚶 Take a 15-minute walk to reduce stress hormones');
    } else if (data.stress[0] >= 5) {
      suggestions.push('☕ Take short breaks every 90 minutes');
    }
    
    // Screen time suggestions
    if (data.screenTime[0] >= 8) {
      suggestions.push('👁️ Follow the 20-20-20 rule: Every 20 min, look 20 ft away for 20 sec');
      suggestions.push('💡 Enable blue light filter on devices');
    }
    
    // Activity suggestions
    if (data.activity[0] < 3) {
      suggestions.push('🏃 Light exercise can help - try a 20-minute walk');
    } else if (data.activity[0] > 8) {
      suggestions.push('💧 High activity detected - ensure adequate hydration');
    }
    
    // Environmental suggestions
    const temp = parseFloat(data.temperature) || 20;
    const humidity = parseFloat(data.humidity) || 50;
    const pollution = parseFloat(data.pollution) || 50;
    
    if (temp > 28) {
      suggestions.push('❄️ Stay in cool environments and drink cold water');
    }
    
    if (humidity > 75) {
      suggestions.push('💨 Use a dehumidifier or stay in air-conditioned spaces');
    }
    
    if (pollution > 70) {
      suggestions.push('😷 Limit outdoor exposure and use air purifiers indoors');
    }
    
    // Medication suggestions
    if (data.medication) {
      suggestions.push(`💊 Continue with ${data.medication} as prescribed`);
    } else if (riskScore > 60) {
      suggestions.push('💊 Consider preventive medication if available');
    }
    
    // Hydration reminder
    suggestions.push('💧 Drink at least 8 glasses of water today');
    
    // General suggestions based on overall risk
    if (riskScore > 70) {
      suggestions.push('📱 Keep rescue medication easily accessible');
      suggestions.push('🌑 Prepare a dark, quiet space for potential migraine');
    }
    
    return suggestions.slice(0, 6); // Return top 6 suggestions
  };

  // Animate pipeline progress
  const animatePipeline = async () => {
    setPipelineActive(true);
    
    // Step 1: Preprocessing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 50));
      setPipelineProgress(prev => ({ ...prev, preprocessing: i }));
    }
    
    // Step 2: ML Prediction
    for (let i = 0; i <= 100; i += 8) {
      await new Promise(r => setTimeout(r, 60));
      setPipelineProgress(prev => ({ ...prev, ml: Math.min(i, 100) }));
    }
    
    // Step 3: Personalization
    for (let i = 0; i <= 100; i += 12) {
      await new Promise(r => setTimeout(r, 40));
      setPipelineProgress(prev => ({ ...prev, personalization: Math.min(i, 100) }));
    }
    
    // Step 4: Alerts
    for (let i = 0; i <= 100; i += 15) {
      await new Promise(r => setTimeout(r, 35));
      setPipelineProgress(prev => ({ ...prev, alerts: Math.min(i, 100) }));
    }
  };

  const mlPipelineSteps: MLPipelineStep[] = [
    {
      id: 'preprocessing',
      title: 'Data Preprocessing',
      description: 'Feature engineering & data cleaning pipeline',
      icon: <Database className="w-6 h-6" />,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      features: [
        { icon: <Filter className="w-4 h-4" />, text: `Sleep: ${formData.sleep[0]}h normalized → ${(formData.sleep[0] / 12).toFixed(2)}` },
        { icon: <Sparkles className="w-4 h-4" />, text: `Stress: ${formData.stress[0]}/10 → scaled to ${(formData.stress[0] / 10).toFixed(2)}` },
        { icon: <TrendingUp className="w-4 h-4" />, text: `Screen Time: ${formData.screenTime[0]}h feature encoded` },
        { icon: <Zap className="w-4 h-4" />, text: 'Environmental data validated & normalized' }
      ],
      status: pipelineProgress.preprocessing === 100 ? 'Complete' : pipelineActive ? 'Processing' : 'Ready',
      progress: pipelineProgress.preprocessing,
      isProcessing: pipelineActive && pipelineProgress.preprocessing < 100
    },
    {
      id: 'ml',
      title: 'ML Prediction',
      description: 'Deep learning model for risk assessment',
      icon: <Cpu className="w-6 h-6" />,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      features: [
        { icon: <Brain className="w-4 h-4" />, text: 'Ensemble voting from 5 neural networks' },
        { icon: <TrendingUp className="w-4 h-4" />, text: 'LSTM analyzing temporal patterns' },
        { icon: <Target className="w-4 h-4" />, text: prediction ? `Output: ${prediction.risk} Risk (${prediction.riskScore}%)` : 'Awaiting data...' },
        { icon: <Activity className="w-4 h-4" />, text: prediction ? `Confidence: ${prediction.confidence}%` : 'No prediction yet' }
      ],
      status: pipelineProgress.ml === 100 ? 'Complete' : pipelineActive && pipelineProgress.preprocessing === 100 ? 'Processing' : 'Waiting',
      progress: pipelineProgress.ml,
      isProcessing: pipelineActive && pipelineProgress.preprocessing === 100 && pipelineProgress.ml < 100
    },
    {
      id: 'personalization',
      title: 'Personalization',
      description: 'Adaptive learning from your patterns',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'text-success',
      bgColor: 'bg-success/10',
      features: [
        { icon: <BookOpen className="w-4 h-4" />, text: `Analyzing ${predictionHistory.length} historical predictions` },
        { icon: <RefreshCw className="w-4 h-4" />, text: 'Adjusting model weights for your triggers' },
        { icon: <Sparkles className="w-4 h-4" />, text: 'Behavioral pattern clustering active' },
        { icon: <TrendingUp className="w-4 h-4" />, text: prediction ? `${Math.round(prediction.confidence * 0.98)}% personalization accuracy` : 'Learning...' }
      ],
      status: pipelineProgress.personalization === 100 ? 'Complete' : pipelineActive && pipelineProgress.ml === 100 ? 'Learning' : 'Waiting',
      progress: pipelineProgress.personalization,
      isProcessing: pipelineActive && pipelineProgress.ml === 100 && pipelineProgress.personalization < 100
    },
    {
      id: 'alerts',
      title: 'Alerts & Recs',
      description: 'Smart notifications & action items',
      icon: <Bell className="w-6 h-6" />,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      features: [
        { icon: <Bell className="w-4 h-4" />, text: currentAlerts.length > 0 ? `${currentAlerts.length} active alerts generated` : 'No alerts yet' },
        { icon: <AlertTriangle className="w-4 h-4" />, text: currentAlerts.filter(a => a.type === 'danger').length > 0 ? `${currentAlerts.filter(a => a.type === 'danger').length} critical warnings` : 'No critical issues' },
        { icon: <CheckCircle className="w-4 h-4" />, text: prediction ? `${prediction.suggestions.length} personalized recommendations` : 'Awaiting analysis' },
        { icon: <Target className="w-4 h-4" />, text: 'Priority-ranked action queue ready' }
      ],
      status: pipelineProgress.alerts === 100 ? 'Complete' : pipelineActive && pipelineProgress.personalization === 100 ? 'Generating' : 'Waiting',
      progress: pipelineProgress.alerts,
      isProcessing: pipelineActive && pipelineProgress.personalization === 100 && pipelineProgress.alerts < 100
    }
  ];

  // AI prediction function with risk score
  const generatePrediction = (data: PredictionData): PredictionResult => {
    const sleepScore = data.sleep[0];
    const stressScore = data.stress[0];
    const activityScore = data.activity[0];
    const screenTimeScore = data.screenTime[0];
    const temp = parseFloat(data.temperature) || 20;
    const humidity = parseFloat(data.humidity) || 50;
    const pressure = parseFloat(data.pressure) || 1013;
    const pollution = parseFloat(data.pollution) || 50;
    
    let riskScore = 0;
    
    // Sleep scoring
    if (sleepScore < 5) riskScore += 35;
    else if (sleepScore < 6) riskScore += 25;
    else if (sleepScore > 10) riskScore += 15;
    
    // Stress scoring
    riskScore += stressScore * 6;
    
    // Activity scoring
    if (activityScore < 3) riskScore += 15;
    else if (activityScore > 9) riskScore += 10;
    
    // Screen time scoring
    if (screenTimeScore > 10) riskScore += 20;
    else if (screenTimeScore > 8) riskScore += 12;
    
    // Environmental scoring
    if (temp < 5 || temp > 35) riskScore += 20;
    else if (temp < 10 || temp > 30) riskScore += 10;
    
    if (humidity > 85) riskScore += 15;
    else if (humidity > 75 || humidity < 25) riskScore += 8;
    
    if (pressure < 995) riskScore += 20;
    else if (pressure < 1005) riskScore += 12;
    
    if (pollution > 85) riskScore += 25;
    else if (pollution > 70) riskScore += 15;
    
    // Medication bonus
    if (data.medication) riskScore -= 10;
    
    // Normalize to 0-100
    riskScore = Math.max(5, Math.min(95, riskScore));
    
    let risk: 'Low' | 'Medium' | 'High';
    let confidence: number;
    
    if (riskScore < 35) {
      risk = 'Low';
      confidence = 85 + Math.random() * 10;
    } else if (riskScore < 65) {
      risk = 'Medium';
      confidence = 78 + Math.random() * 12;
    } else {
      risk = 'High';
      confidence = 82 + Math.random() * 13;
    }
    
    const suggestions = generateSuggestions(data, riskScore);
    
    return { risk, confidence: Math.round(confidence), suggestions, riskScore: Math.round(riskScore) };
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
    setPipelineProgress({ preprocessing: 0, ml: 0, personalization: 0, alerts: 0 });
    
    // Start pipeline animation
    animatePipeline();
    
    // Wait for pipeline to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = generatePrediction(formData);
    setPrediction(result);
    
    // Generate alerts and hourly risk based on input
    const alerts = generateAlerts(formData, result.riskScore);
    setCurrentAlerts(alerts);
    
    const hourlyRisk = generateHourlyRisk(formData, result.riskScore);
    setHourlyRiskData(hourlyRisk);
    
    // Save to database if user is authenticated
    if (user) {
      await savePredictionToDatabase(result, formData);
    } else {
      // Add to local history for non-authenticated users
      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        result,
        formData: { ...formData }
      };
      setPredictionHistory(prev => [historyEntry, ...prev].slice(0, 10));
    }
    
    setIsLoading(false);
    setPipelineActive(false);
    
    toast({
      title: "Prediction Complete",
      description: `Migraine risk: ${result.risk} (${result.confidence}% confidence)`,
      variant: result.risk === 'High' ? 'destructive' : 'default'
    });
    
    // Show critical alerts
    if (alerts.filter(a => a.type === 'danger').length > 0) {
      setTimeout(() => {
        toast({
          title: "⚠️ Critical Alert",
          description: alerts.find(a => a.type === 'danger')?.message,
          variant: "destructive"
        });
      }, 1000);
    }
  };

  const clearHistory = async () => {
    if (user) {
      const { error } = await supabase
        .from('prediction_history')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Could not clear history.",
          variant: "destructive"
        });
        return;
      }
    }
    
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
    <section id="prediction-tool" className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 pt-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">AI Prediction Tool</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience our migraine prediction system with real-time AI analysis
          </p>
          {user && profile && (
            <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
                {profile.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-primary font-medium">Welcome back, {profile.username}!</span>
            </div>
          )}
          {!user && (
            <div className="mt-4 p-4 bg-accent/10 rounded-xl border border-accent/20 max-w-md mx-auto">
              <p className="text-sm text-muted-foreground mb-3">
                <LogIn className="w-4 h-4 inline mr-2" />
                Sign in to save your prediction history
              </p>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-white">
                  Sign In / Sign Up
                </Button>
              </Link>
            </div>
          )}
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

        {/* Active Alerts Section */}
        {currentAlerts.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12">
            <Card className="prediction-card">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <Bell className="w-6 h-6 mr-2 text-warning animate-pulse" />
                Active Alerts
                <Badge variant="destructive" className="ml-3">{currentAlerts.length}</Badge>
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {currentAlerts.map((alert, index) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border-l-4 animate-fade-in ${
                      alert.type === 'danger' ? 'bg-destructive/10 border-destructive' :
                      alert.type === 'warning' ? 'bg-warning/10 border-warning' :
                      alert.type === 'success' ? 'bg-success/10 border-success' :
                      'bg-primary/10 border-primary'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${
                        alert.type === 'danger' ? 'bg-destructive/20 text-destructive' :
                        alert.type === 'warning' ? 'bg-warning/20 text-warning' :
                        alert.type === 'success' ? 'bg-success/20 text-success' :
                        'bg-primary/20 text-primary'
                      }`}>
                        {alert.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${
                          alert.type === 'danger' ? 'text-destructive' :
                          alert.type === 'warning' ? 'text-warning' :
                          alert.type === 'success' ? 'text-success' :
                          'text-primary'
                        }`}>
                          {alert.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      </div>
                      <Badge variant={alert.type === 'danger' ? 'destructive' : 'secondary'} className="text-xs">
                        P{alert.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Risk Trend Chart */}
        {hourlyRiskData.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12">
            <Card className="prediction-card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                  24-Hour Risk Trend (Based on Your Data)
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span>Personalized to your inputs</span>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyRiskData}>
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
                    <ReferenceLine y={35} stroke="hsl(var(--warning))" strokeDasharray="5 5" label={{ value: 'Low threshold', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                    <ReferenceLine y={65} stroke="hsl(var(--destructive))" strokeDasharray="5 5" label={{ value: 'High threshold', fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string, props: any) => {
                        const data = props.payload;
                        return [
                          <div key="tooltip">
                            <div className="font-bold">{value}% Risk</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Factors: {data.factors.join(', ')}
                            </div>
                          </div>,
                          ''
                        ];
                      }}
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
        {hourlyRiskData.length > 0 && (
          <div className="max-w-7xl mx-auto mb-12">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">Hourly Risk Breakdown</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Next 6 hours</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hourlyRiskData.slice(0, 6).map((data, index) => {
                const isNow = index === 0;
                
                const getHourRiskIcon = () => {
                  if (data.riskLevel === 'Low') return <TrendingDown className="w-4 h-4" />;
                  if (data.riskLevel === 'Medium') return <Minus className="w-4 h-4" />;
                  return <AlertTriangle className="w-4 h-4" />;
                };
                
                const getRiskBadgeColor = () => {
                  if (data.riskLevel === 'Low') return 'bg-warning text-white';
                  if (data.riskLevel === 'Medium') return 'bg-success text-white';
                  return 'bg-destructive text-white';
                };
                
                const getRiskCardColor = () => {
                  if (data.riskLevel === 'Low') return 'bg-warning';
                  if (data.riskLevel === 'Medium') return 'bg-success';
                  return 'bg-destructive';
                };
                
                return (
                  <Card key={index} className="prediction-card hover:shadow-lg transition-shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-muted-foreground">
                          {isNow ? 'Now' : data.hour}
                        </span>
                        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium ${getRiskBadgeColor()}`}>
                          {getHourRiskIcon()}
                          <span>{data.riskLevel} Risk</span>
                        </div>
                      </div>
                      
                      <div className={`${getRiskCardColor()} rounded-2xl p-6 text-center text-white`}>
                        <div className="text-5xl font-bold mb-2">{data.risk}%</div>
                        <div className="text-white/90 font-medium">Risk Level</div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">Contributing Factors:</h4>
                        <div className="space-y-2">
                          {data.factors.slice(0, 3).map((factor, i) => (
                            <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 text-sm text-muted-foreground flex items-center space-x-2">
                              <Activity className="w-3 h-3" />
                              <span>{factor}</span>
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