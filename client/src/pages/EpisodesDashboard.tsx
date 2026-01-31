/*
  Design: Neural Constellation
  Episodes Dashboard - Manage and track all podcast episode analyses
*/

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  FileText,
  Sparkles,
  Loader2,
  MessageSquare,
  Target,
  Users,
  AlertTriangle,
  ChevronRight,
  Copy,
  Check,
  Youtube,
  Globe,
  TrendingUp,
  Flame,
  MapPin,
  ExternalLink,
  Plus,
  Calendar,
  Clock,
  Trash2,
  Eye,
  ArrowLeft,
  LayoutDashboard,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Singlish dictionary for language processing
const singlishDictionary: Record<string, { meaning: string; usage: string }> = {
  "lah": { meaning: "Emphasis particle", usage: "Used to add emphasis or soften statements" },
  "lor": { meaning: "Resignation particle", usage: "Indicates acceptance or resignation" },
  "leh": { meaning: "Question/assertion particle", usage: "Softens questions or assertions" },
  "meh": { meaning: "Skepticism particle", usage: "Expresses doubt or disbelief" },
  "sia": { meaning: "Exclamation particle", usage: "Expresses surprise or emphasis" },
  "hor": { meaning: "Seeking agreement", usage: "Used when seeking confirmation" },
  "shiok": { meaning: "Extremely good/satisfying", usage: "Describes something pleasurable" },
  "kiasu": { meaning: "Fear of losing out", usage: "Describes competitive behavior" },
  "kiasi": { meaning: "Fear of death/overly cautious", usage: "Describes risk-averse behavior" },
  "bojio": { meaning: "Didn't invite", usage: "Complaint about not being invited" },
  "sian": { meaning: "Bored/tired/frustrated", usage: "Expresses weariness or frustration" },
  "lepak": { meaning: "Relax/hang out", usage: "Casual relaxation with friends" },
  "makan": { meaning: "Eat/food", usage: "Refers to eating or food" },
  "alamak": { meaning: "Oh no!/Expression of dismay", usage: "Exclamation of surprise or dismay" },
  "blur": { meaning: "Confused/clueless", usage: "Describes someone who is confused" },
  "chope": { meaning: "Reserve/book", usage: "To reserve a seat or place" },
  "paiseh": { meaning: "Embarrassed/shy", usage: "Feeling of embarrassment" },
  "steady": { meaning: "Cool/reliable", usage: "Describes someone dependable" },
  "jialat": { meaning: "Serious trouble", usage: "Describes a difficult situation" },
  "can": { meaning: "Okay/possible", usage: "Affirmative response" },
  "cannot": { meaning: "Not okay/impossible", usage: "Negative response" },
  "atas": { meaning: "High-class/snobbish", usage: "Describes something upscale" },
  "kaypoh": { meaning: "Nosy/busybody", usage: "Describes someone overly curious" },
  "goondu": { meaning: "Stupid/foolish", usage: "Describes someone acting foolishly" },
  "wayang": { meaning: "Putting on a show", usage: "Pretending or being insincere" },
  "chim": { meaning: "Deep/profound/difficult", usage: "Describes complex concepts" },
  "swee": { meaning: "Beautiful/perfect", usage: "Describes something ideal" },
  "boleh": { meaning: "Can/possible", usage: "Malay-influenced affirmative" },
  "angmoh": { meaning: "Westerner/Caucasian", usage: "Refers to Western foreigners" },
  "kopi": { meaning: "Coffee", usage: "Local coffee culture reference" },
  "hawker": { meaning: "Street food vendor", usage: "Singapore's famous food culture" },
  "hdb": { meaning: "Public housing", usage: "Housing Development Board flats" },
  "mrt": { meaning: "Mass Rapid Transit", usage: "Singapore's subway system" },
  "coe": { meaning: "Certificate of Entitlement", usage: "Vehicle ownership permit" },
  "cpf": { meaning: "Central Provident Fund", usage: "Mandatory savings scheme" },
  "5cs": { meaning: "Cash, Car, Credit Card, Condo, Country Club", usage: "Traditional success markers" }
};

