/*
  Design: Neural Constellation
  Transcript Demo Component - Interactive argument extraction demonstration
*/

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Sample transcripts for demo
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
  }
];

// Mock argument extraction function
interface Argument {
  id: string;
  speaker: string;
  claim: string;
  topic: string;
  strength: number;
  type: "claim" | "premise" | "rebuttal";
  premises: string[];
  contrarian_potential: number;
}

interface ExtractionResult {
  arguments: Argument[];
  topics: string[];
  sentiment: { positive: number; neutral: number; negative: number };
  contrarian_candidates: { name: string; reason: string; score: number }[];
}

const extractArguments = (text: string): ExtractionResult => {
  // Simulate argument extraction based on text content
  const hasAI = text.toLowerCase().includes("ai") || text.toLowerCase().includes("artificial");
  const hasStartup = text.toLowerCase().includes("startup") || text.toLowerCase().includes("venture") || text.toLowerCase().includes("funding");
  const hasWork = text.toLowerCase().includes("work") || text.toLowerCase().includes("job");
  
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
      contrarian_potential: 0.85
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
  
  // Add a generic argument if nothing specific found
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
    { name: "Dr. Gary Marcus", reason: "Known AI skeptic with opposing views on AGI timeline", score: -0.68 },
    { name: "Yann LeCun", reason: "Advocates for different AI architectures", score: -0.45 },
    { name: "Marc Andreessen", reason: "Strong proponent of growth-focused investing", score: -0.72 }
  ].filter(() => Math.random() > 0.3);
  
  return {
    arguments: arguments_list,
    topics,
    sentiment: {
      positive: 0.35 + Math.random() * 0.2,
      neutral: 0.4 + Math.random() * 0.1,
      negative: 0.1 + Math.random() * 0.1
    },
    contrarian_candidates: contrarian_candidates.slice(0, 2)
  };
};

export default function TranscriptDemo() {
  const [transcript, setTranscript] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (!transcript.trim()) {
      toast.error("Please enter or select a transcript to analyze");
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearInterval(progressInterval);
    setProgress(100);

    // Extract arguments
    const extractedResult = extractArguments(transcript);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setResult(extractedResult);
    setIsAnalyzing(false);
    toast.success(`Extracted ${extractedResult.arguments.length} arguments from transcript`);
  }, [transcript]);

  const handleSampleSelect = (sample: typeof sampleTranscripts[0]) => {
    setTranscript(sample.text);
    setResult(null);
    toast.info(`Loaded sample: "${sample.title}"`);
  };

  const handleCopyResult = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      toast.success("Results copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="demo" className="py-24 relative">
      <div className="container">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Interactive Demo
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Try It Yourself</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Paste a podcast transcript or select a sample to see how the AI agent extracts 
            key arguments, identifies topics, and suggests contrarian candidates.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-glow h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Transcript Input
                </CardTitle>
                <CardDescription>
                  Paste your transcript or choose a sample below
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sample Buttons */}
                <div className="flex flex-wrap gap-2">
                  {sampleTranscripts.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSampleSelect(sample)}
                      className="text-xs"
                    >
                      {sample.title}
                    </Button>
                  ))}
                </div>

                {/* Textarea */}
                <Textarea
                  placeholder="Paste your podcast transcript here..."
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    setResult(null);
                  }}
                  className="min-h-[280px] bg-card border-border resize-none font-mono text-sm"
                />

                {/* Character Count */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{transcript.length} characters</span>
                  <span>{transcript.split(/\s+/).filter(Boolean).length} words</span>
                </div>

                {/* Analyze Button */}
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isAnalyzing || !transcript.trim()}
                  className="w-full glow-cyan"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Extract Arguments
                    </>
                  )}
                </Button>

                {/* Progress Bar */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <Progress value={progress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-center">
                        {progress < 30 && "Parsing transcript..."}
                        {progress >= 30 && progress < 60 && "Identifying arguments..."}
                        {progress >= 60 && progress < 90 && "Analyzing viewpoints..."}
                        {progress >= 90 && "Generating results..."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="card-glow h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-secondary" />
                    Extraction Results
                  </CardTitle>
                  {result && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyResult}
                      className="text-xs"
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
                <CardDescription>
                  Extracted arguments and contrarian candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {!result && !isAnalyzing && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[400px] text-muted-foreground"
                    >
                      <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
                      <p className="text-center">
                        Enter a transcript and click "Extract Arguments" to see results
                      </p>
                    </motion.div>
                  )}

                  {isAnalyzing && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[400px]"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="mt-4 text-muted-foreground">Processing transcript...</p>
                    </motion.div>
                  )}

                  {result && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 max-h-[450px] overflow-y-auto pr-2"
                    >
                      {/* Topics */}
                      <div>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            Topics Identified
                          </Badge>
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.topics.map((topic, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Arguments */}
                      <div>
                        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                            {result.arguments.length} Arguments Extracted
                          </Badge>
                        </h4>
                        <div className="space-y-3">
                          {result.arguments.map((arg, i) => (
                            <motion.div
                              key={arg.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="p-3 rounded-lg bg-card border border-border"
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <p className="font-medium text-sm">{arg.claim}</p>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs shrink-0 ${
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
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {arg.speaker}
                                </span>
                                <ChevronRight className="w-3 h-3" />
                                <span>{arg.topic}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {arg.premises.map((premise, j) => (
                                  <span key={j} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                    {premise}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Contrarian Candidates */}
                      {result.contrarian_candidates.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Contrarian Candidates
                            </Badge>
                          </h4>
                          <div className="space-y-2">
                            {result.contrarian_candidates.map((candidate, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className="p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{candidate.name}</span>
                                  <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                                    Score: {candidate.score.toFixed(2)}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{candidate.reason}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
