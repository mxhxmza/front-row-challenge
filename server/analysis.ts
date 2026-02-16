/**
 * Dynamic Transcript Analysis Module
 * 
 * Uses LLM to extract unique topics and arguments from transcripts,
 * then searches LinkedIn, YouTube, and Twitter to find real contrarian individuals.
 */

import { invokeLLM } from "./_core/llm";
import { callDataApi } from "./_core/dataApi";

// Types for extracted data
export interface ExtractedArgument {
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

export interface ExtractedTopic {
  name: string;
  description: string;
  searchQuery: string;
  contrarian_angle: string;
}

export interface ContrarianIndividual {
  name: string;
  role: string;
  organization: string;
  expertise: string;
  opposingPosition: string;
  counterSummary: string;
  outreachAngle: string;
  score: number;
  source: "linkedin" | "youtube" | "twitter" | "llm";
  email?: string;
}

export interface AnalysisResult {
  arguments: ExtractedArgument[];
  topics: ExtractedTopic[];
  sentiment: { positive: number; neutral: number; negative: number };
  contrarianIndividuals: ContrarianIndividual[];
  singlishTerms: string[];
  localRelevance: number;
}

// Singlish dictionary for detection
const singlishTerms = [
  "lah", "lor", "leh", "sia", "hor", "meh", "wah", "aiyo", "alamak",
  "shiok", "kiasu", "kiasi", "bo jio", "jialat", "sian", "blur",
  "chim", "atas", "lepak", "makan", "kopitiam", "hawker", "hdb",
  "coe", "cpf", "ns", "pap", "grc", "sme", "temasek", "gic",
  "skillsfuture", "pioneer generation", "merdeka generation",
  "kampung", "void deck", "mama shop", "pasar malam", "wet market",
  "angmoh", "sinkie", "ah beng", "ah lian", "uncle", "auntie",
  "can or not", "steady", "wayang", "kaypoh", "bo chap", "tahan"
];

// Detect Singlish terms in text
function detectSinglish(text: string): { terms: string[]; relevance: number } {
  const lowerText = text.toLowerCase();
  const found = singlishTerms.filter(term => lowerText.includes(term));
  const relevance = Math.min(1, found.length * 0.1 + 0.2);
  return { terms: found, relevance };
}

// Extract arguments and topics using LLM
export async function extractArgumentsWithLLM(transcript: string): Promise<{
  arguments: ExtractedArgument[];
  topics: ExtractedTopic[];
  sentiment: { positive: number; neutral: number; negative: number };
}> {
  console.log("[Analysis] Extracting arguments with LLM...");
  
  const systemPrompt = `You are an expert podcast analyst specializing in argument mining and topic extraction.
Analyze the given podcast transcript and extract:
1. Key arguments (claims, premises, rebuttals)
2. Main topics discussed
3. Overall sentiment

For each topic, also suggest a search query to find contrarian viewpoints and describe what a contrarian position might look like.

Focus on extracting UNIQUE and SPECIFIC arguments from this particular transcript - do not use generic templates.
Pay special attention to Singapore-specific context, Singlish expressions, and local references.`;

  const userPrompt = `Analyze this podcast transcript and extract the key arguments and topics:

${transcript.substring(0, 8000)}

Return a JSON object with this exact structure:
{
  "arguments": [
    {
      "id": "arg-001",
      "speaker": "Guest or Host",
      "claim": "The specific claim made",
      "topic": "Topic category",
      "strength": 0.0-1.0,
      "type": "claim|premise|rebuttal",
      "premises": ["Supporting point 1", "Supporting point 2"],
      "contrarian_potential": 0.0-1.0
    }
  ],
  "topics": [
    {
      "name": "Topic Name",
      "description": "Brief description of the topic as discussed",
      "searchQuery": "Search query to find experts on this topic",
      "contrarian_angle": "What a contrarian viewpoint might argue"
    }
  ],
  "sentiment": {
    "positive": 0.0-1.0,
    "neutral": 0.0-1.0,
    "negative": 0.0-1.0
  }
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "transcript_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              arguments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    speaker: { type: "string" },
                    claim: { type: "string" },
                    topic: { type: "string" },
                    strength: { type: "number" },
                    type: { type: "string", enum: ["claim", "premise", "rebuttal"] },
                    premises: { type: "array", items: { type: "string" } },
                    contrarian_potential: { type: "number" }
                  },
                  required: ["id", "speaker", "claim", "topic", "strength", "type", "premises", "contrarian_potential"],
                  additionalProperties: false
                }
              },
              topics: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                    searchQuery: { type: "string" },
                    contrarian_angle: { type: "string" }
                  },
                  required: ["name", "description", "searchQuery", "contrarian_angle"],
                  additionalProperties: false
                }
              },
              sentiment: {
                type: "object",
                properties: {
                  positive: { type: "number" },
                  neutral: { type: "number" },
                  negative: { type: "number" }
                },
                required: ["positive", "neutral", "negative"],
                additionalProperties: false
              }
            },
            required: ["arguments", "topics", "sentiment"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      console.log(`[Analysis] Extracted ${parsed.arguments?.length || 0} arguments and ${parsed.topics?.length || 0} topics`);
      return parsed;
    }
    throw new Error("Invalid LLM response format");
  } catch (error) {
    console.error("[Analysis] LLM extraction failed:", error);
    // Return empty result on failure
    return {
      arguments: [],
      topics: [],
      sentiment: { positive: 0.33, neutral: 0.34, negative: 0.33 }
    };
  }
}

// Search LinkedIn for experts on a topic
async function searchLinkedIn(topic: ExtractedTopic): Promise<ContrarianIndividual[]> {
  console.log(`[Analysis] Searching LinkedIn for: ${topic.searchQuery}`);
  
  try {
    const result = await callDataApi("LinkedIn/search_people", {
      query: {
        keywords: topic.searchQuery,
        keywordTitle: topic.name
      }
    }) as { success?: boolean; data?: { items?: Array<{
      fullName?: string;
      headline?: string;
      location?: string;
      profileURL?: string;
      username?: string;
    }> } };

    if (!result?.success || !result?.data?.items) {
      console.log(`[Analysis] No LinkedIn results for: ${topic.searchQuery}`);
      return [];
    }

    const individuals: ContrarianIndividual[] = result.data.items.slice(0, 3).map((person, idx) => ({
      name: person.fullName || "Unknown",
      role: person.headline?.split(" at ")[0] || "Professional",
      organization: person.headline?.split(" at ")[1] || person.location || "Unknown",
      expertise: topic.name,
      opposingPosition: topic.contrarian_angle,
      counterSummary: `Expert in ${topic.name} with potential contrarian perspective on the discussed claims.`,
      outreachAngle: `Connect regarding their expertise in ${topic.name} and discuss alternative viewpoints.`,
      platforms: person.profileURL ? [{ name: "LinkedIn", url: person.profileURL }] : [],
      score: 0.7 - (idx * 0.1),
      source: "linkedin" as const,
      profileUrl: person.profileURL,
      linkedin: person.username ? `https://linkedin.com/in/${person.username}` : undefined
    }));

    console.log(`[Analysis] Found ${individuals.length} LinkedIn profiles for: ${topic.name}`);
    return individuals;
  } catch (error) {
    console.error(`[Analysis] LinkedIn search failed for ${topic.name}:`, error);
    return [];
  }
}