// Trending topics in Singapore
const trendingSGTopics = [
  {
    id: 1,
    title: "AI Replacing Jobs in Singapore",
    category: "Technology",
    heat: 95,
    description: "Debate on whether AI will displace Singaporean workers in finance, legal, and creative sectors",
    relatedKeywords: ["ChatGPT", "automation", "reskilling", "SkillsFuture"],
    potentialGuests: ["Tech leaders", "HR professionals", "Policy makers"]
  },
  {
    id: 2,
    title: "HDB Resale Prices Hit Record High",
    category: "Property",
    heat: 92,
    description: "Million-dollar HDB flats becoming common, sparking affordability concerns",
    relatedKeywords: ["BTO", "property cooling measures", "first-time buyers"],
    potentialGuests: ["Property analysts", "Young couples", "MPs"]
  },
  {
    id: 3,
    title: "Singapore Startup Ecosystem 2025",
    category: "Business",
    heat: 88,
    description: "Is Singapore still the best place for startups in Southeast Asia?",
    relatedKeywords: ["VC funding", "talent shortage", "regional expansion"],
    potentialGuests: ["Founders", "VCs", "Enterprise Singapore"]
  },
  {
    id: 4,
    title: "Work From Home vs Return to Office",
    category: "Lifestyle",
    heat: 85,
    description: "Singaporean companies mandating return to office, employees pushing back",
    relatedKeywords: ["hybrid work", "productivity", "mental health"],
    potentialGuests: ["HR directors", "Remote workers", "Office space providers"]
  },
  {
    id: 5,
    title: "Cost of Living Crisis",
    category: "Economy",
    heat: 90,
    description: "GST hike, inflation, and stagnant wages affecting middle-class Singaporeans",
    relatedKeywords: ["inflation", "GST vouchers", "household expenses"],
    potentialGuests: ["Economists", "Social workers", "Affected families"]
  },
  {
    id: 6,
    title: "Singapore's Green Plan 2030",
    category: "Environment",
    heat: 78,
    description: "Can Singapore achieve its sustainability goals? Critics vs supporters",
    relatedKeywords: ["carbon tax", "EV adoption", "solar energy"],
    potentialGuests: ["Environmental activists", "Industry leaders", "NEA officials"]
  }
];

// Types
interface Argument {
  id: string;
  speaker: string;
  claim: string;
  topic: string;
  strength: number;
  type: "claim" | "premise" | "rebuttal";
  premises: string[];
  contrarian_potential: number;
  singlishTerms?: string[];
}

interface SinglishAnalysis {
  termsFound: string[];
  culturalContext: string[];
  localRelevance: number;
}

interface ExtractionResult {
  arguments: Argument[];
  topics: string[];
  sentiment: { positive: number; neutral: number; negative: number };
  contrarian_candidates: { name: string; reason: string; score: number; expertise: string }[];
  singlishAnalysis?: SinglishAnalysis;
  suggestedTrendingTopics: typeof trendingSGTopics;
}

interface Episode {
  id: string;
  title: string;
  source: "text" | "youtube";
  youtubeUrl?: string;
  transcript: string;
  createdAt: string;
  analyzedAt?: string;
  status: "pending" | "analyzing" | "completed";
  result?: ExtractionResult;
  wordCount: number;
  characterCount: number;
}

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15);

const detectSinglish = (text: string): SinglishAnalysis => {
  const lowerText = text.toLowerCase();
  const termsFound: string[] = [];
  
  Object.keys(singlishDictionary).forEach(term => {
    if (lowerText.includes(term)) {
      termsFound.push(term);
    }
  });
  
  const culturalContext: string[] = [];
  if (lowerText.includes("hdb") || lowerText.includes("housing")) culturalContext.push("HDB/Housing");
  if (lowerText.includes("coe") || lowerText.includes("car")) culturalContext.push("COE/Transportation");
  if (lowerText.includes("cpf") || lowerText.includes("retirement")) culturalContext.push("CPF/Retirement");
  if (lowerText.includes("hawker") || lowerText.includes("makan")) culturalContext.push("Hawker Culture");
  if (lowerText.includes("startup") || lowerText.includes("tech")) culturalContext.push("Tech/Startup Scene");
  
  const localRelevance = Math.min(1, (termsFound.length * 0.15) + (culturalContext.length * 0.1) + 0.3);
  
  return { termsFound, culturalContext, localRelevance };
};

