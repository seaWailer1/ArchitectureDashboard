import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Phone, Search, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  lastSent: string;
}

export default function SendMoneyIndex() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sendMethod, setSendMethod] = useState('phone');

  // Mock recent contacts
  const recentContacts: Contact[] = [
    { id: 1, name: "Amara Okafor", phone: "+234 901 234 5678", avatar: "AO", lastSent: "2 days ago" },
    { id: 2, name: "Kwame Asante", phone: "+233 244 567 890", avatar: "KA", lastSent: "1 week ago" },
    { id: 3, name: "Fatima Hassan", phone: "+221 77 123 4567", avatar: "FH", lastSent: "3 days ago" },
    { id: 4, name: "Joseph Mbeki", phone: "+27 82 345 6789", avatar: "JM", lastSent: "5 days ago" },
  ];

  const filteredContacts = recentContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleContactSelect = (contact: Contact) => {
    navigate(`/send-money/amount?recipient=${encodeURIComponent(contact.name)}&phone=${encodeURIComponent(contact.phone)}`);
  };

  const handleManualEntry = () => {
    navigate('/send-money/manual-entry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b px-4 py-4">
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/services')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Send Money</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Choose recipient</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Send Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Send Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={sendMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => setSendMethod('phone')}
                className="flex items-center space-x-2 h-12"
              >
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </Button>
              <Button
                variant={sendMethod === 'contact' ? 'default' : 'outline'}
                onClick={() => setSendMethod('contact')}
                className="flex items-center space-x-2 h-12"
              >
                <User className="w-4 h-4" />
                <span>From Contacts</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {sendMethod === 'phone' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Enter Phone Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  className="text-lg h-12"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Enter the recipient's phone number
                </p>
              </div>
              <Button 
                onClick={handleManualEntry}
                className="w-full h-12"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {sendMethod === 'contact' && (
          <>
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Recent Transfers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">{contact.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {contact.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {contact.lastSent}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">No contacts found</p>
                    <Button 
                      variant="outline" 
                      onClick={handleManualEntry}
                      className="mt-4"
                    >
                      Enter Phone Number Instead
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}