// Search YouTube for content creators on a topic
async function searchYouTube(topic: ExtractedTopic): Promise<ContrarianIndividual[]> {
  console.log(`[Analysis] Searching YouTube for: ${topic.searchQuery}`);
  
  try {
    const result = await callDataApi("Youtube/search", {
      query: {
        q: `${topic.searchQuery} debate opinion`,
        hl: "en",
        gl: "SG"
      }
    }) as { contents?: Array<{
      type?: string;
      video?: {
        channelTitle?: string;
        channelId?: string;
        title?: string;
        descriptionSnippet?: string;
      };
      channel?: {
        title?: string;
        channelId?: string;
        subscriberCountText?: string;
      };
    }> };

    if (!result?.contents) {
      console.log(`[Analysis] No YouTube results for: ${topic.searchQuery}`);
      return [];
    }

    const individuals: ContrarianIndividual[] = [];
    const seenChannels = new Set<string>();

    for (const content of result.contents) {
      if (individuals.length >= 2) break;
      
      let channelName = "";
      let channelId = "";
      
      if (content.type === "video" && content.video) {
        channelName = content.video.channelTitle || "";
        channelId = content.video.channelId || "";
      } else if (content.type === "channel" && content.channel) {
        channelName = content.channel.title || "";
        channelId = content.channel.channelId || "";
      }
      
      if (channelName && channelId && !seenChannels.has(channelId)) {
        seenChannels.add(channelId);
        individuals.push({
          name: channelName,
          role: "Content Creator",
          organization: "YouTube",
          expertise: topic.name,
          opposingPosition: topic.contrarian_angle,
          counterSummary: `Creates content about ${topic.name} with potentially different perspectives.`,
          outreachAngle: `Reach out for podcast collaboration on ${topic.name}.`,
          score: 0.65,
          source: "youtube" as const
        });
      }
    }

    console.log(`[Analysis] Found ${individuals.length} YouTube creators for: ${topic.name}`);
    return individuals;
  } catch (error) {
    console.error(`[Analysis] YouTube search failed for ${topic.name}:`, error);
    return [];
  }
}