const extractArguments = (text: string): ExtractionResult => {
  const singlishAnalysis = detectSinglish(text);
  
  const hasAI = text.toLowerCase().includes("ai") || text.toLowerCase().includes("artificial");
  const hasStartup = text.toLowerCase().includes("startup") || text.toLowerCase().includes("venture") || text.toLowerCase().includes("funding");
  const hasWork = text.toLowerCase().includes("work") || text.toLowerCase().includes("job");
  const hasSingapore = text.toLowerCase().includes("singapore") || singlishAnalysis.termsFound.length > 0;
  const hasTech = text.toLowerCase().includes("tech") || text.toLowerCase().includes("technology");
  
  const arguments_list: Argument[] = [];
  
  if (hasAI) {
    arguments_list.push({
      id: "arg-001",
      speaker: "Guest",
      claim: "AGI is achievable within the next decade",
      topic: "Artificial General Intelligence",
      strength: 0.78,
      type: "claim",
      premises: [
        "Rate of progress in LLMs is exponential",
        "Multimodal AI breakthroughs were previously thought impossible"
      ],
      contrarian_potential: 0.85,
      singlishTerms: singlishAnalysis.termsFound.slice(0, 2)
    });
  }
  
  if (hasWork) {
    arguments_list.push({
      id: "arg-002",
      speaker: "Guest",
      claim: "Technology creates more jobs than it destroys",
      topic: "Future of Work",
      strength: 0.65,
      type: "claim",
      premises: [
        "Historical evidence shows job creation from technology",
        "Adaptation and reskilling are key factors"
      ],
      contrarian_potential: 0.72
    });
  }
  
  if (hasStartup) {
    arguments_list.push({
      id: "arg-003",
      speaker: "Guest",
      claim: "Growth at all costs mentality is harmful to startups",
      topic: "Venture Capital",
      strength: 0.82,
      type: "claim",
      premises: [
        "2021 funding created perverse incentives",
        "Survivorship bias in VC is extreme"
      ],
      contrarian_potential: 0.68
    });
  }
  
  if (hasSingapore && hasTech) {
    arguments_list.push({
      id: "arg-004",
      speaker: "Guest",
      claim: "Singapore startups should focus on regional strengths, not copy Silicon Valley",
      topic: "Singapore Tech Ecosystem",
      strength: 0.75,
      type: "claim",
      premises: [
        "Local market understanding is crucial",
        "Southeast Asia expansion is a natural advantage"
      ],
      contrarian_potential: 0.70,
      singlishTerms: singlishAnalysis.termsFound
    });
  }
  
  if (arguments_list.length === 0) {
    arguments_list.push({
      id: "arg-gen",
      speaker: "Guest",
      claim: "The current approach needs fundamental rethinking",
      topic: "General Discussion",
      strength: 0.55,
      type: "claim",
      premises: [
        "Evidence suggests current methods are suboptimal",
        "Alternative approaches show promise"
      ],
      contrarian_potential: 0.5
    });
  }
  
  const topics = Array.from(new Set(arguments_list.map(a => a.topic)));
  
  const contrarian_candidates = [
    { name: "Dr. Gary Marcus", reason: "Known AI skeptic with opposing views on AGI timeline", score: -0.68, expertise: "AI Research" },
    { name: "Yann LeCun", reason: "Advocates for different AI architectures", score: -0.45, expertise: "Deep Learning" },
    { name: "Marc Andreessen", reason: "Strong proponent of growth-focused investing", score: -0.72, expertise: "Venture Capital" },
    { name: "Piyush Gupta (DBS)", reason: "Traditional banking perspective on fintech disruption", score: -0.55, expertise: "Banking & Finance" },
    { name: "Ho Kwon Ping", reason: "Established business leader with contrarian startup views", score: -0.48, expertise: "Entrepreneurship" },
    { name: "Tan Suee Chieh", reason: "CPF expert with alternative retirement planning views", score: -0.52, expertise: "Financial Planning" }
  ];
  
  const relevantCandidates = hasSingapore 
    ? contrarian_candidates.filter((_, i) => i >= 3 || Math.random() > 0.5)
    : contrarian_candidates.filter((_, i) => i < 3 && Math.random() > 0.3);
  
  const suggestedTrendingTopics = trendingSGTopics.filter(topic => {
    const keywords = topic.relatedKeywords.join(" ").toLowerCase();
    const title = topic.title.toLowerCase();
    return hasAI && title.includes("ai") ||
           hasStartup && title.includes("startup") ||
           hasWork && (title.includes("work") || title.includes("job")) ||
           hasSingapore;
  }).slice(0, 4);
  
  return {
    arguments: arguments_list,
    topics,
    sentiment: {
      positive: 0.35 + Math.random() * 0.2,
      neutral: 0.4 + Math.random() * 0.1,
      negative: 0.1 + Math.random() * 0.1
    },
    contrarian_candidates: relevantCandidates.slice(0, 3),
    singlishAnalysis: singlishAnalysis.termsFound.length > 0 ? singlishAnalysis : undefined,
    suggestedTrendingTopics: suggestedTrendingTopics.length > 0 ? suggestedTrendingTopics : trendingSGTopics.slice(0, 3)
  };
};

