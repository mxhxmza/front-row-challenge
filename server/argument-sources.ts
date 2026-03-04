import { invokeLLM } from "./_core/llm";
import { ArgumentSource, ExtractedArgument } from "./analysis";

// Validate and clean URLs
function validateAndCleanUrl(url: string): string | null {
  try {
    // Remove any trailing characters that might have been added
    let cleanUrl = url.trim();
    
    // Check if URL starts with http or https
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      cleanUrl = "https://" + cleanUrl;
    }
    
    // Try to parse the URL to validate it
    const urlObj = new URL(cleanUrl);
    
    // Check for common issues
    if (cleanUrl.includes("...") || cleanUrl.endsWith("...")) {
      console.warn(`[Analysis] URL appears truncated: ${cleanUrl}`);
      return null;
    }
    
    // Return the valid URL
    return cleanUrl;
  } catch (error) {
    console.warn(`[Analysis] Invalid URL: ${url}`);
    return null;
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
1. Academic papers or research
2. News articles or publications
3. Books or reports
4. Expert opinions or interviews

IMPORTANT: Only provide complete, valid URLs that are accessible. Do not truncate URLs or use placeholder URLs.
Ensure all URLs are fully formed and can be accessed directly.`;

  const userPrompt = `Based on these key arguments from a podcast transcript, suggest sources and references:

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

IMPORTANT: Ensure all URLs are complete and accessible. Do not truncate or use incomplete URLs.`;

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
        // Validate and clean URLs before storing
        const validatedSources = sourceEntry.sources
          .map(source => ({
            ...source,
            url: validateAndCleanUrl(source.url)
          }))
          .filter((source): source is ArgumentSource => source.url !== null);

        if (validatedSources.length === 0) {
          console.warn(`[Analysis] No valid URLs found for argument: ${sourceEntry.argumentId}`);
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
        `[Analysis] Added valid sources to ${validSourceCount} arguments`
      );
      return argumentsWithSources;
    }
    return extractedArgs;
  } catch (error) {
    console.error("[Analysis] Source extraction failed:", error);
    return extractedArgs;
  }
}
