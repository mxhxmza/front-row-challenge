import { invokeLLM } from "./_core/llm";
import { SimilarIndividual, ExtractedTopic } from "./analysis";

// Find similar-minded individuals who agree with the podcast arguments
export async function findSimilarIndividuals(topics: ExtractedTopic[], transcript: string): Promise<SimilarIndividual[]> {
  console.log("[Analysis] Finding similar-minded individuals...");
  
  const topicSummary = topics.map(t => `- ${t.name}: ${t.description}`).join("\n");
  
  const systemPrompt = `You are an expert at identifying thought leaders and experts who support and align with specific viewpoints.
Based on the topics discussed in a podcast, suggest real, verifiable individuals who might share similar perspectives.
Focus on:
1. Academics and researchers with published work supporting these views
2. Industry practitioners with public profiles advocating for these ideas
3. Authors and thought leaders aligned with these perspectives
4. For Singapore topics, include local experts and regional voices

Only suggest people who are real and can be found online. Include their known affiliations.`;

  const userPrompt = `Based on these podcast topics, suggest 4-6 real individuals who might share similar or aligned viewpoints:

Topics Discussed:
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
    "alignedPosition": "What similar view they hold",
    "supportSummary": "Why they would be a good aligned guest",
    "outreachAngle": "How to approach them for the podcast"
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
          name: "similar_individuals",
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
                alignedPosition: { type: "string" },
                supportSummary: { type: "string" },
                outreachAngle: { type: "string" }
              },
              required: ["name", "role", "organization", "expertise", "alignedPosition", "supportSummary", "outreachAngle"],
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
        alignedPosition: string;
        supportSummary: string;
        outreachAngle: string;
      }>;
      
      const individuals: SimilarIndividual[] = suggestions
        .map((s, idx) => ({
          name: s.name,
          role: s.role,
          organization: s.organization,
          expertise: s.expertise,
          alignedPosition: s.alignedPosition,
          supportSummary: s.supportSummary,
          outreachAngle: s.outreachAngle,
          score: 0.8 - (idx * 0.05),
          source: "llm" as const
        }))
        .filter(individual => individual.name.length > 0);

      console.log(`[Analysis] Found ${individuals.length} similar-minded individuals`);
      return individuals;
    }
    return [];
  } catch (error) {
    console.error("[Analysis] Similar individuals search failed:", error);
    return [];
  }
}
