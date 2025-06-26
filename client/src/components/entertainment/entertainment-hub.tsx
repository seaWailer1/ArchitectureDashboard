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
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black">
      {/* Sleek Header */}
      <div className="sticky top-16 z-40 bg-black/95 backdrop-blur-3xl border-b border-white/5">
        <div className="container-content py-5 space-y-4">
          {/* Title and Search */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Entertainment</h1>
              <p className="text-white/50 text-xs mt-0.5">African music & events</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-white/5 border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:bg-white/10 focus:border-white/20 focus:ring-0"
                />
              </div>
              <Button variant="ghost" size="sm" className="w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Refined Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {entertainmentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs transition-all ${
                    selectedCategory === category.id
                      ? "bg-white text-black hover:bg-white/90"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="container-content py-6 space-y-8">
          {/* Hero Banner */}
          <section className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-xs font-medium tracking-wide">TRENDING</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                  Afrobeats Rising
                </h2>
                <p className="text-white/80 text-sm mb-4 leading-relaxed">
                  Top tracks from Africa's stars
                </p>
                <div className="flex items-center gap-3">
                  <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 py-2 text-sm font-medium">
                    <Play className="w-3 h-3 mr-1.5 fill-current" />
                    Play
                  </Button>
                  <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full px-4 py-2 text-sm">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Recently Played */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Recently Played</h2>
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-3 text-xs">
                See All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entertainmentContent.filter(item => item.isPopular).slice(0, 3).map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button size="sm" className="rounded-full w-10 h-10 bg-white text-black hover:bg-white/90">
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 bg-black/40 text-white hover:bg-black/60">
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-xs font-medium">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                    <p className="text-white/50 text-xs truncate">{item.category}</p>
                    <div className="flex items-center gap-2">
                      {item.isPremium && (
                        <Badge className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded">
                          Premium
                        </Badge>
                      )}
                      <span className="text-white/30 text-xs">{item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Made For You */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Made For You</h2>
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-3 text-xs">
                See All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredContent.map((item, index) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg overflow-hidden mb-2 group-hover:scale-105 transition-transform duration-200">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="rounded-full w-8 h-8 bg-white text-black hover:bg-white/90">
                        <Play className="w-3 h-3 fill-current" />
                      </Button>
                    </div>
                    {item.isPremium && (
                      <div className="absolute top-1.5 left-1.5">
                        <Badge className="bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded">
                          Pro
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-medium text-white truncate">{item.title}</h3>
                    <p className="text-xs text-white/40 truncate capitalize">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* African Artists */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">African Artists</h2>
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-3 text-xs">
                See All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { name: "Burna Boy", followers: "15M", gradient: "from-orange-500 to-red-600" },
                { name: "Wizkid", followers: "13M", gradient: "from-green-500 to-teal-600" },
                { name: "Tiwa Savage", followers: "8M", gradient: "from-pink-500 to-rose-600" },
                { name: "Davido", followers: "11M", gradient: "from-blue-500 to-indigo-600" },
                { name: "Yemi Alade", followers: "6M", gradient: "from-purple-500 to-violet-600" },
                { name: "Mr Eazi", followers: "4M", gradient: "from-yellow-500 to-orange-600" }
              ].map((artist, index) => (
                <div key={artist.name} className="group cursor-pointer text-center">
                  <div className={`relative w-16 h-16 mx-auto bg-gradient-to-br ${artist.gradient} rounded-full overflow-hidden mb-2 group-hover:scale-105 transition-transform duration-200`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="rounded-full w-6 h-6 bg-white text-black hover:bg-white/90 text-xs">
                        <Play className="w-2.5 h-2.5 fill-current" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-medium text-white truncate">{artist.name}</h3>
                    <p className="text-xs text-white/40">{artist.followers}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Live Events */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Live Events</h2>
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-3 text-xs">
                See All
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((event, index) => (
                <div key={event.id} className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all cursor-pointer hover:bg-white/10">
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1.5 bg-red-500/20 rounded-full px-2 py-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs font-medium">LIVE</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3 h-3 text-white/50" />
                      <span className="text-white/50 text-xs">{event.date}</span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white mb-2 truncate">{event.title}</h4>
                    <p className="text-white/50 text-xs mb-4 truncate">{event.location}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-white">{formatCurrency(event.price)}</span>
                        <p className="text-white/40 text-xs">per ticket</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-white/90 rounded-lg px-4 py-2 text-xs font-medium"
                        onClick={() => handleEventBooking(event)}
                      >
                        Book
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Padding for Fixed Player */}
        <div className="h-24"></div>
      </ScrollArea>

      {/* Compact Mini Player */}
      <div className="fixed bottom-20 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/5 z-50">
        <div className="container-app">
          {/* Slim Progress Bar */}
          <div className="h-0.5 bg-white/10 relative">
            <div className="h-full w-1/3 bg-white rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between py-3">
            {/* Now Playing */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-sm">🎵</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-white truncate">Afrobeats Hits</h4>
                <p className="text-xs text-white/50 truncate">Burna Boy & More</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button size="sm" className="rounded-full w-10 h-10 bg-white text-black hover:bg-white/90">
                <Play className="w-4 h-4 fill-current" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Secondary */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                <Heart className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 text-white/60 hover:text-white hover:bg-white/10 rounded-lg">
                <Volume2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}