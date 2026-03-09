import { invokeLLM } from "./_core/llm";
import { ArgumentSource, ExtractedArgument } from "./analysis";

// Known reliable domains for sources
const RELIABLE_DOMAINS = [
  "arxiv.org",
  "researchgate.net",
  "scholar.google.com",
  "ieee.org",
  "acm.org",
  "nature.com",
  "science.org",
  "sciencedirect.com",
  "jstor.org",
  "springer.com",
  "wiley.com",
  "cambridge.org",
  "oxford.org",
  "harvard.edu",
  "mit.edu",
  "stanford.edu",
  "berkeley.edu",
  "cmu.edu",
  "nyu.edu",
  "yale.edu",
  "princeton.edu",
  "caltech.edu",
  "bbc.com",
  "bbc.co.uk",
  "reuters.com",
  "apnews.com",
  "theguardian.com",
  "nytimes.com",
  "washingtonpost.com",
  "wsj.com",
  "ft.com",
  "economist.com",
  "forbes.com",
  "bloomberg.com",
  "cnbc.com",
  "cnn.com",
  "businessinsider.com",
  "techcrunch.com",
  "wired.com",
  "theverge.com",
  "arstechnica.com",
  "slashdot.org",
  "hbr.org",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "youtube.com",
  "ted.com",
  "goodreads.com",
  "amazon.com",
  "amazon.co.uk",
  "github.com",
  "stackoverflow.com",
  "wikipedia.org",
  "britannica.com",
  "ilo.org",
  "worldbank.org",
  "imf.org",
  "un.org",
  "oecd.org",
  "weforum.org",
  "mckinsey.com",
  "bcg.com",
  "bain.com",
  "pwc.com",
  "deloitte.com",
  "accenture.com",
  "brookings.edu",
  "rand.org",
  "csis.org",
  "cfr.org",
  "foreignaffairs.com",
  "foreignpolicy.com",
  "technologyreview.com",
  "nber.org",
  "ssrn.com",
  "papers.ssrn.com",
  "openai.com",
  "deepmind.com",
  "anthropic.com",
  "huggingface.co",
  "medium.com",
  "substack.com",
  "quora.com",
  "reddit.com",
  "news.ycombinator.com"
];

// Validate URL format and domain
function validateUrlFormat(url: string): string | null {
  try {
    let cleanUrl = url.trim();
    
    // Skip obviously invalid URLs
    if (!cleanUrl || cleanUrl.length < 10) {
      return null;
    }
    
    // Check for truncation markers
    if (cleanUrl.includes("...") || cleanUrl.endsWith("...") || cleanUrl.includes("[...")) {
      return null;
    }
    
    // Check for placeholder text
    if (cleanUrl.includes("example.com") || cleanUrl.includes("placeholder") || 
        cleanUrl.includes("sample") || cleanUrl.includes("your-") ||
        cleanUrl.includes("INSERT") || cleanUrl.includes("REPLACE")) {
      return null;
    }
    
    // Add protocol if missing
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    
    // Parse and validate URL structure
    const urlObj = new URL(cleanUrl);
    
    // Check for invalid characters or encoding issues
    if (cleanUrl.includes("//") && !cleanUrl.startsWith("http")) {
      return null;
    }
    
    // Validate domain exists
    const hostname = urlObj.hostname.toLowerCase();
    if (!hostname || hostname.length < 3) {
      return null;
    }
    
    // Check for obviously fake domains
    if (hostname === "localhost" || hostname === "127.0.0.1" || 
        hostname.includes("test") && hostname.includes("example")) {
      return null;
    }
    
    return cleanUrl;
  } catch (error) {
    return null;
  }
}

// Check if URL is from a reliable source
function isReliableDomain(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    // Check against reliable domains list
    return RELIABLE_DOMAINS.some(domain => hostname === domain || hostname.endsWith("." + domain));
  } catch {
    return false;
  }
}

// Verify URL is accessible (with timeout and error handling)
// Only runs in production, skipped in tests
async function verifyUrlAccessible(url: string): Promise<boolean> {
  // Skip verification in test environment
  if (process.env.NODE_ENV === "test" || process.env.VITEST) {
    return true;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      signal: controller.signal,
      redirect: "follow"
    }).catch(() => null);
    
    clearTimeout(timeoutId);
    
    if (!response) {
      return false;
    }
    
    // Accept 2xx and 3xx status codes (redirects are ok)
    // Reject 4xx (not found) and 5xx (server errors)
    const status = response.status;
    
    // Explicitly reject common error pages
    if (status === 404 || status === 410 || status === 451) {
      return false;
    }
    
    // Accept successful responses and redirects
    return status >= 200 && status < 400;
  } catch (error) {
    return false;
  }
}

