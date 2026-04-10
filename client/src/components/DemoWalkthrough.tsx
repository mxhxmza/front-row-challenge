import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DemoStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  details: string[];
}

const demoSteps: DemoStep[] = [
  {
    title: "Paste Your Transcript",
    description: "Start by pasting any podcast transcript into the text area",
    icon: "📝",
    color: "from-blue-500 to-cyan-500",
    details: [
      "Supports any podcast format",
      "Works with Singlish and local dialects",
      "No character limit"
    ]
  },
  {
    title: "AI Analysis",
    description: "Our LLM extracts key arguments, topics, and themes",
    icon: "🧠",
    color: "from-purple-500 to-pink-500",
    details: [
      "Identifies main arguments",
      "Extracts key topics",
      "Detects contrarian viewpoints"
    ]
  },
  {
    title: "Web Search",
    description: "We search the web for people discussing these topics",
    icon: "🔍",
    color: "from-orange-500 to-red-500",
    details: [
      "LinkedIn profiles",
      "YouTube channels",
      "Twitter thought leaders"
    ]
  },
  {
    title: "Contrarian Matching",
    description: "Find experts who disagree with the podcast's viewpoints",
    icon: "⚡",
    color: "from-green-500 to-emerald-500",
    details: [
      "Opposing viewpoints",
      "Verified sources",
      "Contact information"
    ]
  },
  {
    title: "Guest Recommendations",
    description: "Get a curated list of compelling future guests",
    icon: "🎯",
    color: "from-indigo-500 to-blue-500",
    details: [
      "Ranked by relevance",
      "Outreach suggestions",
      "Interview angles"
    ]
  }
];

export default function DemoWalkthrough() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentStep(prev => (prev + 1) % demoSteps.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
    setProgress(0);
    setIsAutoPlay(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setProgress(0);
    setIsAutoPlay(true);
  };

  const step = demoSteps[currentStep];

  return (
    <section className="py-24 relative bg-gradient-to-b from-background to-card/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Watch how Front Row Challenge transforms your podcast transcripts into guest discovery opportunities
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main Demo Area */}
          <motion.div
            className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10`} />

            {/* Content */}
            <div className="relative p-8 sm:p-12 min-h-[400px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Step Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring" }}
                    className="text-6xl sm:text-7xl"
                  >
                    {step.icon}
                  </motion.div>

                  {/* Step Title */}
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm font-semibold text-primary mb-2"
                    >
                      STEP {currentStep + 1} OF {demoSteps.length}
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-3xl sm:text-4xl font-bold mb-4"
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-lg text-muted-foreground"
                    >
                      {step.description}
                    </motion.p>
                  </div>

                  {/* Details */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="grid sm:grid-cols-3 gap-4 pt-6"
                  >
                    {step.details.map((detail, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>{detail}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-border">
              <motion.div
                className={`h-full bg-gradient-to-r ${step.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {demoSteps.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => {
                  setCurrentStep(idx);
                  setProgress(0);
                  setIsAutoPlay(false);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStep
                    ? "bg-primary w-8"
                    : "bg-border hover:bg-muted-foreground"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              className="gap-2"
            >
              ← Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="gap-2"
            >
              {isAutoPlay ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              className="gap-2"
            >
              Next →
            </Button>
          </div>


        </div>
      </div>
    </section>
  );
}
