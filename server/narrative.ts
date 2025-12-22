import { invokeLLM } from "./_core/llm";

/**
 * Narrative Generation Module
 * Generates AI-driven story outcomes based on player decisions and game state
 */

export interface NarrativeInput {
  issueTitle: string;
  issueDescription: string;
  playerRole: string;
  resolutionChoice: string;
  currentVariables: Record<string, number>;
  gameContext?: string;
}

export interface NarrativeOutput {
  narrative: string;
  stateChanges: Record<string, number>;
  success: boolean;
}

/**
 * Generate a narrative outcome based on player decision
 * Uses the LLM to create contextual story text and determine state changes
 */
export async function generateNarrativeOutcome(input: NarrativeInput): Promise<NarrativeOutput> {
  const systemPrompt = `You are a master storyteller for a political role-playing game. Your role is to:
1. Generate compelling narrative outcomes based on player decisions
2. Determine how game variables (treasury, militarism, etc.) should change
3. Create consequences that feel meaningful and interconnected

When generating outcomes, consider:
- The player's role and their perspective
- The decision they made and its logical consequences
- How other factions might react
- Long-term implications for the kingdom

Always respond with valid JSON in this exact format:
{
  "narrative": "A 2-3 sentence narrative describing the outcome",
  "stateChanges": {
    "variable_name": change_value
  },
  "success": true
}`;

  const userPrompt = `Current Issue: "${input.issueTitle}"
Description: ${input.issueDescription}

Player Role: ${input.playerRole}
Player Decision: ${input.resolutionChoice}

Current Game State:
${Object.entries(input.currentVariables)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

${input.gameContext ? `Additional Context: ${input.gameContext}` : ""}

Generate a narrative outcome and determine how the game variables should change based on this decision. Return valid JSON.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "narrative_outcome",
          strict: true,
          schema: {
            type: "object",
            properties: {
              narrative: {
                type: "string",
                description: "The narrative outcome of the player's decision",
              },
              stateChanges: {
                type: "object",
                description: "Changes to game variables",
                additionalProperties: { type: "number" },
              },
              success: {
                type: "boolean",
                description: "Whether the action was successful",
              },
            },
            required: ["narrative", "stateChanges", "success"],
            additionalProperties: false,
          },
        },
      },
    });

    // Extract the JSON response from the LLM
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from LLM");
    }

    const contentString = typeof content === "string" ? content : JSON.stringify(content);
    const result = JSON.parse(contentString);

    return {
      narrative: result.narrative || "The decision has been recorded.",
      stateChanges: result.stateChanges || {},
      success: result.success !== false,
    };
  } catch (error) {
    console.error("Error generating narrative:", error);
    // Return a fallback response
    return {
      narrative: "The decision has been recorded and will have consequences for the kingdom.",
      stateChanges: {},
      success: true,
    };
  }
}

/**
 * Generate a summary of the current game state for narrative context
 */
export async function generateGameSummary(
  issues: Array<{ title: string; description: string }>,
  variables: Record<string, number>,
  recentHistory?: string[]
): Promise<string> {
  const prompt = `Summarize the current state of this political role-playing game in 2-3 sentences:

Recent Issues:
${issues.map(i => `- ${i.title}: ${i.description}`).join("\n")}

Game Variables:
${Object.entries(variables)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

Recent Events:
${(recentHistory || []).map((event, i) => `${i + 1}. ${event}`).join("\n")}

Provide a brief, engaging summary that captures the political tension and current state of affairs.`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "You are a skilled game narrator. Summarize the current game state concisely.",
        },
        { role: "user", content: prompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    const contentString = typeof content === "string" ? content : JSON.stringify(content);
    return contentString || "The kingdom stands at a crossroads.";
  } catch (error) {
    console.error("Error generating game summary:", error);
    return "The kingdom stands at a crossroads.";
  }
}
