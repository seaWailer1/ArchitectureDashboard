import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Send,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Book
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SupportTicket {
  id: number;
  ticketNumber: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

interface SupportCenterProps {
  onBack: () => void;
}

export default function SupportCenter({ onBack }: SupportCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showNewTicket, setShowNewTicket] = useState(false);

  const { data: tickets = [] } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support/tickets"],
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      await apiRequest("POST", "/api/support/tickets", ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support/tickets"] });
      setShowNewTicket(false);
      toast({
        title: "Ticket Created",
        description: "Your support ticket has been submitted",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Failed to create support ticket",
        variant: "destructive",
      });
    },
  });

  const handleSubmitTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const ticketData = {
      subject: formData.get("subject") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      priority: formData.get("priority") as string,
    };

    createTicketMutation.mutate(ticketData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-accent" />;
      case "open":
        return <AlertCircle className="w-4 h-4 text-primary" />;
      default:
        return <MessageSquare className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-accent/10 text-accent";
      case "open":
        return "bg-primary/10 text-primary";
      default:
        return "bg-neutral-100 text-neutral-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "Go to Security Settings and click 'Change Password' to update your password."
    },
    {
      question: "How do I verify my account?",
      answer: "Complete the KYC process by uploading required documents in your profile settings."
    },
    {
      question: "What are the transaction limits?",
      answer: "Transaction limits vary by account type and verification level. Check your wallet for current limits."
    },
    {
      question: "How do I become a merchant?",
      answer: "Switch to merchant role in your profile and complete the business verification process."
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-bold">Support Center</h2>
          <p className="text-neutral-600">Get help with your account</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto p-4 flex flex-col items-center space-y-2"
          onClick={() => setShowNewTicket(true)}
        >
          <MessageSquare className="w-6 h-6 text-primary" />
          <span className="text-sm font-medium">New Ticket</span>
        </Button>
        
        <Button
          variant="outline"
          className="h-auto p-4 flex flex-col items-center space-y-2"
          onClick={() => toast({ title: "Contact Info", description: "Phone: +1-800-AFRIPAY\nEmail: support@afripay.com" })}
        >
          <Phone className="w-6 h-6 text-success" />
          <span className="text-sm font-medium">Call Support</span>
        </Button>
      </div>

      {/* New Ticket Form */}
      {showNewTicket && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Create Support Ticket</span>
              <Button variant="ghost" size="sm" onClick={() => setShowNewTicket(false)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject</label>
                <Input
                  name="subject"
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="payment">Payment Problems</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="kyc">KYC Verification</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  name="description"
                  placeholder="Please provide detailed information about your issue..."
                  rows={4}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={createTicketMutation.isPending}
                className="w-full"
              >
                {createTicketMutation.isPending ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Support Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-6">
              <MessageSquare className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">No support tickets yet</p>
              <p className="text-sm text-neutral-500">Create a ticket if you need help</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-3 border rounded-lg hover:bg-neutral-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <h4 className="font-medium">{ticket.subject}</h4>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    {ticket.description.substring(0, 100)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-500">
                    <span>#{ticket.ticketNumber}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="w-5 h-5" />
            <span>Frequently Asked Questions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-neutral-100 pb-3 last:border-b-0">
                <h4 className="font-medium text-neutral-900 mb-1">{item.question}</h4>
                <p className="text-sm text-neutral-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-neutral-600">support@afripay.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-neutral-600">+1-800-AFRIPAY (24/7)</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-neutral-600">Available 9 AM - 6 PM (EST)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}