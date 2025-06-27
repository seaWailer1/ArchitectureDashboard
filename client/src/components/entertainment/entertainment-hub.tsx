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
  MoreVertical,
  Search,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Repeat,
  Plus,
  ChevronRight,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Mobile-Optimized Header */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="container-content py-4 space-y-4">
          {/* Mobile-First Title and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-heading-2 text-refined-heading">Entertainment</h1>
              <p className="text-xs sm:text-body-small text-refined-muted">African music, movies & live events</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-64 focus-aaa rounded-xl text-sm"
                />
              </div>
              <Button variant="ghost" size="sm" className="touch-aaa rounded-xl hover:bg-muted flex-shrink-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
            {entertainmentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 transition-all duration-200 text-xs sm:text-sm ${
                    selectedCategory === category.id
                      ? "gradient-primary text-white hover:opacity-90 shadow-soft"
                      : "hover:bg-muted border border-border"
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Main Content */}
      <ScrollArea className="flex-1">
        <div className="container-content py-4 space-y-6 pb-24">
          {/* Mobile-Optimized Featured Hero */}
          <Card className="card-refined gradient-primary text-white overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="max-w-full">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium tracking-wider">TRENDING NOW</span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-heading-1 mb-2 sm:mb-3 font-bold">
                  Afrobeats Rising
                </h2>
                <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed">
                  Top tracks from Africa's biggest stars. Featuring Burna Boy, Wizkid, and rising talents.
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Button className="bg-white text-black hover:bg-white/90 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 font-semibold shadow-soft flex-1 sm:flex-none">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    <span className="text-sm sm:text-base">Play Now</span>
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl px-4 py-2.5 border border-white/20 flex-1 sm:flex-none">
                    <span className="text-sm sm:text-base">Save</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Optimized Recently Played */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-refined-heading">Recently Played</h2>
              <Button variant="ghost" size="sm" className="text-refined-muted hover:text-foreground hover:bg-muted rounded-xl px-3 sm:px-4">
                <span className="text-xs sm:text-sm">See All</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entertainmentContent.filter(item => item.isPopular).slice(0, 3).map((item) => (
                <Card key={item.id} className="card-refined interactive-hover group cursor-pointer overflow-hidden">
                  <div className="relative aspect-square gradient-secondary rounded-t-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl sm:text-4xl lg:text-5xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button size="sm" className="rounded-full w-10 h-10 sm:w-12 sm:h-12 bg-white text-black hover:bg-white/90 shadow-elevated">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-black/40 text-white hover:bg-black/60">
                        <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                      <div className="flex items-center gap-1 bg-black/20 rounded-full px-2 py-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-xs sm:text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-refined-heading mb-1 sm:mb-2 truncate">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-refined-muted truncate mb-2 sm:mb-3">{item.description}</p>
                    <div className="flex items-center gap-2">
                      {item.isPremium && (
                        <Badge className="gradient-accent text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1">
                          Premium
                        </Badge>
                      )}
                      <span className="text-xs text-refined-muted">{item.duration}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mobile-Optimized Made For You */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-refined-heading">Made For You</h2>
              <Button variant="ghost" size="sm" className="text-refined-muted hover:text-foreground hover:bg-muted rounded-xl px-3 sm:px-4">
                <span className="text-xs sm:text-sm">See All</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {filteredContent.map((item, index) => (
                <div key={item.id} className="group cursor-pointer interactive-hover">
                  <div className="relative aspect-square gradient-accent rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3 shadow-soft">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-1.5 sm:bottom-2 right-1.5 sm:right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button size="sm" className="rounded-full w-8 h-8 sm:w-10 sm:h-10 bg-white text-black hover:bg-white/90 shadow-soft">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      </Button>
                    </div>
                    {item.isPremium && (
                      <div className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2">
                        <Badge className="bg-primary text-white text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                          Pro
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-refined-heading truncate">{item.title}</h3>
                    <p className="text-xs text-refined-muted truncate capitalize">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile-Optimized African Artists */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-refined-heading">African Artists</h2>
              <Button variant="ghost" size="sm" className="text-refined-muted hover:text-foreground hover:bg-muted rounded-xl px-3 sm:px-4">
                <span className="text-xs sm:text-sm">See All</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
              {[
                { name: "Burna Boy", followers: "15M", verified: true },
                { name: "Wizkid", followers: "13M", verified: true },
                { name: "Tiwa Savage", followers: "8M", verified: true },
                { name: "Davido", followers: "11M", verified: true },
                { name: "Yemi Alade", followers: "6M", verified: true },
                { name: "Mr Eazi", followers: "4M", verified: true }
              ].map((artist, index) => (
                <div key={artist.name} className="group cursor-pointer text-center interactive-hover">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto gradient-secondary rounded-full overflow-hidden mb-2 sm:mb-3 shadow-soft">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button size="sm" className="rounded-full w-6 h-6 sm:w-8 sm:h-8 bg-white text-black hover:bg-white/90 shadow-soft">
                        <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                      </Button>
                    </div>
                    {artist.verified && (
                      <div className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-refined-heading truncate">{artist.name}</h3>
                    <p className="text-xs text-refined-muted">{artist.followers}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mobile-Optimized Live Events */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-refined-heading">Live Events</h2>
              <Button variant="ghost" size="sm" className="text-refined-muted hover:text-foreground hover:bg-muted rounded-xl px-3 sm:px-4">
                <span className="text-xs sm:text-sm">See All</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((event, index) => (
                <Card key={event.id} className="card-refined interactive-hover group cursor-pointer overflow-hidden">
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10">
                    <Badge className="bg-destructive text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">LIVE</span>
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                    <div className="mt-6 sm:mt-8">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                        <span className="text-xs sm:text-sm text-refined-muted">{event.date}</span>
                      </div>
                      
                      <h4 className="text-sm sm:text-base font-bold text-refined-heading mb-2 sm:mb-3 truncate">{event.title}</h4>
                      <p className="text-xs sm:text-sm text-refined-muted mb-4 sm:mb-6 truncate flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        {event.location}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <span className="text-lg sm:text-xl font-bold text-refined-heading">{formatCurrency(event.price)}</span>
                          <p className="text-xs text-refined-muted">per ticket</p>
                        </div>
                        <Button
                          className="gradient-primary text-white hover:opacity-90 rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 font-semibold shadow-soft w-full sm:w-auto"
                          onClick={() => handleEventBooking(event)}
                        >
                          <span className="text-sm">Book Now</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Padding for Fixed Player */}
        <div className="h-24"></div>
      </ScrollArea>

      {/* Brand-Consistent Mini Player */}
      <Card className="fixed bottom-20 left-0 right-0 card-refined border-t z-50 rounded-none rounded-t-xl shadow-elevated">
        <div className="container-app">
          {/* Progress Bar */}
          <div className="h-1 bg-muted relative">
            <div className="h-full w-1/3 gradient-primary rounded-full"></div>
          </div>
          
          <CardContent className="spacing-md">
            <div className="flex items-center justify-between">
              {/* Now Playing Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center shadow-soft">
                  <span className="text-lg">🎵</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-body-small font-semibold text-refined-heading truncate">Afrobeats Hits 2025</h4>
                  <p className="text-caption text-refined-muted truncate">Burna Boy, Wizkid & More</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-caption text-refined-muted">2:34</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <span className="text-caption text-refined-muted">4:12</span>
                  </div>
                </div>
              </div>
              
              {/* Playback Controls */}
              <div className="flex items-center gap-2 mx-6">
                <Button variant="ghost" size="sm" className="touch-aaa rounded-xl hover:bg-muted">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button size="sm" className="rounded-full touch-aaa gradient-primary text-white hover:opacity-90 shadow-soft">
                  <Play className="w-5 h-5 fill-current" />
                </Button>
                <Button variant="ghost" size="sm" className="touch-aaa rounded-xl hover:bg-muted">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              {/* Secondary Controls */}
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="touch-aaa rounded-xl hover:bg-muted">
                  <Heart className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="touch-aaa rounded-xl hover:bg-muted">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}