// Use LLM to suggest contrarian individuals based on topic
async function suggestContrarianWithLLM(topics: ExtractedTopic[], transcript: string): Promise<ContrarianIndividual[]> {
  console.log("[Analysis] Using LLM to suggest contrarian individuals...");
  
  const topicSummary = topics.map(t => `- ${t.name}: ${t.contrarian_angle}`).join("\n");
  
  const systemPrompt = `You are an expert at identifying thought leaders and experts who hold contrarian views.
Based on the topics discussed in a podcast, suggest real, verifiable individuals who might offer opposing perspectives.
Focus on:
1. Academics and researchers with published work
2. Industry practitioners with public profiles
3. Authors and thought leaders
4. For Singapore topics, include local experts and regional voices

Only suggest people who are real and can be found online. Include their known affiliations.`;

  const userPrompt = `Based on these podcast topics and contrarian angles, suggest 4-6 real individuals who might offer opposing viewpoints:

Topics and Contrarian Angles:
${topicSummary}

Brief transcript context:
${transcript.substring(0, 2000)}

Return a JSON array of individuals with this structure:
[
  {
    "name": "Full Name",
    "role": "Their title/role",
    "organization": "Their organization",
    "expertise": "Their area of expertise",
    "opposingPosition": "What contrarian view they might hold",
    "counterSummary": "Why they would be a good contrarian guest",
    "outreachAngle": "How to approach them for the podcast",
    "twitter": "@handle if known",
    "linkedin": "linkedin URL if known"
  }
]`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "contrarian_suggestions",
          strict: true,
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                role: { type: "string" },
                organization: { type: "string" },
                expertise: { type: "string" },
                opposingPosition: { type: "string" },
                counterSummary: { type: "string" },
                outreachAngle: { type: "string" },
                twitter: { type: "string" },
                linkedin: { type: "string" }
              },
              required: ["name", "role", "organization", "expertise", "opposingPosition", "counterSummary", "outreachAngle", "twitter", "linkedin"],
              additionalProperties: false
            }
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      const suggestions = JSON.parse(content) as Array<{
        name: string;
        role: string;
        organization: string;
        expertise: string;
        opposingPosition: string;
        counterSummary: string;
        outreachAngle: string;
        twitter?: string;
        linkedin?: string;
      }>;
      
      const individuals: ContrarianIndividual[] = suggestions
        .map((s, idx) => {
          // Only include social media links if they are valid and not empty strings
          const platforms = [];
          
          // Add Twitter only if it's a valid handle
          if (s.twitter && s.twitter.trim() && s.twitter !== "N/A" && s.twitter !== "unknown") {
            const handle = s.twitter.replace("@", "").trim();
            if (handle.length > 0) {
              platforms.push({ name: "Twitter", url: `https://twitter.com/${handle}` });
            }
          }
          
          // Add LinkedIn only if it's a valid URL
          if (s.linkedin && s.linkedin.trim() && s.linkedin !== "N/A" && s.linkedin !== "unknown" && s.linkedin.includes("linkedin")) {
            platforms.push({ name: "LinkedIn", url: s.linkedin });
          }
          
          return {
            name: s.name,
            role: s.role,
            organization: s.organization,
            expertise: s.expertise,
            opposingPosition: s.opposingPosition,
            counterSummary: s.counterSummary,
            outreachAngle: s.outreachAngle,
            platforms,
            score: 0.8 - (idx * 0.05),
            source: "llm" as const,
            twitter: s.twitter && s.twitter.trim() && s.twitter !== "N/A" && s.twitter !== "unknown" ? s.twitter : undefined,
            linkedin: s.linkedin && s.linkedin.trim() && s.linkedin !== "N/A" && s.linkedin !== "unknown" && s.linkedin.includes("linkedin") ? s.linkedin : undefined
          };
        })
        .filter(individual => individual.platforms.length > 0 || individual.name.length > 0);

      console.log(`[Analysis] LLM suggested ${individuals.length} contrarian individuals`);
      return individuals;
    }
    return [];
  } catch (error) {
    console.error("[Analysis] LLM suggestion failed:", error);
    return [];
  }
}

