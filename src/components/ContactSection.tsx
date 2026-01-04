import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, User, MessageCircle, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
const ContactSection = () => {
  const {
    toast
  } = useToast();
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
      description: "Thank you for your interest. We'll get back to you soon."
    });
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setIsSubmitting(false);
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  return <section id="contact" className="py-20 bg-gradient-to-br from-secondary/30 via-background to-primary/5">
      
    </section>;
};
export default ContactSection;