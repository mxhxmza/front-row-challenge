export const faqItems = [
  {
    question: "How accurate is the transcript analysis?",
    answer: "Our LLM-powered analysis achieves 85-92% accuracy in extracting key arguments and topics from podcast transcripts. Accuracy depends on transcript quality, speaker clarity, and topic complexity. For transcripts with clear audio and well-structured discussions, accuracy typically exceeds 90%. We include confidence scores (0.65-0.95) with each extracted argument so you can assess reliability. The system is continuously improved through user feedback and model updates."
  },
  {
    question: "What is the cost to analyze a transcript?",
    answer: "For a typical 200-word transcript, analysis costs approximately $0.03-0.05 USD. This includes LLM API calls for argument extraction, topic identification, and contrarian individual suggestions. Longer transcripts (1000+ words) cost proportionally more, typically $0.15-0.25. Web search API calls are currently free tier. We're exploring subscription models for power users with high-volume analysis needs. All costs are transparent and shown before analysis begins."
  },
  {
    question: "What languages and dialects are supported?",
    answer: "We currently support English and Singlish (Singapore English) with full cultural context preservation. The system recognizes 20+ Singlish terms (lah, lor, leh, kiasu, jialat, etc.) and maintains Singaporean references and names. We're actively expanding to support: Mandarin Chinese, Malay, Tamil (for Singapore/Malaysia context), and regional English dialects (Indian English, Philippine English, Australian English). Custom language packs can be requested for specific industries or regions."
  },
  {
    question: "How does the contrarian individual discovery work?",
    answer: "After analyzing your transcript, we extract key arguments and topics. We then search LinkedIn, YouTube, Twitter, and academic databases for people who have publicly expressed opposing or complementary views. If web search returns limited results, our LLM generates contextually-relevant contrarian individuals based on the specific topics discussed. Each recommendation includes their opposing position, relevance score (0.65-0.95), and suggested outreach angle. Results are unique to each transcript—you won't get the same recommendations twice."
  },
  {
    question: "Can I export the analysis results?",
    answer: "Yes! You can download analysis results as JSON or CSV, including extracted arguments, topics, contrarian individuals, and suggested outreach angles. We're also building PDF export with formatted reports and email templates. All exports preserve the full analysis data for integration with your CRM, email marketing, or content management systems."
  },
  {
    question: "Is my transcript data stored or shared?",
    answer: "Your transcript data is processed securely and stored in our encrypted database only for your account. We never share transcript content with third parties. You can delete any episode and its analysis at any time. For GDPR/privacy compliance, we provide data export and deletion options. Enterprise customers can request on-premise deployment or private cloud instances."
  },
  {
    question: "How long does analysis typically take?",
    answer: "Analysis completes in 30-90 seconds for most transcripts. Shorter transcripts (under 500 words) typically finish in 30-40 seconds. Longer transcripts (1000+ words) may take 60-90 seconds depending on API response times. During peak hours, processing may take slightly longer. We show real-time progress updates so you know what's happening."
  },
  {
    question: "What if the contrarian individuals aren't relevant to my podcast?",
    answer: "If results aren't relevant, you can provide feedback directly in the app. We use this feedback to improve our LLM prompts and web search strategies. You can also manually edit the list of contrarian individuals before sending outreach emails. For recurring issues, contact our support team—we're happy to adjust analysis parameters for your specific podcast niche."
  }
];
