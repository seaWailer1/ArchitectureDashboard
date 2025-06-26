import { useState } from "react";
import { 
  Play, 
  Music, 
  Film, 
  Gamepad2, 
  Tv, 
  Radio, 
  Podcast,
  Ticket,
  Calendar,
  Star,
  Clock,
  Download,
  Share,
  Heart,
  MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface EntertainmentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  duration?: string;
  thumbnail: string;
  isPremium: boolean;
  isPopular?: boolean;
}

export default function EntertainmentHub() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const entertainmentCategories = [
    { id: "all", name: "All", icon: Play },
    { id: "music", name: "Music", icon: Music },
    { id: "movies", name: "Movies", icon: Film },
    { id: "games", name: "Games", icon: Gamepad2 },
    { id: "tv", name: "TV Shows", icon: Tv },
    { id: "radio", name: "Radio", icon: Radio },
    { id: "podcasts", name: "Podcasts", icon: Podcast },
  ];

  const entertainmentContent: EntertainmentItem[] = [
    {
      id: "music1",
      title: "Afrobeats Hits 2025",
      description: "Latest Afrobeats playlist featuring top African artists",
      category: "music",
      price: 4.99,
      rating: 4.8,
      duration: "2h 15m",
      thumbnail: "🎵",
      isPremium: true,
      isPopular: true
    },
    {
      id: "movie1",
      title: "Lagos Stories",
      description: "Award-winning Nollywood drama series",
      category: "movies",
      price: 9.99,
      rating: 4.6,
      duration: "1h 45m",
      thumbnail: "🎬",
      isPremium: true,
      isPopular: true
    },
    {
      id: "game1",
      title: "African Trivia Challenge",
      description: "Test your knowledge of African culture and history",
      category: "games",
      price: 2.99,
      rating: 4.4,
      duration: "Unlimited",
      thumbnail: "🎮",
      isPremium: false
    },
    {
      id: "tv1",
      title: "African Cuisine Masters",
      description: "Cooking show featuring traditional African dishes",
      category: "tv",
      price: 6.99,
      rating: 4.7,
      duration: "30 episodes",
      thumbnail: "📺",
      isPremium: true
    },
    {
      id: "radio1",
      title: "Naija FM Live",
      description: "24/7 Nigerian music and entertainment radio",
      category: "radio",
      price: 0,
      rating: 4.5,
      duration: "Live",
      thumbnail: "📻",
      isPremium: false,
      isPopular: true
    },
    {
      id: "podcast1",
      title: "Tech in Africa",
      description: "Weekly discussions on African tech innovation",
      category: "podcasts",
      price: 3.99,
      rating: 4.9,
      duration: "45m episodes",
      thumbnail: "🎙️",
      isPremium: true
    }
  ];

  const featuredEvents = [
    {
      id: "event1",
      title: "Lagos Music Festival",
      date: "March 15, 2025",
      price: 25.00,
      location: "Victoria Island, Lagos"
    },
    {
      id: "event2", 
      title: "Nollywood Film Premiere",
      date: "March 22, 2025",
      price: 15.00,
      location: "Silverbird Cinemas"
    },
    {
      id: "event3",
      title: "Comedy Night Live",
      date: "March 28, 2025", 
      price: 10.00,
      location: "Terra Kulture Arena"
    }
  ];

  const filteredContent = entertainmentContent.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePurchase = (item: EntertainmentItem) => {
    toast({
      title: "Purchase Started",
      description: `Processing payment for "${item.title}" - $${item.price}`,
    });
  };

  const handleEventBooking = (event: any) => {
    toast({
      title: "Event Booking",
      description: `Booking tickets for "${event.title}" - $${event.price}`,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="container-content spacing-y-lg">
      {/* Header */}
      <div className="text-center spacing-y-md">
        <h1 className="text-heading-1 text-refined-heading">Entertainment Hub</h1>
        <p className="text-body text-refined-muted">Discover African entertainment, music, movies, and events</p>
      </div>

      {/* Search */}
      <div className="spacing-y-sm">
        <Input
          placeholder="Search entertainment content..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-body focus-aaa"
        />
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full elevation-1">
          {entertainmentCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex flex-col items-center gap-1 text-caption"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          {/* Featured Content */}
          <Card className="card-refined elevation-2 brand-primary text-white">
            <CardHeader className="spacing-y-sm">
              <CardTitle className="text-heading-2 flex items-center gap-2">
                <Star className="w-6 h-6" />
                Featured This Week
              </CardTitle>
            </CardHeader>
            <CardContent className="spacing-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entertainmentContent.filter(item => item.isPopular).map((item) => (
                  <div key={item.id} className="bg-white/10 rounded-xl spacing-md backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{item.thumbnail}</div>
                      <div>
                        <h3 className="text-body-large font-semibold">{item.title}</h3>
                        <p className="text-body-small opacity-90">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                        <span className="text-body-small">{item.rating}</span>
                        {item.duration && (
                          <>
                            <Clock className="w-4 h-4 ml-2" />
                            <span className="text-body-small">{item.duration}</span>
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white text-primary hover:bg-white/90"
                        onClick={() => handlePurchase(item)}
                      >
                        {item.price === 0 ? "Play Free" : formatCurrency(item.price)}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContent.map((item) => (
              <Card key={item.id} className="card-refined interactive-hover elevation-1">
                <CardContent className="spacing-md">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl">{item.thumbnail}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-body-large font-semibold text-refined-heading">{item.title}</h3>
                        <div className="flex items-center gap-1">
                          {item.isPremium && (
                            <Badge variant="secondary" className="text-caption">Premium</Badge>
                          )}
                          <Button variant="ghost" size="sm" className="touch-aaa">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-body-small text-refined-muted mb-3">{item.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-body-small">{item.rating}</span>
                        </div>
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            <span className="text-body-small">{item.duration}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="touch-aaa">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="touch-aaa">
                            <Share className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="touch-aaa">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button
                          className="touch-aaa focus-aaa"
                          onClick={() => handlePurchase(item)}
                        >
                          {item.price === 0 ? "Play Free" : formatCurrency(item.price)}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upcoming Events */}
      <Card className="card-refined elevation-2">
        <CardHeader className="spacing-y-sm">
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="spacing-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredEvents.map((event) => (
              <div key={event.id} className="border border-neutral-200 dark:border-neutral-700 rounded-xl spacing-md">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-body-small text-refined-muted">{event.date}</span>
                </div>
                <h4 className="text-body-large font-semibold text-refined-heading mb-2">{event.title}</h4>
                <p className="text-body-small text-refined-muted mb-4">{event.location}</p>
                <div className="flex items-center justify-between">
                  <span className="text-body font-semibold">{formatCurrency(event.price)}</span>
                  <Button
                    size="sm"
                    className="touch-aaa focus-aaa"
                    onClick={() => handleEventBooking(event)}
                  >
                    Book Tickets
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}