import React, { useState, useEffect } from "react";
import EnterpriseNavigation from "@/components/EnterpriseNavigation";
import EnterpriseFooter from "@/components/EnterpriseFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Award,
  Heart,
  Share2,
  Calendar,
  MapPin,
  Star,
  Trophy,
  Zap,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Flag,
  Crown,
  Shield,
  Target,
  HeartHandshake,
  Lightbulb,
  Globe,
  Coffee,
  Gift,
} from "lucide-react";

interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    prideLevel: "alpha" | "lion" | "cub";
    location: string;
    verified: boolean;
  };
  content: string;
  type:
    | "success_story"
    | "tip"
    | "question"
    | "announcement"
    | "marketplace_update";
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  images?: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: "webinar" | "meetup" | "training" | "launch";
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  organizer: string;
  tags: string[];
}

interface LeaderboardMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  pridePoints: number;
  contributions: number;
  location: string;
  badges: string[];
  prideLevel: "alpha" | "lion" | "cub";
}

const Community = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("feed");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newPostType, setNewPostType] = useState<CommunityPost["type"]>("tip");

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = () => {
    // Mock community posts
    const mockPosts: CommunityPost[] = [
      {
        id: "1",
        author: {
          name: "Grace Wanjiku",
          avatar: "/api/placeholder/40/40",
          role: "Swift Gazelle Retailer",
          prideLevel: "alpha",
          location: "Nakuru",
          verified: true,
        },
        content:
          "🎉 Just hit 100 successful transactions this month! The Digital Savanna's group buying feature helped me reduce costs by 35%. Here's how I did it...",
        type: "success_story",
        timestamp: "2 hours ago",
        likes: 24,
        comments: 8,
        shares: 5,
        tags: ["success", "group-buying", "cost-savings"],
        isLiked: false,
        isBookmarked: true,
      },
      {
        id: "2",
        author: {
          name: "Samuel Kiprotich",
          avatar: "/api/placeholder/40/40",
          role: "Wise Elephant Supplier",
          prideLevel: "lion",
          location: "Eldoret",
          verified: true,
        },
        content:
          "💡 Pro tip: Use the Elephant Memory AI to predict your customers' reorder patterns. It's helped me maintain 99% stock availability. The AI learns your seasonal patterns!",
        type: "tip",
        timestamp: "5 hours ago",
        likes: 31,
        comments: 12,
        shares: 8,
        tags: ["AI", "inventory", "efficiency"],
        isLiked: true,
        isBookmarked: false,
      },
      {
        id: "3",
        author: {
          name: "Mary Akinyi",
          avatar: "/api/placeholder/40/40",
          role: "Lightning Cheetah Driver",
          prideLevel: "lion",
          location: "Kisumu",
          verified: true,
        },
        content:
          "❓ Anyone else experiencing delays with the new route optimization? My delivery times increased by 15 minutes yesterday. Looking for solutions...",
        type: "question",
        timestamp: "1 day ago",
        likes: 7,
        comments: 15,
        shares: 2,
        tags: ["logistics", "help-needed", "optimization"],
        isLiked: false,
        isBookmarked: false,
      },
    ];

    // Mock events
    const mockEvents: CommunityEvent[] = [
      {
        id: "1",
        title: "Digital Savanna Success Stories Webinar",
        description:
          "Join us to hear inspiring stories from our top performers and learn advanced marketplace strategies.",
        date: "2024-01-25",
        time: "14:00 EAT",
        location: "Virtual",
        type: "webinar",
        attendees: 145,
        maxAttendees: 200,
        isRegistered: false,
        organizer: "Digital Savanna Team",
        tags: ["success", "strategies", "virtual"],
      },
      {
        id: "2",
        title: "Nairobi Supplier Meetup",
        description:
          "Networking event for suppliers in the Nairobi region. Learn about new features and connect with fellow entrepreneurs.",
        date: "2024-01-28",
        time: "10:00 EAT",
        location: "iHub, Nairobi",
        type: "meetup",
        attendees: 67,
        maxAttendees: 100,
        isRegistered: true,
        organizer: "Nairobi Pride Leaders",
        tags: ["networking", "suppliers", "in-person"],
      },
      {
        id: "3",
        title: "AI-Powered Inventory Management Training",
        description:
          "Deep dive into Elephant Memory AI and advanced inventory optimization techniques.",
        date: "2024-02-02",
        time: "09:00 EAT",
        location: "Virtual",
        type: "training",
        attendees: 89,
        maxAttendees: 150,
        isRegistered: false,
        organizer: "Training Pride",
        tags: ["AI", "training", "inventory"],
      },
    ];

    // Mock leaderboard
    const mockLeaderboard: LeaderboardMember[] = [
      {
        id: "1",
        name: "Grace Wanjiku",
        avatar: "/api/placeholder/40/40",
        role: "Swift Gazelle Retailer",
        pridePoints: 2850,
        contributions: 45,
        location: "Nakuru",
        badges: ["top-performer", "helpful", "verified"],
        prideLevel: "alpha",
      },
      {
        id: "2",
        name: "Samuel Kiprotich",
        avatar: "/api/placeholder/40/40",
        role: "Wise Elephant Supplier",
        pridePoints: 2640,
        contributions: 38,
        location: "Eldoret",
        badges: ["knowledge-sharer", "mentor", "verified"],
        prideLevel: "alpha",
      },
      {
        id: "3",
        name: "Mary Akinyi",
        avatar: "/api/placeholder/40/40",
        role: "Lightning Cheetah Driver",
        pridePoints: 2420,
        contributions: 52,
        location: "Kisumu",
        badges: ["speed-demon", "reliable", "verified"],
        prideLevel: "lion",
      },
    ];

    setPosts(mockPosts);
    setEvents(mockEvents);
    setLeaderboard(mockLeaderboard);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );

    toast({
      title: "🦁 Pride Appreciation",
      description: "Your support strengthens the community!",
    });
  };

  const handleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, isBookmarked: !post.isBookmarked }
          : post,
      ),
    );

    toast({
      title: "📚 Saved to Your Den",
      description: "Post bookmarked for later reference!",
    });
  };

  const handleShare = (postId: string) => {
    // Mock sharing functionality
    navigator.clipboard.writeText(
      `${window.location.origin}/community/post/${postId}`,
    );
    toast({
      title: "🔗 Link Copied",
      description: "Share this wisdom with your pride!",
    });
  };

  const handleEventRegister = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? {
              ...event,
              isRegistered: !event.isRegistered,
              attendees: event.isRegistered
                ? event.attendees - 1
                : event.attendees + 1,
            }
          : event,
      ),
    );

    toast({
      title: "🎯 Event Registration",
      description: "See you at the watering hole!",
    });
  };

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: {
        name: user?.email || "Anonymous",
        avatar: "/api/placeholder/40/40",
        role: "Community Member",
        prideLevel: "cub",
        location: "Kenya",
        verified: false,
      },
      content: newPost,
      type: newPostType,
      timestamp: "just now",
      likes: 0,
      comments: 0,
      shares: 0,
      tags: [],
      isLiked: false,
      isBookmarked: false,
    };

    setPosts((prev) => [post, ...prev]);
    setNewPost("");

    toast({
      title: "🦁 Roar Heard Across the Savanna!",
      description: "Your contribution strengthens the community.",
    });
  };

  const getPostTypeIcon = (type: CommunityPost["type"]) => {
    switch (type) {
      case "success_story":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case "tip":
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case "question":
        return <MessageCircle className="h-4 w-4 text-purple-500" />;
      case "announcement":
        return <Zap className="h-4 w-4 text-orange-500" />;
      case "marketplace_update":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPrideBadge = (level: "alpha" | "lion" | "cub") => {
    switch (level) {
      case "alpha":
        return {
          icon: "👑",
          color: "bg-gradient-to-r from-yellow-400 to-orange-500",
          text: "Alpha",
        };
      case "lion":
        return {
          icon: "🦁",
          color: "bg-gradient-to-r from-orange-400 to-red-500",
          text: "Lion",
        };
      case "cub":
        return {
          icon: "🐾",
          color: "bg-gradient-to-r from-blue-400 to-indigo-500",
          text: "Cub",
        };
    }
  };

  const getEventTypeIcon = (type: CommunityEvent["type"]) => {
    switch (type) {
      case "webinar":
        return <Globe className="h-4 w-4 text-blue-500" />;
      case "meetup":
        return <Coffee className="h-4 w-4 text-brown-500" />;
      case "training":
        return <Target className="h-4 w-4 text-green-500" />;
      case "launch":
        return <Zap className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="edge-to-edge min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <EnterpriseNavigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="responsive-container">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4 space-x-2">
              <Users className="h-12 w-12" />
              <h1 className="text-4xl font-bold">Digital Savanna Community</h1>
              <Heart className="h-12 w-12" />
            </div>
            <p className="text-xl text-green-100 mb-6">
              Where the pride gathers to share wisdom, celebrate victories, and
              grow together
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>12,450+ Active Members</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>3,200+ Monthly Posts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>850+ Success Stories</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="responsive-container py-8">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="feed" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Community Feed</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Pride Leaders</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex items-center space-x-2"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Feed */}
              <div className="lg:col-span-2 space-y-6">
                {/* Create Post */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <span>Share Your Wisdom</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What's happening in your corner of the savanna?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex items-center justify-between">
                      <select
                        value={newPostType}
                        onChange={(e) =>
                          setNewPostType(
                            e.target.value as CommunityPost["type"],
                          )
                        }
                        className="px-3 py-2 border rounded-md"
                      >
                        <option value="tip">💡 Tip</option>
                        <option value="success_story">🏆 Success Story</option>
                        <option value="question">❓ Question</option>
                        <option value="marketplace_update">
                          📈 Market Update
                        </option>
                      </select>
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim()}
                      >
                        Share with Pride
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                <div className="space-y-4">
                  {posts.map((post) => {
                    const prideBadge = getPrideBadge(post.author.prideLevel);
                    return (
                      <Card
                        key={post.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          {/* Post Header */}
                          <div className="flex items-start space-x-3 mb-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={post.author.avatar} />
                              <AvatarFallback>
                                {post.author.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900">
                                  {post.author.name}
                                </h4>
                                {post.author.verified && (
                                  <Shield className="h-4 w-4 text-blue-500" />
                                )}
                                <Badge
                                  className={
                                    prideBadge.color + " text-white text-xs"
                                  }
                                >
                                  {prideBadge.icon} {prideBadge.text}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{post.author.role}</span>
                                <span>•</span>
                                <MapPin className="h-3 w-3" />
                                <span>{post.author.location}</span>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{post.timestamp}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {getPostTypeIcon(post.type)}
                              <Button variant="ghost" size="sm">
                                <Flag className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <p className="text-gray-700 leading-relaxed">
                              {post.content}
                            </p>
                          </div>

                          {/* Post Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Post Actions */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center space-x-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(post.id)}
                                className={
                                  post.isLiked
                                    ? "text-red-500"
                                    : "text-gray-500"
                                }
                              >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {post.likes}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500"
                              >
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {post.comments}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShare(post.id)}
                                className="text-gray-500"
                              >
                                <Share2 className="h-4 w-4 mr-1" />
                                {post.shares}
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleBookmark(post.id)}
                              className={
                                post.isBookmarked
                                  ? "text-yellow-500"
                                  : "text-gray-500"
                              }
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Community Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <span>Pride Pulse</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          12.4K
                        </div>
                        <div className="text-xs text-gray-600">
                          Active Members
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          3.2K
                        </div>
                        <div className="text-xs text-gray-600">
                          Monthly Posts
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          850
                        </div>
                        <div className="text-xs text-gray-600">
                          Success Stories
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          95%
                        </div>
                        <div className="text-xs text-gray-600">
                          Satisfaction
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trending Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-600" />
                      <span>Trending in the Savanna</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { tag: "group-buying", posts: 45 },
                        { tag: "AI-inventory", posts: 32 },
                        { tag: "success-stories", posts: 28 },
                        { tag: "logistics-tips", posts: 21 },
                        { tag: "market-trends", posts: 18 },
                      ].map((trend) => (
                        <div
                          key={trend.tag}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm font-medium">
                            #{trend.tag}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {trend.posts} posts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <HeartHandshake className="h-5 w-5 text-blue-600" />
                      <span>Community Resources</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Getting Started Guide
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      Success Stories
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Gift className="h-4 w-4 mr-2" />
                      Community Rewards
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Community Guidelines
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getEventTypeIcon(event.type)}
                        <Badge className="capitalize">{event.type}</Badge>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        <div>{event.date}</div>
                        <div>{event.time}</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{event.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>
                          {event.attendees}/{event.maxAttendees} attending
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleEventRegister(event.id)}
                      variant={event.isRegistered ? "outline" : "default"}
                      className="w-full"
                    >
                      {event.isRegistered ? "✓ Registered" : "Register"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  <span>Pride Leaderboard - Top Contributors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((member, index) => {
                    const prideBadge = getPrideBadge(member.prideLevel);
                    return (
                      <div
                        key={member.id}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-amber-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="text-2xl font-bold text-green-600">
                            #{index + 1}
                          </div>
                          {index < 3 && (
                            <div className="text-2xl">
                              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                            </div>
                          )}
                        </div>

                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold">{member.name}</h4>
                            <Badge
                              className={
                                prideBadge.color + " text-white text-xs"
                              }
                            >
                              {prideBadge.icon} {prideBadge.text}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            {member.role} • {member.location}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="text-sm">
                              <Star className="h-3 w-3 inline mr-1 text-yellow-500" />
                              {member.pridePoints} Pride Points
                            </div>
                            <div className="text-sm">
                              <MessageSquare className="h-3 w-3 inline mr-1 text-blue-500" />
                              {member.contributions} Contributions
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {member.badges.slice(0, 3).map((badge) => (
                            <Badge
                              key={badge}
                              variant="outline"
                              className="text-xs"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "📚 Getting Started Guide",
                  description:
                    "Everything new members need to know about thriving in the Digital Savanna",
                  icon: <Lightbulb className="h-8 w-8 text-blue-500" />,
                  link: "/help/getting-started",
                },
                {
                  title: "🏆 Success Stories Library",
                  description:
                    "Inspiring stories from our most successful community members",
                  icon: <Trophy className="h-8 w-8 text-yellow-500" />,
                  link: "/community/success-stories",
                },
                {
                  title: "💡 Best Practices Hub",
                  description:
                    "Proven strategies and tips from industry experts",
                  icon: <Target className="h-8 w-8 text-green-500" />,
                  link: "/resources/best-practices",
                },
                {
                  title: "🤝 Mentorship Program",
                  description:
                    "Connect with experienced traders for guidance and support",
                  icon: <HeartHandshake className="h-8 w-8 text-purple-500" />,
                  link: "/community/mentorship",
                },
                {
                  title: "🎁 Rewards & Recognition",
                  description:
                    "Learn about our community rewards and recognition programs",
                  icon: <Gift className="h-8 w-8 text-orange-500" />,
                  link: "/community/rewards",
                },
                {
                  title: "🛡️ Community Guidelines",
                  description:
                    "Our code of conduct for maintaining a healthy community",
                  icon: <Shield className="h-8 w-8 text-red-500" />,
                  link: "/community/guidelines",
                },
              ].map((resource) => (
                <Card
                  key={resource.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {resource.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {resource.description}
                    </p>
                    <Button variant="outline">Learn More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EnterpriseFooter />
    </div>
  );
};

export default Community;
