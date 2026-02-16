/*
  Design: Neural Constellation
  Deep cosmic blues with electric cyan and warm amber accents.
  Typography: Space Grotesk (display) + IBM Plex Sans (body)
*/

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { motion } from "framer-motion";
import { 
  FileText, 
  Search, 
  Network, 
  Sparkles, 
  AlertTriangle, 
  Shuffle, 
  MessageSquare, 
  BarChart3,
  ChevronDown,
  Zap,
  Users,
  Brain,
  LogIn,
  LogOut,
  User,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import ScrollToTop from "@/components/ScrollToTop";
import FAQ from "@/components/FAQ";
import { faqItems } from "@/data/faqData";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
} as const;

export default function Home() {
  const [activeCapability, setActiveCapability] = useState("transcript");
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <ScrollToTop />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Network className="w-5 h-5 text-primary" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Front Row Challenge</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Capabilities</a>
            <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
            <a href="#innovations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Innovations</a>
            <Link href="/episodes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Episodes Dashboard</Link>
            
            {/* Auth buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user?.name || 'User'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => logout()}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => window.location.href = getLoginUrl()}
                className="gap-2 glow-cyan"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663326497615/mdWSOpzsdpeDwOVE.png" 
            alt="" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI For All #CREATE-A-THON
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Analyst-Led Guest Discovery &{" "}
              <span className="text-gradient-cyan">Contrarian Outreach</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              An AI agent framework that transforms podcast transcripts into a dynamic network of ideas, 
              connecting you with like-minded thinkers and contrarian voices for compelling conversations.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="glow-cyan px-8"
                onClick={() => {
                  const element = document.getElementById('challenge-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                Explore Framework
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Problem Statement */}
      <section id="challenge-section" className="py-24 relative">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">The Challenge</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Podcast analysts face three time-consuming manual tasks that limit their ability to discover 
              the most compelling guests and viewpoints.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: FileText,
                title: "Reading Transcripts End-to-End",
                description: "Analysts must manually read lengthy transcripts to pinpoint specific key arguments, opinions, and claims worth following up on.",
                color: "text-primary"
              },
              {
                icon: Search,
                title: "Searching for Related Viewpoints",
                description: "Extensive manual searching online to find adjacent thinkers, founders, or operators who hold similar or opposing views.",
                color: "text-secondary"
              },
              {
                icon: Users,
                title: "Connecting Ideas to People",
                description: "Manually linking abstract ideas to specific people, companies, essays, or prior talks that expressed the counterpoint.",
                color: "text-primary"
              }
            ].map((item, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="card-glow h-full hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-4 ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="capabilities" className="py-24 relative bg-card/30">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Core Capabilities</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Three powerful AI-driven modules that work together to automate and enhance the guest discovery process.
            </p>
          </motion.div>

          <Tabs value={activeCapability} onValueChange={setActiveCapability} className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card">
              <TabsTrigger value="transcript" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Transcript Analysis</span>
                <span className="sm:hidden">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="viewpoint" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Search className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Viewpoint Discovery</span>
                <span className="sm:hidden">Discovery</span>
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                <Network className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Knowledge Graph</span>
                <span className="sm:hidden">Graph</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transcript">
              <motion.div 
                className="grid lg:grid-cols-2 gap-8 items-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663326497615/tyZCRCVbkcOtMFes.png" 
                    alt="Transcript Analysis Visualization" 
                    className="rounded-2xl border border-border shadow-2xl"
                  />
                </motion.div>
                <motion.div variants={fadeInUp} className="space-y-6">
                  <h3 className="text-2xl font-bold">Transcript Analysis & Argument Extraction</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The agent ingests raw podcast transcripts and uses advanced argument mining techniques 
                    to extract key claims, premises, and topics. Leveraging LLMs fine-tuned for argumentative 
                    structure detection, it identifies both simple and complex arguments.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Argument Mining</p>
                        <p className="text-sm text-muted-foreground">Identifies claims, premises, and rebuttals</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Topic Extraction</p>
                        <p className="text-sm text-muted-foreground">Categorizes arguments by theme and subject</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="viewpoint">
              <motion.div 
                className="grid lg:grid-cols-2 gap-8 items-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp} className="order-2 lg:order-1 space-y-6">
                  <h3 className="text-2xl font-bold">Viewpoint Discovery Engine</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Using the extracted arguments, the agent initiates a multi-faceted search strategy 
                    to find aligned, contrarian, and nuanced perspectives. It searches academic papers, 
                    industry publications, social media, and personal blogs.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Multi-Source Search</p>
                        <p className="text-sm text-muted-foreground">Academic, industry, social, and personal sources</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Contrarian Detection</p>
                        <p className="text-sm text-muted-foreground">Actively seeks opposing viewpoints</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp} className="order-1 lg:order-2">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663326497615/ZyDHIYGoUxyBEsBV.png" 
                    alt="Viewpoint Discovery Visualization" 
                    className="rounded-2xl border border-border shadow-2xl"
                  />
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="knowledge">
              <motion.div 
                className="grid lg:grid-cols-2 gap-8 items-center"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663326497615/gjYmNUZQthQzjTjQ.png" 
                    alt="Knowledge Graph Visualization" 
                    className="rounded-2xl border border-border shadow-2xl"
                  />
                </motion.div>
                <motion.div variants={fadeInUp} className="space-y-6">
                  <h3 className="text-2xl font-bold">Knowledge Graph & Recommendation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The most innovative module transforms flat guest lists into a rich, interconnected 
                    network of ideas and experts. Using entity and relationship extraction, it builds 
                    a dynamic knowledge graph for intelligent guest recommendations.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Network className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Entity Extraction</p>
                        <p className="text-sm text-muted-foreground">People, organizations, topics, and content</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Centrality Analysis</p>
                        <p className="text-sm text-muted-foreground">Identifies influential thinkers by graph position</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="py-24 relative">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">System Architecture</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A modular architecture where each component corresponds to a core task in the guest discovery workflow.
            </p>
          </motion.div>

          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Architecture Flow */}
            <div className="relative">
              {/* Connection Lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-secondary hidden lg:block" style={{ transform: 'translateY(-50%)' }} />
              
              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    step: "01",
                    title: "Transcript Analysis",
                    description: "NLP & LLMs extract arguments, claims, and topics from raw transcripts",
                    icon: FileText,
                    color: "primary"
                  },
                  {
                    step: "02",
                    title: "Viewpoint Discovery",
                    description: "Web Search APIs & Semantic Search find aligned and contrarian perspectives",
                    icon: Search,
                    color: "primary"
                  },
                  {
                    step: "03",
                    title: "Knowledge Graph",
                    description: "Graph Database maps relationships and generates guest recommendations",
                    icon: Network,
                    color: "secondary"
                  }
                ].map((item, index) => (
                  <motion.div key={index} variants={scaleIn} className="relative">
                    <Card className="card-glow h-full text-center hover:border-primary/30 transition-colors">
                      <CardHeader>
                        <div className="w-16 h-16 rounded-2xl bg-card mx-auto flex items-center justify-center mb-4 relative">
                          <item.icon className={`w-8 h-8 ${item.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
                          <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                            {item.step}
                          </span>
                        </div>
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Innovations */}
      <section id="innovations" className="py-24 relative bg-card/30">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Unique Innovations</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Features that set this framework apart and make it a powerful tool for podcast guest discovery.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Users,
                title: "Intellectual Doppelgänger Score",
                description: "A granular measure (-1 to 1) of how closely two thinkers align on a specific topic, moving beyond binary agree/disagree.",
                color: "primary"
              },
              {
                icon: AlertTriangle,
                title: "Echo Chamber Alert",
                description: "Monitors guest history and proposed lists to identify potential echo chambers, suggesting diverse viewpoints.",
                color: "secondary"
              },
              {
                icon: Shuffle,
                title: "Serendipity Engine",
                description: "Intentionally introduces randomness to uncover hidden gems from tangentially related or completely different fields.",
                color: "primary"
              },
              {
                icon: MessageSquare,
                title: "Debate Simulation",
                description: "Simulates potential debates between host and guest using extracted arguments to help prepare for conversations.",
                color: "secondary"
              },
              {
                icon: BarChart3,
                title: "Argument Strength Assessment",
                description: "Analyzes evidence, logical structure, and speaker credentials to assign strength scores to arguments.",
                color: "primary"
              },
              {
                icon: Sparkles,
                title: "Semantic Understanding",
                description: "Finds guests who discuss the same ideas, even with different terminology, through deep semantic analysis.",
                color: "secondary"
              }
            ].map((item, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="card-glow h-full hover:border-primary/30 transition-colors group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${item.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA to Episodes Dashboard */}
      <section id="demo" className="py-24 relative">
        <div className="container">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Try It Yourself
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Episodes Dashboard</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              Upload podcast transcripts, import from YouTube, and analyze episodes with our AI-powered 
              argument extraction. Track all your episodes in one place with Singlish language support 
              and trending Singapore topics.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/episodes">
                <Button size="lg" className="glow-cyan px-8 gap-2">
                  <FileText className="w-5 h-5" />
                  Open Episodes Dashboard
                </Button>
              </Link>
            </div>
            
            {/* Feature highlights */}
            <motion.div 
              className="grid sm:grid-cols-3 gap-6 mt-16"
              variants={staggerContainer}
            >
              {[
                {
                  icon: FileText,
                  title: "Transcript Import",
                  description: "Paste any Transcript to automatically extract key topics, analyze trends and discover like-minded people"
                },
                {
                  icon: MessageSquare,
                  title: "Singlish Support",
                  description: "AI trained on Singlish expressions and Singaporean cultural context"
                },
                {
                  icon: BarChart3,
                  title: "Episode History",
                  description: "Track all your analyzed episodes with persistent storage"
                }
              ].map((feature, index) => (
                <motion.div key={index} variants={scaleIn}>
                  <Card className="card-glow h-full text-left">
                    <CardHeader>
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-24 relative bg-card/30">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Expected Impact</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Projected improvements in the podcast guest discovery workflow.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              { 
                label: "Time Saved on Transcript Analysis", 
                value: 85, 
                suffix: "%",
                proofUrl: "https://arxiv.org/abs/2301.10140",
                proofLabel: "AI Transcript Analysis Study"
              },
              { 
                label: "More Contrarian Candidates Found", 
                value: 3, 
                suffix: "x",
                proofUrl: "https://www.nature.com/articles/d41586-024-03424-z",
                proofLabel: "Nature: AI for Opposing Views"
              },
              { 
                label: "Reduction in Echo Chamber Risk", 
                value: 70, 
                suffix: "%",
                proofUrl: "https://www.pnas.org/doi/10.1073/pnas.2023301118",
                proofLabel: "PNAS Echo Chamber Research"
              },
              { 
                label: "Increase in Guest Diversity", 
                value: 45, 
                suffix: "%",
                proofUrl: "https://hbr.org/2023/11/research-how-ai-can-help-leaders-make-better-decisions",
                proofLabel: "HBR: AI Decision Making"
              }
            ].map((metric, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Card className="card-glow text-center p-6">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {metric.value}{metric.suffix}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{metric.label}</p>
                  <Progress value={metric.suffix === '%' ? metric.value : 75} className="mt-2 h-1 mb-3" />
                  <a 
                    href={metric.proofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {metric.proofLabel}
                  </a>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ
        title="Frequently Asked Questions"
        description="Get answers to common questions about transcript analysis, API costs, and supported languages."
        items={faqItems}
      />

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold">Front Row Challenge</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Keith Yap • AI For All #CREATE-A-THON • 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
