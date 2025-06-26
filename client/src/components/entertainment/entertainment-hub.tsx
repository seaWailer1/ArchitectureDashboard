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
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      {/* Apple Music Style Header */}
      <div className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container-content spacing-y-md">
          {/* Title and Search */}
          <div className="flex items-center justify-between">
            <h1 className="text-heading-1 font-bold text-white">Listen Now</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                <Input
                  placeholder="Search songs, artists, albums..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40"
                />
              </div>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {entertainmentCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 transition-all ${
                  selectedCategory === category.id
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/10 text-white hover:bg-white/20 border-white/20"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="container-content spacing-y-xl">
          {/* Recently Played */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-2 font-bold text-white">Recently Played</h2>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                See All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entertainmentContent.filter(item => item.isPopular).slice(0, 3).map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-4xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="rounded-full w-12 h-12 bg-white text-black hover:scale-105 transition-transform">
                        <Play className="w-5 h-5 fill-current" />
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 bg-black/40 text-white hover:bg-black/60">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-body font-semibold text-white mb-1 truncate">{item.title}</h3>
                  <p className="text-body-small text-white/70 truncate">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Featured Playlists */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-2 font-bold text-white">Made For You</h2>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                See All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredContent.map((item, index) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-orange-500 to-red-500 rounded-lg overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-3xl">{item.thumbnail}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="rounded-full w-10 h-10 bg-white text-black hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-current" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-body-small font-medium text-white mb-1 truncate">{item.title}</h3>
                  <p className="text-caption text-white/60 truncate">{item.category}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Artist Spotlight */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-2 font-bold text-white">African Artists</h2>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                See All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Burna Boy", "Wizkid", "Tiwa Savage", "Davido", "Yemi Alade", "Mr Eazi"].map((artist, index) => (
                <div key={artist} className="group cursor-pointer">
                  <div className="relative aspect-square bg-gradient-to-br from-blue-500 to-purple-500 rounded-full overflow-hidden mb-3">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" className="rounded-full w-8 h-8 bg-white text-black hover:scale-105 transition-transform">
                        <Play className="w-3 h-3 fill-current" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-body-small font-medium text-white text-center truncate">{artist}</h3>
                  <p className="text-caption text-white/60 text-center">Artist</p>
                </div>
              ))}
            </div>
          </section>

          {/* Live Events */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-heading-2 font-bold text-white">Live Events</h2>
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
                See All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredEvents.map((event) => (
                <div key={event.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-body-small text-red-400 font-medium">LIVE</span>
                  </div>
                  <h4 className="text-body-large font-semibold text-white mb-2">{event.title}</h4>
                  <p className="text-body-small text-white/70 mb-3">{event.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-body font-semibold text-white">{formatCurrency(event.price)}</span>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-white/90"
                      onClick={() => handleEventBooking(event)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Bottom Padding for Fixed Player */}
        <div className="h-24"></div>
      </ScrollArea>

      {/* Fixed Mini Player */}
      <div className="fixed bottom-20 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="container-app">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎵</span>
              </div>
              <div>
                <h4 className="text-body-small font-medium text-white">Afrobeats Hits 2025</h4>
                <p className="text-caption text-white/60">Various Artists</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <SkipBack className="w-5 h-5" />
              </Button>
              <Button size="sm" className="rounded-full w-10 h-10 bg-white text-black hover:bg-white/90">
                <Play className="w-4 h-4 fill-current" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}