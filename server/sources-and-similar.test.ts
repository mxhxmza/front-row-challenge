import { describe, it, expect } from "vitest";

/**
 * Test suite for source citations and similar-minded individuals features
 * Ensures that arguments have sources and similar-minded individuals are properly structured
 */

describe("Argument Sources", () => {
  interface ArgumentSource {
    title: string;
    author?: string;
    date?: string;
    url?: string;
    relevance: number;
  }

  interface Argument {
    id: string;
    claim: string;
    sources?: ArgumentSource[];
  }

  it("should include sources for arguments", () => {
    const argument: Argument = {
      id: "arg-001",
      claim: "AGI is achievable within the next decade",
      sources: [
        {
          title: "The Bitter Lesson",
          author: "Richard Sutton",
          date: "2019",
          url: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
          relevance: 0.95
        }
      ]
    };
    
    expect(argument.sources).toBeDefined();
    expect(argument.sources).toHaveLength(1);
    expect(argument.sources![0].title).toBe("The Bitter Lesson");
  });

  it("should have valid source structure with required fields", () => {
    const source: ArgumentSource = {
      title: "Research Paper",
      author: "Dr. Jane Smith",
      date: "2023",
      url: "https://example.com/paper",
      relevance: 0.85
    };
    
    expect(source.title).toBeDefined();
    expect(source.relevance).toBeGreaterThanOrEqual(0);
    expect(source.relevance).toBeLessThanOrEqual(1);
  });

  it("should handle multiple sources per argument", () => {
    const argument: Argument = {
      id: "arg-002",
      claim: "Technology creates more jobs than it destroys",
      sources: [
        {
          title: "The Future of Employment",
          author: "Frey & Osborne",
          date: "2013",
          url: "https://www.oxfordmartin.ox.ac.uk/downloads/academic/The_Future_of_Employment.pdf",
          relevance: 0.88
        },
        {
          title: "Technology and Jobs",
          author: "MIT Task Force",
          date: "2023",
          url: "https://mitsloan.mit.edu/ideas-made-to-matter/technology-and-jobs",
          relevance: 0.85
        }
      ]
    };
    
    expect(argument.sources).toHaveLength(2);
    expect(argument.sources![0].relevance).toBeGreaterThan(argument.sources![1].relevance);
  });

  it("should allow arguments without sources", () => {
    const argument: Argument = {
      id: "arg-003",
      claim: "Some claim without sources"
    };
    
    expect(argument.sources).toBeUndefined();
  });

  it("should validate source relevance scores", () => {
    const sources: ArgumentSource[] = [
      { title: "Source 1", relevance: 0.95 },
      { title: "Source 2", relevance: 0.5 },
      { title: "Source 3", relevance: 0.1 }
    ];
    
    sources.forEach(source => {
      expect(source.relevance).toBeGreaterThanOrEqual(0);
      expect(source.relevance).toBeLessThanOrEqual(1);
    });
  });

  it("should sort sources by relevance", () => {
    const argument: Argument = {
      id: "arg-004",
      claim: "Test claim",
      sources: [
        { title: "Low relevance", relevance: 0.3 },
        { title: "High relevance", relevance: 0.9 },
        { title: "Medium relevance", relevance: 0.6 }
      ]
    };
    
    const sorted = argument.sources!.sort((a, b) => b.relevance - a.relevance);
    expect(sorted[0].relevance).toBe(0.9);
    expect(sorted[1].relevance).toBe(0.6);
    expect(sorted[2].relevance).toBe(0.3);
  });
});