const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const mockYouTubeTranscript = (): string => {
  return `Host: Welcome back to the show. Today we're discussing the future of technology in Singapore.

Guest: Thanks for having me lah. Very excited to share my thoughts on where Singapore is heading.

Host: So what's your take on the AI revolution? Is Singapore ready or not?

Guest: Wah, this one quite chim topic sia. I think Singapore is well-positioned, but we cannot be complacent. The kiasu mentality actually helps here - everyone scared to be left behind, so they adopt new technology quickly.

Host: But some people say we're too focused on following trends rather than innovating ourselves.

Guest: Ya, that's a valid point lor. We need more original thinking. Too many startups here just copy what works overseas. Must develop our own unique solutions for Southeast Asia.

Host: What about the workforce? Are Singaporeans ready for AI?

Guest: Honestly hor, I think there's a gap. SkillsFuture is good, but not enough. Companies need to invest more in training. Cannot just expect government to do everything.

Host: Alamak, that's quite a strong statement. Any final thoughts?

Guest: Just that we need to be steady and focused. Don't wayang - actually do the work. Singapore can be a leader in AI adoption if we play to our strengths.`;
};

// Sample transcripts
const sampleTranscripts = [
  {
    title: "AI & Future of Work",
    text: `Host: So you're saying that AI will fundamentally change how we work in the next five years?

Guest: Absolutely. I believe we're at an inflection point. The rate of progress in large language models is exponential, and we're seeing capabilities that were thought impossible just two years ago. Within the next decade, I think we'll see AGI - artificial general intelligence - become a reality.

Host: That's a bold claim. Many researchers disagree.

Guest: They do, and I understand the skepticism. But look at the evidence. Multimodal AI systems are now passing professional exams, writing code, and even conducting scientific research. The trajectory is clear. Companies that don't adapt will be left behind.

Host: What about job displacement? Isn't that a concern?

Guest: It's a valid concern, but I think it's overstated. History shows that technology creates more jobs than it destroys. The key is adaptation and reskilling. We need to prepare workers for the AI-augmented workplace, not fight against progress.`
  },
  {
    title: "Startup Funding Debate",
    text: `Host: Let's talk about the current state of venture capital. You've been critical of the "growth at all costs" mentality.

Guest: Very critical. I think the 2021 funding environment created perverse incentives. Founders were rewarded for burning cash, not building sustainable businesses. Now we're seeing the consequences - mass layoffs, down rounds, and companies that never should have been funded in the first place.

Host: But didn't that approach work for companies like Uber and Amazon?

Guest: Those are the exceptions, not the rule. For every Amazon, there are hundreds of failed companies that burned through billions. The survivorship bias in venture capital is extreme. I believe we need to return to fundamentals - profitability, unit economics, and sustainable growth.

Host: So you're advocating for a more conservative approach?

Guest: I'd call it a more rational approach. Founders should focus on building real businesses that solve real problems, not chasing vanity metrics to impress VCs. The best companies are often bootstrapped or lightly funded.`
  },
  {
    title: "Singapore Tech Scene (Singlish)",
    text: `Host: Wah, the tech scene in Singapore damn happening now sia. What you think about all these startups popping up?

Guest: Ya lah, very shiok to see so many young entrepreneurs trying their luck. But honestly hor, I think many of them very kiasu - everyone want to be the next unicorn, but they don't understand the fundamentals leh.

Host: Alamak, that's quite harsh. But I get what you mean lah. The competition is jialat.

Guest: Exactly lor. And some more, the cost here is no joke. Office rent, hiring talent - everything so atas pricing. Small startups cannot tahan one.

Host: So how? What's your advice for founders here?

Guest: Don't be blur blur and just follow what angmoh VCs say. Understand the local market first. Go lepak at hawker centres, talk to real people. Singapore market is unique - very chim to understand if you just sit in your CBD office.

Host: Steady lah. That's good advice. What about the AI wave? Can Singapore compete or not?

Guest: Can lah, but must be realistic. We cannot wayang and pretend we're Silicon Valley. Better to focus on what we're good at - fintech, logistics, Southeast Asia expansion. Don't be kaypoh and try to do everything.`
  }
];

