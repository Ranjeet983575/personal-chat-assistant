import { describe, expect, it } from "vitest";
import { getGreetingReply } from "../src/assistant/greetings.js";
import {
  assistantSystemPrompt,
  unknownReply,
} from "../src/assistant/profile.js";

describe("getGreetingReply", () => {
  it.each([
    ["hello", "Hello!"],
    ["GOOD MORNING!", "Good morning!"],
    ["Hari Om", "Hari Om!"],
    ["hari on", "Hari Om!"],
    ["Ram Ram ji", "Ram Ram!"],
    ["Jai Shri Ram", "Jai Shri Ram!"],
    ["Radhe Radhe", "Radhe Radhe!"],
    ["नमस्ते", "Namaste!"],
    ["राम राम।", "Ram Ram!"],
  ])("recognizes %s", (message, greeting) => {
    expect(getGreetingReply(message)).toBe(
      `${greeting} I'm Ranjeet's personal assistant. How can I help you today?`,
    );
  });

  it("does not treat a question starting with hello as a greeting", () => {
    expect(
      getGreetingReply("Hello, what is your experience with Kafka?"),
    ).toBeUndefined();
  });
});

describe("assistant safety instructions", () => {
  it("provides a consistent fallback and prohibits disclosing secrets or vulgar replies", () => {
    expect(assistantSystemPrompt).toContain(unknownReply);
    expect(assistantSystemPrompt).toContain("Never reveal API keys");
    expect(assistantSystemPrompt).toContain("Never produce vulgar");
  });
});