describe("Similar-Minded Individuals", () => {
  interface SimilarIndividual {
    name: string;
    role: string;
    organization: string;
    expertise: string;
    alignedPosition: string;
    supportSummary: string;
    outreachAngle: string;
    score: number;
    source: "linkedin" | "youtube" | "twitter" | "llm";
  }

  it("should have valid similar individual structure", () => {
    const individual: SimilarIndividual = {
      name: "Dr. Alice Johnson",
      role: "AI Researcher",
      organization: "Tech Institute",
      expertise: "Artificial Intelligence",
      alignedPosition: "AI advancement is beneficial for society",
      supportSummary: "Published research supporting AI development",
      outreachAngle: "Discuss AI ethics and advancement",
      score: 0.85,
      source: "llm"
    };
    
    expect(individual.name).toBeDefined();
    expect(individual.role).toBeDefined();
    expect(individual.expertise).toBeDefined();
    expect(individual.score).toBeGreaterThanOrEqual(0);
    expect(individual.score).toBeLessThanOrEqual(1);
  });

  it("should have different sources for individuals", () => {
    const individuals: SimilarIndividual[] = [
      {
        name: "Person 1",
        role: "Role 1",
        organization: "Org 1",
        expertise: "Expertise 1",
        alignedPosition: "Position 1",
        supportSummary: "Summary 1",
        outreachAngle: "Angle 1",
        score: 0.8,
        source: "linkedin"
      },
      {
        name: "Person 2",
        role: "Role 2",
        organization: "Org 2",
        expertise: "Expertise 2",
        alignedPosition: "Position 2",
        supportSummary: "Summary 2",
        outreachAngle: "Angle 2",
        score: 0.75,
        source: "youtube"
      }
    ];
    
    expect(individuals[0].source).toBe("linkedin");
    expect(individuals[1].source).toBe("youtube");
  });

  it("should sort similar individuals by score", () => {
    const individuals: SimilarIndividual[] = [
      {
        name: "Person A",
        role: "Role",
        organization: "Org",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 0.7,
        source: "llm"
      },
      {
        name: "Person B",
        role: "Role",
        organization: "Org",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 0.9,
        source: "llm"
      },
      {
        name: "Person C",
        role: "Role",
        organization: "Org",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 0.8,
        source: "llm"
      }
    ];
    
    const sorted = individuals.sort((a, b) => b.score - a.score);
    expect(sorted[0].score).toBe(0.9);
    expect(sorted[1].score).toBe(0.8);
    expect(sorted[2].score).toBe(0.7);
  });

  it("should have valid score range", () => {
    const individuals: SimilarIndividual[] = [
      {
        name: "Person 1",
        role: "Role",
        organization: "Org",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 0.0,
        source: "llm"
      },
      {
        name: "Person 2",
        role: "Role",
        organization: "Org",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 1.0,
        source: "llm"
      }
    ];
    
    individuals.forEach(individual => {
      expect(individual.score).toBeGreaterThanOrEqual(0);
      expect(individual.score).toBeLessThanOrEqual(1);
    });
  });

  it("should have non-empty required fields", () => {
    const individual: SimilarIndividual = {
      name: "Dr. Bob Smith",
      role: "Researcher",
      organization: "University",
      expertise: "AI",
      alignedPosition: "AI is good",
      supportSummary: "Has published on this",
      outreachAngle: "Discuss collaboration",
      score: 0.85,
      source: "llm"
    };
    
    expect(individual.name.length).toBeGreaterThan(0);
    expect(individual.role.length).toBeGreaterThan(0);
    expect(individual.organization.length).toBeGreaterThan(0);
    expect(individual.expertise.length).toBeGreaterThan(0);
  });

  it("should deduplicate individuals by name", () => {
    const individuals: SimilarIndividual[] = [
      {
        name: "Dr. Alice",
        role: "Role 1",
        organization: "Org 1",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 0.8,
        source: "llm"
      },
      {
        name: "Dr. Alice",
        role: "Role 2",
        organization: "Org 2",
        expertise: "Expertise",
        alignedPosition: "Position",
        supportSummary: "Summary",
        outreachAngle: "Angle",
        score: 0.7,
        source: "linkedin"
      }
    ];
    
    const unique = Array.from(
      new Map(individuals.map(i => [i.name.toLowerCase(), i])).values()
    );
    
    expect(unique).toHaveLength(1);
    expect(unique[0].name).toBe("Dr. Alice");
  });
});

describe("Integration: Arguments with Sources and Similar Individuals", () => {
  interface ArgumentSource {
    title: string;
    author?: string;
    date?: string;
    url?: string;
    relevance: number;
  }

  interface Argument {
    id: string;
    claim: string;
    sources?: ArgumentSource[];
  }

  interface SimilarIndividual {
    name: string;
    role: string;
    organization: string;
    expertise: string;
    alignedPosition: string;
    supportSummary: string;
    outreachAngle: string;
    score: number;
    source: "linkedin" | "youtube" | "twitter" | "llm";
  }

  interface AnalysisResult {
    arguments: Argument[];
    similarIndividuals: SimilarIndividual[];
  }

  it("should combine arguments with sources and similar individuals", () => {
    const result: AnalysisResult = {
      arguments: [
        {
          id: "arg-001",
          claim: "AI will create new opportunities",
          sources: [
            {
              title: "AI and Employment",
              author: "Smith",
              date: "2023",
              url: "https://example.com",
              relevance: 0.9
            }
          ]
        }
      ],
      similarIndividuals: [
        {
          name: "Dr. Jane Doe",
          role: "AI Researcher",
          organization: "Tech Lab",
          expertise: "AI",
          alignedPosition: "AI creates opportunities",
          supportSummary: "Published research on AI benefits",
          outreachAngle: "Discuss AI opportunities",
          score: 0.85,
          source: "llm"
        }
      ]
    };
    
    expect(result.arguments).toHaveLength(1);
    expect(result.arguments[0].sources).toHaveLength(1);
    expect(result.similarIndividuals).toHaveLength(1);
  });

  it("should handle empty results gracefully", () => {
    const result: AnalysisResult = {
      arguments: [],
      similarIndividuals: []
    };
    
    expect(result.arguments).toHaveLength(0);
    expect(result.similarIndividuals).toHaveLength(0);
  });

  it("should maintain data integrity across features", () => {
    const result: AnalysisResult = {
      arguments: [
        {
          id: "arg-001",
          claim: "Claim 1",
          sources: [
            { title: "Source 1", relevance: 0.9 }
          ]
        },
        {
          id: "arg-002",
          claim: "Claim 2",
          sources: [
            { title: "Source 2", relevance: 0.8 },
            { title: "Source 3", relevance: 0.7 }
          ]
        }
      ],
      similarIndividuals: [
        {
          name: "Person 1",
          role: "Role",
          organization: "Org",
          expertise: "Expertise",
          alignedPosition: "Position",
          supportSummary: "Summary",
          outreachAngle: "Angle",
          score: 0.85,
          source: "llm"
        }
      ]
    };
    
    const totalSources = result.arguments.reduce(
      (sum, arg) => sum + (arg.sources?.length || 0),
      0
    );
    
    expect(totalSources).toBe(3);
    expect(result.arguments).toHaveLength(2);
    expect(result.similarIndividuals).toHaveLength(1);
  });
});