// Main analysis function
export async function analyzeTranscript(transcript: string): Promise<AnalysisResult> {
  console.log("[Analysis] Starting transcript analysis...");
  console.log(`[Analysis] Transcript length: ${transcript.length} characters`);
  
  // Detect Singlish
  const singlish = detectSinglish(transcript);
  console.log(`[Analysis] Found ${singlish.terms.length} Singlish terms`);
  
  // Extract arguments and topics with LLM
  const { arguments: extractedArgs, topics, sentiment } = await extractArgumentsWithLLM(transcript);
  
  // Add Singlish terms to arguments
  const argumentsWithSinglish = extractedArgs.map(arg => ({
    ...arg,
    singlishTerms: singlish.terms.filter(term => 
      arg.claim.toLowerCase().includes(term) || 
      arg.premises.some(p => p.toLowerCase().includes(term))
    )
  }));
  
  // Search for contrarian individuals from multiple sources
  const allIndividuals: ContrarianIndividual[] = [];
  
  // Search LinkedIn and YouTube for each topic (limit to top 3 topics)
  const topTopics = topics.slice(0, 3);
  
  for (const topic of topTopics) {
    const linkedInResults = await searchLinkedIn(topic);
    allIndividuals.push(...linkedInResults);
    
    const youtubeResults = await searchYouTube(topic);
    allIndividuals.push(...youtubeResults);
  }
  
  // Get LLM suggestions
  const llmSuggestions = await suggestContrarianWithLLM(topics, transcript);
  allIndividuals.push(...llmSuggestions);
  
  // Deduplicate by name and sort by score
  const uniqueIndividuals = Array.from(
    new Map(allIndividuals.map(i => [i.name.toLowerCase(), i])).values()
  ).sort((a, b) => b.score - a.score).slice(0, 8);
  
  console.log(`[Analysis] Final result: ${argumentsWithSinglish.length} arguments, ${topics.length} topics, ${uniqueIndividuals.length} contrarian individuals`);
  
  return {
    arguments: argumentsWithSinglish,
    topics,
    sentiment,
    contrarianIndividuals: uniqueIndividuals,
    singlishTerms: singlish.terms,
    localRelevance: singlish.relevance
  };
}
