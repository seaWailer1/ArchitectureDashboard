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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-neutral-950">
      {/* Refined Header */}
      <div className="sticky top-16 z-40 bg-gradient-to-b from-black/90 to-black/70 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="container-content py-6 space-y-6">
          {/* Title and Search */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                Entertainment
              </h1>
              <p className="text-white/60 text-sm">Discover African music, movies & events</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white/80 transition-colors" />
                <Input
                  placeholder="Search entertainment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 w-72 bg-white/[0.08] border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:bg-white/[0.12] focus:border-white/30 focus:ring-0 transition-all"
                />
              </div>
              <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Enhanced Category Pills */}
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {entertainmentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-white to-white/95 text-black hover:from-white/95 hover:to-white/90 shadow-lg"
                      : "bg-white/[0.08] text-white/80 hover:bg-white/[0.12] hover:text-white border border-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="container-content py-8 space-y-12">
          {/* Featured Hero Section */}
          <section className="relative">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-8 md:p-12">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white/90 text-sm font-medium">TRENDING NOW</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Afrobeats Rising
                </h2>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  The hottest tracks from Africa's biggest stars. Featuring Burna Boy, Wizkid, and rising talents.
                </p>
                <div className="flex items-center gap-4">
                  <Button className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-3 font-semibold">
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Play Now
                  </Button>
                  <Button variant="ghost" className="text-white border-white/30 hover:bg-white/10 rounded-full px-6 py-3">
                    Add to Library
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Recently Played */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Recently Played</h2>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/[0.08] rounded-xl px-4">
                See All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entertainmentContent.filter(item => item.isPopular).slice(0, 3).map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden mb-4 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <Button size="sm" className="rounded-full w-14 h-14 bg-white text-black hover:bg-white/90 shadow-xl">
                        <Play className="w-6 h-6 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 truncate">{item.title}</h3>
                  <p className="text-white/60 text-sm truncate">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {item.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1">
                        Premium
                      </Badge>
                    )}
                    <span className="text-white/40 text-xs">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Made For You */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Made For You</h2>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/[0.08] rounded-xl px-4">
                See All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredContent.map((item, index) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-xl overflow-hidden mb-3 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                      <Button size="sm" className="rounded-full w-12 h-12 bg-white/90 backdrop-blur-sm text-black hover:bg-white hover:scale-105 transition-all shadow-lg">
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                    {item.isPremium && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-2 py-1 rounded-full">
                          Premium
                        </Badge>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white mb-1 truncate group-hover:text-white/80 transition-colors">{item.title}</h3>
                  <p className="text-xs text-white/50 truncate capitalize">{item.category}</p>
                </div>
              ))}
            </div>
          </section>

          {/* African Artists */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">African Artists</h2>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/[0.08] rounded-xl px-4">
                See All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: "Burna Boy", followers: "15.2M", gradient: "from-orange-500 to-red-600" },
                { name: "Wizkid", followers: "12.8M", gradient: "from-green-500 to-teal-600" },
                { name: "Tiwa Savage", followers: "8.1M", gradient: "from-pink-500 to-rose-600" },
                { name: "Davido", followers: "11.3M", gradient: "from-blue-500 to-indigo-600" },
                { name: "Yemi Alade", followers: "5.7M", gradient: "from-purple-500 to-violet-600" },
                { name: "Mr Eazi", followers: "4.2M", gradient: "from-yellow-500 to-orange-600" }
              ].map((artist, index) => (
                <div key={artist.name} className="group cursor-pointer text-center">
                  <div className={`relative w-24 h-24 mx-auto bg-gradient-to-br ${artist.gradient} rounded-full overflow-hidden mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button size="sm" className="rounded-full w-8 h-8 bg-white/90 text-black hover:bg-white shadow-lg">
                        <Play className="w-3 h-3 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-white/80 transition-colors">{artist.name}</h3>
                  <p className="text-xs text-white/50">{artist.followers} followers</p>
                </div>
              ))}
            </div>
          </section>

          {/* Live Events */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Live Events</h2>
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/[0.08] rounded-xl px-4">
                See All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event, index) => (
                <div key={event.id} className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer hover:bg-white/[0.12]">
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 bg-red-500/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs font-semibold">LIVE</span>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">{event.date}</span>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">{event.title}</h4>
                    <p className="text-white/60 text-sm mb-6 flex items-center gap-2">
                      <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                      {event.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-white">{formatCurrency(event.price)}</span>
                        <p className="text-white/50 text-xs">per ticket</p>
                      </div>
                      <Button
                        className="bg-gradient-to-r from-white to-white/90 text-black hover:from-white/90 hover:to-white/80 rounded-xl px-6 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all"
                        onClick={() => handleEventBooking(event)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] rounded-2xl pointer-events-none"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Padding for Fixed Player */}
        <div className="h-24"></div>
      </ScrollArea>

      {/* Enhanced Mini Player */}
      <div className="fixed bottom-20 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-2xl border-t border-white/[0.08] z-50 shadow-2xl">
        <div className="container-app">
          {/* Progress Bar */}
          <div className="h-1 bg-white/10 relative">
            <div className="h-full w-1/3 bg-gradient-to-r from-white to-white/80 rounded-full"></div>
          </div>
          
          <div className="flex items-center justify-between py-4">
            {/* Now Playing Info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🎵</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">Afrobeats Hits 2025</h4>
                <p className="text-xs text-white/60 truncate">Burna Boy, Wizkid & More</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-white/40">2:34</span>
                  <div className="w-1 h-1 bg-white/40 rounded-full"></div>
                  <span className="text-xs text-white/40">4:12</span>
                </div>
              </div>
            </div>
            
            {/* Playback Controls */}
            <div className="flex items-center gap-3 mx-8">
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button size="sm" className="rounded-full w-12 h-12 bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                <Play className="w-5 h-5 fill-current" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <SkipForward className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Repeat className="w-4 h-4" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Share className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-10 h-10 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}