// Extract sources and references for arguments
export async function extractArgumentSources(
  extractedArgs: ExtractedArgument[],
  transcript: string
): Promise<ExtractedArgument[]> {
  console.log("[Analysis] Extracting sources for arguments...");

  if (extractedArgs.length === 0) {
    return extractedArgs;
  }

  const argumentSummary = extractedArgs
    .slice(0, 5) // Focus on top 5 arguments
    .map((arg, idx) => `${idx + 1}. [${arg.id}] "${arg.claim}" (by ${arg.speaker})`)
    .join("\n");

  const systemPrompt = `You are an expert researcher who identifies sources and references for podcast arguments.
Given key arguments from a podcast transcript, suggest credible sources, research papers, articles, and references that support or relate to these arguments.
For each argument, provide:
1. Academic papers or research from established institutions
2. News articles from major publications
3. Books or reports from reputable publishers
4. Expert opinions or interviews from recognized experts

CRITICAL REQUIREMENTS:
- ONLY suggest URLs from well-known, established sources (academic institutions, major news outlets, research organizations)
- Do NOT generate or hallucinate URLs - only use real, well-known sources
- Ensure all URLs are complete, valid, and accessible
- Do NOT truncate URLs or use placeholder URLs
- Prefer sources from: arxiv.org, nature.com, science.org, major universities, Reuters, BBC, Guardian, NYT, WSJ, etc.
- If you are not certain a URL is real and accessible, do NOT include it`;

  const userPrompt = `Based on these key arguments from a podcast transcript, suggest sources and references ONLY from well-known, established sources:

Arguments:
${argumentSummary}

Transcript excerpt:
${transcript.substring(0, 3000)}

Return a JSON object with this structure:
{
  "sources": [
    {
      "argumentId": "arg-001",
      "argumentClaim": "The specific claim made",
      "sources": [
        {
          "title": "Source Title",
          "url": "https://example.com/full-complete-url",
          "author": "Author Name",
          "date": "2024-01-15",
          "relevance": 0.9
        }
      ]
    }
  ]
}

CRITICAL: Only include URLs from well-known sources. If uncertain about a URL's validity, omit it.
Do not generate fake or hallucinated URLs. Quality over quantity - fewer real sources are better than many broken links.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "argument_sources",
          strict: true,
          schema: {
            type: "object",
            properties: {
              sources: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    argumentId: { type: "string" },
                    argumentClaim: { type: "string" },
                    sources: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          url: { type: "string" },
                          author: { type: "string" },
                          date: { type: "string" },
                          relevance: { type: "number" }
                        },
                        required: ["title", "url", "author", "date", "relevance"],
                        additionalProperties: false
                      }
                    }
                  },
                  required: ["argumentId", "argumentClaim", "sources"],
                  additionalProperties: false
                }
              }
            },
            required: ["sources"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (typeof content === "string") {
      const result = JSON.parse(content) as {
        sources: Array<{
          argumentId: string;
          argumentClaim?: string;
          sources: ArgumentSource[];
        }>;
      };

      // Map sources back to arguments by ID and claim text
      const sourceMap = new Map<string, ArgumentSource[]>();
      
      for (const sourceEntry of result.sources) {
        // Validate URLs and filter out broken/unreliable ones
        const validatedSources: ArgumentSource[] = [];
        
        for (const source of sourceEntry.sources) {
          const validUrl = validateUrlFormat(source.url);
          
          if (!validUrl) {
            console.warn(`[Analysis] Invalid URL format: ${source.url}`);
            continue;
          }
          
          // Check if from reliable domain
          if (!isReliableDomain(validUrl)) {
            console.warn(`[Analysis] URL from unreliable domain: ${validUrl}`);
            continue;
          }
          
          // Verify URL is accessible (skipped in tests)
          const isAccessible = await verifyUrlAccessible(validUrl);
          if (!isAccessible) {
            console.warn(`[Analysis] URL not accessible or returns error: ${validUrl}`);
            continue;
          }
          
          validatedSources.push({
            ...source,
            url: validUrl
          });
        }

        if (validatedSources.length === 0) {
          console.warn(`[Analysis] No valid, accessible URLs found for argument: ${sourceEntry.argumentId}`);
          continue;
        }

        const matchingArg = extractedArgs.find(a => a.id === sourceEntry.argumentId);
        if (matchingArg) {
          sourceMap.set(matchingArg.id, validatedSources);
        } else if (sourceEntry.argumentClaim) {
          const claimText = sourceEntry.argumentClaim;
          const claimMatch = extractedArgs.find(a => 
            a.claim.toLowerCase().includes(claimText.substring(0, 30).toLowerCase()) ||
            claimText.toLowerCase().includes(a.claim.substring(0, 30).toLowerCase())
          );
          if (claimMatch) {
            sourceMap.set(claimMatch.id, validatedSources);
          }
        }
      }

      const argumentsWithSources = extractedArgs.map((arg) => ({
        ...arg,
        sources: sourceMap.get(arg.id) || []
      }));

      const validSourceCount = argumentsWithSources.filter((a) => a.sources && a.sources.length > 0).length;
      console.log(
        `[Analysis] Added valid, verified sources to ${validSourceCount} arguments`
      );
      return argumentsWithSources;
    }
    return extractedArgs;
  } catch (error) {
    console.error("[Analysis] Source extraction failed:", error);
    return extractedArgs;
  }
}