// Local storage helpers
const STORAGE_KEY = "front-row-episodes";

const loadEpisodes = (): Episode[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveEpisodes = (episodes: Episode[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
};

export default function EpisodesDashboard() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [isNewEpisodeOpen, setIsNewEpisodeOpen] = useState(false);
  const [inputMode, setInputMode] = useState<"text" | "youtube">("text");
  const [transcript, setTranscript] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoadingYoutube, setIsLoadingYoutube] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedTrendingTopic, setSelectedTrendingTopic] = useState<typeof trendingSGTopics[0] | null>(null);

  // Load episodes on mount
  useEffect(() => {
    setEpisodes(loadEpisodes());
  }, []);

  // Save episodes when changed
  useEffect(() => {
    if (episodes.length > 0) {
      saveEpisodes(episodes);
    }
  }, [episodes]);

  const handleYoutubeImport = useCallback(async () => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    setIsLoadingYoutube(true);
    toast.info("Fetching transcript from YouTube...");

    await new Promise(resolve => setTimeout(resolve, 2000));

    const extractedTranscript = mockYouTubeTranscript();
    setTranscript(extractedTranscript);
    setInputMode("text");
    setIsLoadingYoutube(false);
    toast.success("Transcript extracted successfully!");
  }, [youtubeUrl]);

  const handleSampleSelect = (sample: typeof sampleTranscripts[0]) => {
    setTranscript(sample.text);
    setEpisodeTitle(sample.title);
    toast.info(`Loaded sample: "${sample.title}"`);
  };

  const handleCreateEpisode = useCallback(async () => {
    if (!transcript.trim()) {
      toast.error("Please enter or import a transcript");
      return;
    }

    const title = episodeTitle.trim() || `Episode ${episodes.length + 1}`;
    
    const newEpisode: Episode = {
      id: generateId(),
      title,
      source: inputMode,
      youtubeUrl: inputMode === "youtube" ? youtubeUrl : undefined,
      transcript,
      createdAt: new Date().toISOString(),
      status: "analyzing",
      wordCount: transcript.split(/\s+/).filter(Boolean).length,
      characterCount: transcript.length
    };

    setEpisodes(prev => [newEpisode, ...prev]);
    setIsNewEpisodeOpen(false);
    setIsAnalyzing(true);
    setProgress(0);
    setSelectedEpisode(newEpisode);

    // Simulate analysis
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2500));

    clearInterval(progressInterval);
    setProgress(100);

    const result = extractArguments(transcript);

    await new Promise(resolve => setTimeout(resolve, 300));

    const completedEpisode: Episode = {
      ...newEpisode,
      status: "completed",
      analyzedAt: new Date().toISOString(),
      result
    };

    setEpisodes(prev => prev.map(ep => ep.id === newEpisode.id ? completedEpisode : ep));
    setSelectedEpisode(completedEpisode);
    setIsAnalyzing(false);

    // Reset form
    setTranscript("");
    setEpisodeTitle("");
    setYoutubeUrl("");

    const singlishMsg = result.singlishAnalysis 
      ? ` (${result.singlishAnalysis.termsFound.length} Singlish terms detected)`
      : "";
    toast.success(`Extracted ${result.arguments.length} arguments${singlishMsg}`);
  }, [transcript, episodeTitle, inputMode, youtubeUrl, episodes.length]);

  const handleDeleteEpisode = (episodeId: string) => {
    setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
    if (selectedEpisode?.id === episodeId) {
      setSelectedEpisode(null);
    }
    toast.success("Episode deleted");
  };

  const handleCopyResult = () => {
    if (selectedEpisode?.result) {
      navigator.clipboard.writeText(JSON.stringify(selectedEpisode.result, null, 2));
      setCopied(true);
      toast.success("Results copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const filteredEpisodes = episodes.filter(ep => 
    ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ep.transcript.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Episodes Dashboard</h1>
            </div>
          </div>
          <Dialog open={isNewEpisodeOpen} onOpenChange={setIsNewEpisodeOpen}>
            <DialogTrigger asChild>
              <Button className="glow-cyan gap-2">
                <Plus className="w-4 h-4" />
                New Episode
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Add New Episode
                </DialogTitle>
                <DialogDescription>
                  Import a podcast from YouTube or paste your transcript for analysis
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                {/* Episode Title */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Episode Title</label>
                  <Input
                    placeholder="Enter episode title..."
                    value={episodeTitle}
                    onChange={(e) => setEpisodeTitle(e.target.value)}
                  />
                </div>

                {/* Input Mode Tabs */}
                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "text" | "youtube")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="text" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Paste Text
                    </TabsTrigger>
                    <TabsTrigger value="youtube" className="flex items-center gap-2">
                      <Youtube className="w-4 h-4" />
                      YouTube URL
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="youtube" className="space-y-4 mt-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleYoutubeImport}
                        disabled={isLoadingYoutube || !youtubeUrl.trim()}
                        className="shrink-0"
                      >
                        {isLoadingYoutube ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4 mt-4">
                    {/* Sample Buttons */}
                    <div className="flex flex-wrap gap-2">
                      {sampleTranscripts.map((sample, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSampleSelect(sample)}
                          className={sample.title.includes("Singlish") ? "border-primary/40 text-primary" : ""}
                        >
                          {sample.title.includes("Singlish") && <Globe className="w-3 h-3 mr-1" />}
                          {sample.title}
                        </Button>
                      ))}
                    </div>

                    <Textarea
                      placeholder="Paste your podcast transcript here..."
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      className="min-h-[200px] bg-card border-border resize-none font-mono text-sm"
                    />
                  </TabsContent>
                </Tabs>

                {transcript && (
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{transcript.length} characters</span>
                    <span>{transcript.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                )}

                <Button 
                  onClick={handleCreateEpisode}
                  disabled={!transcript.trim()}
                  className="w-full glow-cyan"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create & Analyze Episode
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Episodes List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search episodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredEpisodes.length === 0 ? (
                <Card className="card-glow">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground mb-4">No episodes yet</p>
                    <Button onClick={() => setIsNewEpisodeOpen(true)} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Your First Episode
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredEpisodes.map((episode) => (
                  <motion.div
                    key={episode.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                  >
                    <Card 
                      className={`card-glow cursor-pointer transition-all hover:border-primary/40 ${
                        selectedEpisode?.id === episode.id ? "border-primary/60 bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedEpisode(episode)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{episode.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(episode.createdAt)}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedEpisode(episode)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteEpisode(episode.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {episode.source === "youtube" ? (
                              <><Youtube className="w-3 h-3 mr-1" /> YouTube</>
                            ) : (
                              <><FileText className="w-3 h-3 mr-1" /> Text</>
                            )}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              episode.status === "completed" 
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : episode.status === "analyzing"
                                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                  : "bg-muted"
                            }`}
                          >
                            {episode.status === "completed" && <Check className="w-3 h-3 mr-1" />}
                            {episode.status === "analyzing" && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                            {episode.status}
                          </Badge>
                          {episode.result?.arguments && (
                            <Badge variant="secondary" className="text-xs">
                              {episode.result.arguments.length} arguments
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Episode Details / Analysis Results */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {!selectedEpisode ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card className="card-glow">
                    <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                      <MessageSquare className="w-16 h-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Select an Episode</h3>
                      <p className="text-muted-foreground max-w-md">
                        Choose an episode from the list to view its analysis results, or create a new episode to get started.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Trending Topics */}
                  <Card className="card-glow mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Trending Topics in Singapore
                        <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-400 border-red-500/20">
                          <Flame className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Hot topics for your next podcast episode
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {trendingSGTopics.slice(0, 6).map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => setSelectedTrendingTopic(
                              selectedTrendingTopic?.id === topic.id ? null : topic
                            )}
                            className={`p-4 rounded-lg border text-left transition-all hover:scale-[1.02] ${
                              selectedTrendingTopic?.id === topic.id
                                ? "bg-primary/10 border-primary/40"
                                : "bg-card/50 border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <Badge variant="outline" className="text-xs bg-muted/50">
                                {topic.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs">
                                <Flame className={`w-3 h-3 ${topic.heat > 85 ? "text-red-400" : "text-orange-400"}`} />
                                <span className={topic.heat > 85 ? "text-red-400" : "text-orange-400"}>{topic.heat}%</span>
                              </div>
                            </div>
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">{topic.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
                          </button>
                        ))}
                      </div>

                      <AnimatePresence>
                        {selectedTrendingTopic && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-lg flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-primary" />
                                  {selectedTrendingTopic.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{selectedTrendingTopic.description}</p>
                              </div>
                            </div>
                            
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Target className="w-3 h-3" />
                                  Related Keywords
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {selectedTrendingTopic.relatedKeywords.map((keyword, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  Potential Guests
                                </h5>
                                <div className="flex flex-wrap gap-1">
                                  {selectedTrendingTopic.potentialGuests.map((guest, i) => (
                                    <Badge key={i} variant="outline" className="text-xs bg-secondary/10">
                                      {guest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key={selectedEpisode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Episode Header */}
                  <Card className="card-glow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{selectedEpisode.title}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(selectedEpisode.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {selectedEpisode.wordCount} words
                            </span>
                          </CardDescription>
                        </div>
                        {selectedEpisode.result && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyResult}
                          >
                            {copied ? (
                              <Check className="w-4 h-4 mr-1" />
                            ) : (
                              <Copy className="w-4 h-4 mr-1" />
                            )}
                            {copied ? "Copied" : "Copy JSON"}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Analysis Progress */}
                  {isAnalyzing && selectedEpisode.status === "analyzing" && (
                    <Card className="card-glow">
                      <CardContent className="py-8">
                        <div className="flex flex-col items-center">
                          <div className="relative mb-4">
                            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <Progress value={progress} className="h-2 w-full max-w-md mb-2" />
                          <p className="text-sm text-muted-foreground">
                            {progress < 25 && "Parsing transcript..."}
                            {progress >= 25 && progress < 50 && "Detecting Singlish & cultural context..."}
                            {progress >= 50 && progress < 75 && "Identifying arguments..."}
                            {progress >= 75 && progress < 90 && "Finding contrarian candidates..."}
                            {progress >= 90 && "Generating results..."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Analysis Results */}
                  {selectedEpisode.result && (
                    <>
                      {/* Singlish Analysis */}
                      {selectedEpisode.result.singlishAnalysis && (
                        <Card className="card-glow border-primary/20">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Globe className="w-5 h-5 text-primary" />
                              Singlish & Cultural Context Detected
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {selectedEpisode.result.singlishAnalysis.termsFound.map((term, i) => (
                                <Badge key={i} className="bg-primary/20 text-primary border-0">
                                  {term}
                                  <span className="ml-1 opacity-70">
                                    ({singlishDictionary[term]?.meaning || "Local term"})
                                  </span>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Local Relevance:</span>
                              <Progress value={selectedEpisode.result.singlishAnalysis.localRelevance * 100} className="h-2 w-32" />
                              <span>{Math.round(selectedEpisode.result.singlishAnalysis.localRelevance * 100)}%</span>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Topics & Arguments */}
                      <Card className="card-glow">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-secondary" />
                            Extracted Arguments
                            <Badge variant="secondary" className="ml-2">
                              {selectedEpisode.result.arguments.length} found
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Topics */}
                          <div className="flex flex-wrap gap-2">
                            {selectedEpisode.result.topics.map((topic, i) => (
                              <Badge key={i} variant="outline" className="bg-primary/10">
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          {/* Arguments */}
                          <div className="space-y-3">
                            {selectedEpisode.result.arguments.map((arg, i) => (
                              <motion.div
                                key={arg.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-lg bg-card border border-border"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <p className="font-medium">{arg.claim}</p>
                                  <Badge 
                                    variant="outline" 
                                    className={`shrink-0 ${
                                      arg.strength > 0.7 
                                        ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                        : arg.strength > 0.5 
                                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                          : "bg-red-500/10 text-red-400 border-red-500/20"
                                    }`}
                                  >
                                    {Math.round(arg.strength * 100)}% strength
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {arg.speaker}
                                  </span>
                                  <ChevronRight className="w-3 h-3" />
                                  <span>{arg.topic}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {arg.premises.map((premise, j) => (
                                    <span key={j} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                      {premise}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Contrarian Candidates */}
                      {selectedEpisode.result.contrarian_candidates.length > 0 && (
                        <Card className="card-glow border-destructive/20">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              Contrarian Candidates
                            </CardTitle>
                            <CardDescription>
                              Potential guests with opposing viewpoints for balanced discussions
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {selectedEpisode.result.contrarian_candidates.map((candidate, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{candidate.name}</span>
                                    <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                      {candidate.score.toFixed(2)}
                                    </Badge>
                                  </div>
                                  <Badge variant="outline" className="text-xs mb-2 bg-muted/50">
                                    {candidate.expertise}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">{candidate.reason}</p>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Related Trending Topics */}
                      {selectedEpisode.result.suggestedTrendingTopics.length > 0 && (
                        <Card className="card-glow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="w-5 h-5 text-orange-400" />
                              Related Trending Topics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              {selectedEpisode.result.suggestedTrendingTopics.map((topic, i) => (
                                <Badge 
                                  key={i} 
                                  variant="outline" 
                                  className="cursor-pointer hover:bg-orange-500/10 transition-colors"
                                >
                                  <Flame className="w-3 h-3 mr-1 text-orange-400" />
                                  {topic.title}
                                  <span className="ml-1 text-orange-400">{topic.heat}%</span>
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}

                  {/* Transcript */}
                  <Card className="card-glow">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Original Transcript
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted/30 p-4 rounded-lg max-h-[300px] overflow-y-auto">
                        {selectedEpisode.transcript}
                      </pre>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
