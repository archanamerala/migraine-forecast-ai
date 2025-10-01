import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, User, MessageCircle, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for your interest. We'll get back to you soon.",
    });
    
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-secondary/30 via-background to-primary/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get <span className="text-gradient">In Touch</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Interested in our AI migraine prediction system? We'd love to hear from you
          </p>
        </div>

        {/* Contact Details */}
        <div className="wellness-card max-w-4xl mx-auto mb-12 p-8">
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
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card className="prediction-card">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Mail className="w-6 h-6 mr-2 text-primary" />
              Send us a Message
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your interest in our migraine prediction system..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full resize-none"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="btn-prediction w-full"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
          
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="wellness-card">
              <h4 className="text-xl font-semibold mb-4 text-primary">Project Information</h4>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>Project:</strong> AI-Powered Prediction of Migraine Attacks</p>
                <p><strong>Focus:</strong> Lifestyle and Weather Data Integration</p>
                <p><strong>Technology:</strong> Machine Learning, Neural Networks, IoT</p>
                <p><strong>Approach:</strong> Proactive Healthcare & Prevention</p>
              </div>
            </Card>
            
            <Card className="wellness-card">
              <h4 className="text-xl font-semibold mb-4 text-accent">Research Areas</h4>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  <span>Neurological Pattern Recognition</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  <span>Environmental Health Correlation</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-3" />
                  <span>Personalized Medicine Algorithms</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-warning rounded-full mr-3" />
                  <span>Preventive Healthcare Systems</span>
                </div>
              </div>
            </Card>
            
            <Card className="wellness-card">
              <h4 className="text-xl font-semibold mb-4 text-success">Collaboration</h4>
              <p className="text-muted-foreground mb-4">
                We welcome collaboration with:
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Healthcare researchers and neurologists</p>
                <p>• AI/ML engineers and data scientists</p>
                <p>• Medical device and IoT developers</p>
                <p>• Healthcare institutions and clinics</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;