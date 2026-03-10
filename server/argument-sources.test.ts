import { describe, it, expect, vi, beforeEach } from "vitest";
import { extractArgumentSources } from "./argument-sources";
import { ExtractedArgument } from "./analysis";

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { invokeLLM } from "./_core/llm";

describe("Argument Sources - URL Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should validate and clean valid URLs", async () => {
    const mockLLMResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              sources: [
                {
                  argumentId: "arg-001",
                  argumentClaim: "AI will change work",
                  sources: [
                    {
                      title: "The Future of Jobs Report 2023",
                      url: "https://www.weforum.org/publications/the-future-of-jobs-report-2023/",
                      author: "World Economic Forum",
                      date: "2023-04-30",
                      relevance: 0.95,
                    },
                    {
                      title: "AI in the Workplace",
                      url: "https://hbr.org/2023/10/ai-in-the-workplace-a-new-era-of-collaboration-and-innovation",
                      author: "Harvard Business Review",
                      date: "2023-10-01",
                      relevance: 0.9,
                    },
                  ],
                },
              ],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValue(mockLLMResponse as any);

    const args: ExtractedArgument[] = [
      {
        id: "arg-001",
        claim: "AI will change work",
        speaker: "Guest",
        strength: 0.9,
        sources: [],
      },
    ];

    const result = await extractArgumentSources(args, "test transcript");

    expect(result).toHaveLength(1);
    expect(result[0].sources).toHaveLength(2);
    expect(result[0].sources[0].title).toBe("The Future of Jobs Report 2023");
    expect(result[0].sources[1].title).toBe("AI in the Workplace");
  });

  it("should filter out truncated URLs", async () => {
    const mockLLMResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              sources: [
                {
                  argumentId: "arg-001",
                  argumentClaim: "AI will change work",
                  sources: [
                    {
                      title: "Valid Source",
                      url: "https://www.nature.com/articles/s41586-023-06169-4",
                      author: "Author",
                      date: "2023-01-01",
                      relevance: 0.9,
                    },
                    {
                      title: "Truncated Source",
                      url: "https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/generative-ai-the-productivity-catalyst...",
                      author: "McKinsey",
                      date: "2023-01-01",
                      relevance: 0.8,
                    },
                  ],
                },
              ],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValue(mockLLMResponse as any);

    const args: ExtractedArgument[] = [
      {
        id: "arg-001",
        claim: "AI will change work",
        speaker: "Guest",
        strength: 0.9,
        sources: [],
      },
    ];

    const result = await extractArgumentSources(args, "test transcript");

    // Should only have the valid source, truncated one should be filtered
    expect(result[0].sources).toHaveLength(1);
    expect(result[0].sources[0].title).toBe("Valid Source");
  });

  it("should add https:// to URLs without protocol", async () => {
    const mockLLMResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              sources: [
                {
                  argumentId: "arg-001",
                  argumentClaim: "AI will change work",
                  sources: [
                    {
                      title: "Example Source",
                      url: "www.arxiv.org/abs/2108.07258",
                      author: "Author",
                      date: "2023-01-01",
                      relevance: 0.9,
                    },
                  ],
                },
              ],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValue(mockLLMResponse as any);

    const args: ExtractedArgument[] = [
      {
        id: "arg-001",
        claim: "AI will change work",
        speaker: "Guest",
        strength: 0.9,
        sources: [],
      },
    ];

    const result = await extractArgumentSources(args, "test transcript");

    expect(result[0].sources).toHaveLength(1);
    expect(result[0].sources[0].title).toBe("Example Source");
  });

  it("should handle empty sources gracefully", async () => {
    const mockLLMResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              sources: [],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValue(mockLLMResponse as any);

    const args: ExtractedArgument[] = [
      {
        id: "arg-001",
        claim: "AI will change work",
        speaker: "Guest",
        strength: 0.9,
        sources: [],
      },
    ];

    const result = await extractArgumentSources(args, "test transcript");

    expect(result).toHaveLength(1);
    expect(result[0].sources).toHaveLength(0);
  });

  it("should handle LLM errors gracefully", async () => {
    vi.mocked(invokeLLM).mockRejectedValue(new Error("LLM error"));

    const args: ExtractedArgument[] = [
      {
        id: "arg-001",
        claim: "AI will change work",
        speaker: "Guest",
        strength: 0.9,
        sources: [],
      },
    ];

    const result = await extractArgumentSources(args, "test transcript");

    // Should return original arguments unchanged
    expect(result).toHaveLength(1);
    expect(result[0].sources).toHaveLength(0);
  });

  it("should match arguments by claim text when ID doesn't match", async () => {
    const mockLLMResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              sources: [
                {
                  argumentId: "unknown-id",
                  argumentClaim: "AI will fundamentally change how we work",
                  sources: [
                    {
                      title: "Source",
                      url: "https://www.bbc.com/news/science_and_environment",
                      author: "Author",
                      date: "2023-01-01",
                      relevance: 0.9,
                    },
                  ],
                },
              ],
            }),
          },
        },
      ],
    };

    vi.mocked(invokeLLM).mockResolvedValue(mockLLMResponse as any);

    const args: ExtractedArgument[] = [
      {
        id: "arg-001",
        claim: "AI will fundamentally change how we work in the next five years",
        speaker: "Guest",
        strength: 0.9,
        sources: [],
      },
    ];

    const result = await extractArgumentSources(args, "test transcript");

    // Should match by claim text and add sources
    expect(result[0].sources).toHaveLength(1);
    expect(result[0].sources[0].title).toBe("Source");
  });
});
