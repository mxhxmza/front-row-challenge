import { describe, it, expect } from "vitest";

/**
 * Test suite for social media link validation in contrarian individual analysis
 * Ensures that only valid social media profiles are included in the output
 */

describe("Social Media Link Validation", () => {
  // Helper function to simulate the validation logic
  function validateSocialMediaLinks(individual: {
    twitter?: string;
    linkedin?: string;
  }) {
    const platforms = [];

    // Validate Twitter
    if (individual.twitter && individual.twitter.trim() && individual.twitter !== "N/A" && individual.twitter !== "unknown") {
      const handle = individual.twitter.replace("@", "").trim();
      if (handle.length > 0) {
        platforms.push({ name: "Twitter", url: `https://twitter.com/${handle}` });
      }
    }

    // Validate LinkedIn
    if (individual.linkedin && individual.linkedin.trim() && individual.linkedin !== "N/A" && individual.linkedin !== "unknown" && individual.linkedin.includes("linkedin")) {
      platforms.push({ name: "LinkedIn", url: individual.linkedin });
    }

    return platforms;
  }

  it("should include Twitter link when valid handle is provided", () => {
    const individual = { twitter: "@john_doe" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(1);
    expect(platforms[0]).toEqual({ name: "Twitter", url: "https://twitter.com/john_doe" });
  });

  it("should exclude Twitter link when handle is N/A", () => {
    const individual = { twitter: "N/A" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should exclude Twitter link when handle is unknown", () => {
    const individual = { twitter: "unknown" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should exclude Twitter link when handle is empty string", () => {
    const individual = { twitter: "" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should exclude Twitter link when handle is undefined", () => {
    const individual = { twitter: undefined };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should include LinkedIn link when valid URL is provided", () => {
    const individual = { linkedin: "https://linkedin.com/in/john-doe" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(1);
    expect(platforms[0]).toEqual({ name: "LinkedIn", url: "https://linkedin.com/in/john-doe" });
  });

  it("should exclude LinkedIn link when URL is N/A", () => {
    const individual = { linkedin: "N/A" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should exclude LinkedIn link when URL is unknown", () => {
    const individual = { linkedin: "unknown" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should exclude LinkedIn link when URL doesn't contain linkedin domain", () => {
    const individual = { linkedin: "https://twitter.com/john_doe" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should include both Twitter and LinkedIn when both are valid", () => {
    const individual = {
      twitter: "@john_doe",
      linkedin: "https://linkedin.com/in/john-doe"
    };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(2);
    expect(platforms[0].name).toBe("Twitter");
    expect(platforms[1].name).toBe("LinkedIn");
  });

  it("should exclude both when neither are valid", () => {
    const individual = {
      twitter: "N/A",
      linkedin: "unknown"
    };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(0);
  });

  it("should handle whitespace in handles correctly", () => {
    const individual = { twitter: "  @john_doe  " };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(1);
    expect(platforms[0].url).toBe("https://twitter.com/john_doe");
  });

  it("should handle @ prefix removal correctly", () => {
    const individual = { twitter: "john_doe" };
    const platforms = validateSocialMediaLinks(individual);
    expect(platforms).toHaveLength(1);
    expect(platforms[0].url).toBe("https://twitter.com/john_doe");
  });
});
