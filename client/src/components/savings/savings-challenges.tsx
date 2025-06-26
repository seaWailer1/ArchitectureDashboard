import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Target, 
  Trophy, 
  Star,
  Calendar,
  DollarSign,
  Plus,
  Play,
  CheckCircle,
  TrendingUp,
  Gift,
  Crown,
  Zap,
  Medal,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AchievementAnimation from "./achievement-animation";

interface SavingsChallengesProps {
  onBack: () => void;
}

export default function SavingsChallenges({ onBack }: SavingsChallengesProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'active' | 'completed'>('browse');
  const [showAchievement, setShowAchievement] = useState<any>(null);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    targetAmount: '',
    duration: '30',
    category: 'general',
    difficulty: 'medium'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const activeChallenges = [
    {
      id: 1,
      title: 'Emergency Fund Builder',
      description: 'Build a 3-month emergency fund',
      targetAmount: 1500,
      currentAmount: 750,
      endDate: '2025-03-15',
    }
  ];

  const completedChallenges = [
    {
      id: 1,
      title: 'Coffee Challenge',
      description: 'Save by skipping daily coffee',
      currentAmount: 150,
      completedAt: '2024-12-20',
    }
  ];

  // Pre-built challenge templates
  const challengeTemplates = [
    {
      id: '52-week',
      title: '52-Week Challenge',
      description: 'Save increasing amounts each week for a year',
      targetAmount: 1378,
      duration: 365,
      difficulty: 'hard',
      category: 'long-term',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
      rewards: ['Crown Badge', '$50 Bonus', 'Savings Master Title']
    },
    {
      id: 'emergency-fund',
      title: 'Emergency Fund Builder',
      description: 'Build a 3-month emergency fund',
      targetAmount: 1500,
      duration: 90,
      difficulty: 'medium',
      category: 'emergency',
      icon: Target,
      color: 'bg-green-100 text-green-600',
      rewards: ['Safety Shield Badge', 'Financial Security Certificate']
    },
    {
      id: 'vacation-fund',
      title: 'Dream Vacation Fund',
      description: 'Save for your perfect getaway',
      targetAmount: 800,
      duration: 120,
      difficulty: 'medium',
      category: 'lifestyle',
      icon: Gift,
      color: 'bg-purple-100 text-purple-600',
      rewards: ['Travel Explorer Badge', 'Vacation Voucher']
    },
    {
      id: 'coffee-challenge',
      title: 'Skip the Coffee Challenge',
      description: 'Save by skipping daily coffee purchases',
      targetAmount: 150,
      duration: 30,
      difficulty: 'easy',
      category: 'lifestyle',
      icon: Star,
      color: 'bg-orange-100 text-orange-600',
      rewards: ['Self-Control Badge', 'Healthy Habits Certificate']
    },
    {
      id: 'micro-savings',
      title: 'Micro Savings Sprint',
      description: 'Save small amounts daily for quick wins',
      targetAmount: 100,
      duration: 14,
      difficulty: 'easy',
      category: 'short-term',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      rewards: ['Quick Saver Badge', '$10 Bonus']
    },
    {
      id: 'investment-prep',
      title: 'Investment Preparation Fund',
      description: 'Build capital for your first investment',
      targetAmount: 500,
      duration: 60,
      difficulty: 'medium',
      category: 'investment',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600',
      rewards: ['Investor Badge', 'Free Investment Consultation']
    }
  ];

  const triggerAchievement = (achievement: any) => {
    setShowAchievement(achievement);
    setTimeout(() => setShowAchievement(null), 4000);
  };

  const handleCreateChallenge = () => {
    if (!newChallenge.title || !newChallenge.targetAmount) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Simulate challenge creation
    triggerAchievement({
      type: 'challenge_started',
      title: 'Challenge Accepted!',
      description: `Started "${newChallenge.title}" challenge`,
      icon: Target,
      color: 'text-blue-500'
    });

    toast({
      title: "Challenge created!",
      description: `Your savings challenge "${newChallenge.title}" has been started`,
    });

    setActiveTab('active');
  };

  const handleJoinTemplate = (template: any) => {
    triggerAchievement({
      type: 'challenge_joined',
      title: 'Challenge Joined!',
      description: `Joined "${template.title}" challenge`,
      icon: Trophy,
      color: 'text-green-500'
    });

    setActiveTab('active');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Achievement Animation Overlay */}
      {showAchievement && (
        <AchievementAnimation
          achievement={showAchievement}
          onComplete={() => setShowAchievement(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold text-lg">Savings Challenges</h2>
          <p className="text-sm text-gray-600">Gamify your savings journey</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: 'browse', label: 'Browse', icon: Target },
          { id: 'create', label: 'Create', icon: Plus },
          { id: 'active', label: 'Active', icon: Play },
          { id: 'completed', label: 'Completed', icon: Trophy },
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(id as any)}
            className="flex-1"
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Browse Templates */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {challengeTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-lg ${template.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{template.title}</h3>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Target</span>
                            <p className="font-medium">{formatCurrency(template.targetAmount)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration</span>
                            <p className="font-medium">{template.duration} days</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Daily</span>
                            <p className="font-medium">{formatCurrency(template.targetAmount / template.duration)}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Rewards</p>
                          <div className="flex flex-wrap gap-1">
                            {template.rewards.map((reward, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={() => handleJoinTemplate(template)}
                          className="w-full"
                          size="sm"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start Challenge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Custom Challenge */}
      {activeTab === 'create' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Challenge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Challenge Title</Label>
                <Input
                  placeholder="e.g., My Vacation Fund"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  placeholder="What are you saving for?"
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Target Amount (USD)</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={newChallenge.targetAmount}
                    onChange={(e) => setNewChallenge({ ...newChallenge, targetAmount: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Duration (Days)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={newChallenge.duration}
                    onChange={(e) => setNewChallenge({ ...newChallenge, duration: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select 
                    value={newChallenge.category} 
                    onValueChange={(value) => setNewChallenge({ ...newChallenge, category: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="emergency">Emergency Fund</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="short-term">Short Term</SelectItem>
                      <SelectItem value="long-term">Long Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select 
                    value={newChallenge.difficulty} 
                    onValueChange={(value) => setNewChallenge({ ...newChallenge, difficulty: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newChallenge.targetAmount && newChallenge.duration && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Daily savings needed:</strong> {formatCurrency(parseFloat(newChallenge.targetAmount) / parseInt(newChallenge.duration))}
                  </p>
                </div>
              )}

              <Button
                onClick={handleCreateChallenge}
                className="w-full"
              >
                Create Challenge
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Challenges */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeChallenges.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Active Challenges</h3>
                <p className="text-gray-600 mb-4">Start your first savings challenge to begin your journey</p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Challenges
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeChallenges.map((challenge: any) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onContribute={(amount: number) => {
                  triggerAchievement({
                    type: 'milestone_reached',
                    title: 'Great Progress!',
                    description: `Added ${formatCurrency(amount)} to your challenge`,
                    icon: Medal,
                    color: 'text-purple-500'
                  });
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Completed Challenges */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedChallenges.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Completed Challenges</h3>
                <p className="text-gray-600">Complete your first challenge to see it here</p>
              </CardContent>
            </Card>
          ) : (
            completedChallenges.map((challenge: any) => (
              <CompletedChallengeCard key={challenge.id} challenge={challenge} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Challenge Card Component
function ChallengeCard({ challenge, onContribute }: any) {
  const [contributionAmount, setContributionAmount] = useState('');
  const progress = (challenge.currentAmount / challenge.targetAmount) * 100;
  const daysRemaining = Math.ceil((new Date(challenge.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">{challenge.title}</h3>
          <Badge variant="outline">{daysRemaining} days left</Badge>
        </div>

        <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>{formatCurrency(challenge.currentAmount)}</span>
              <span>{formatCurrency(challenge.targetAmount)}</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% complete</p>
          </div>

          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="Amount"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={() => {
                onContribute(parseFloat(contributionAmount));
                setContributionAmount('');
              }}
              disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}
              size="sm"
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Completed Challenge Card Component
function CompletedChallengeCard({ challenge }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{challenge.title}</h3>
            <p className="text-sm text-gray-600">{challenge.description}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm">
              <span className="text-green-600 font-medium">
                {formatCurrency(challenge.currentAmount)} saved
              </span>
              <span className="text-gray-500">
                Completed {new Date(challenge.completedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
      </CardContent>
    </Card>
  );
}