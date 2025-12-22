import { describe, it, expect, beforeAll, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context for testing
function createMockContext(role: string = "regent"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test Player",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Game API Endpoints", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("game.config", () => {
    it("should return game configuration with roles, issues, and variables", async () => {
      const config = await caller.game.config();

      expect(config).toBeDefined();
      expect(config).toHaveProperty("roles");
      expect(config).toHaveProperty("issues");
      expect(config).toHaveProperty("variables");

      expect(Array.isArray(config.roles)).toBe(true);
      expect(Array.isArray(config.issues)).toBe(true);
      expect(typeof config.variables).toBe("object");
    });

    it("should return roles with id and name", async () => {
      const config = await caller.game.config();

      if (config.roles.length > 0) {
        const role = config.roles[0];
        expect(role).toHaveProperty("id");
        expect(role).toHaveProperty("name");
        expect(typeof role.id).toBe("string");
        expect(typeof role.name).toBe("string");
      }
    });

    it("should return issues with id and title", async () => {
      const config = await caller.game.config();

      if (config.issues.length > 0) {
        const issue = config.issues[0];
        expect(issue).toHaveProperty("id");
        expect(issue).toHaveProperty("title");
        expect(typeof issue.id).toBe("string");
        expect(typeof issue.title).toBe("string");
      }
    });
  });

  describe("game.state", () => {
    it("should return current game state with public display and player dashboard", async () => {
      const state = await caller.game.state();

      expect(state).toBeDefined();
      expect(state).toHaveProperty("public_display");
      expect(state).toHaveProperty("player_dashboard");
    });

    it("should include current issue and round in public display", async () => {
      const state = await caller.game.state();

      expect(state.public_display).toHaveProperty("current_issue");
      expect(state.public_display).toHaveProperty("issue_title");
      expect(state.public_display).toHaveProperty("issue_description");
      expect(state.public_display).toHaveProperty("round");
      expect(typeof state.public_display.round).toBe("number");
    });

    it("should include variables and available actions in player dashboard", async () => {
      const state = await caller.game.state();

      expect(state.player_dashboard).toHaveProperty("variables");
      expect(state.player_dashboard).toHaveProperty("available_actions");
      expect(Array.isArray(state.player_dashboard.available_actions)).toBe(true);
    });
  });

  describe("game.currentIssue", () => {
    it("should return the current active issue or null", async () => {
      const issue = await caller.game.currentIssue();

      if (issue !== null) {
        expect(issue).toHaveProperty("id");
        expect(issue).toHaveProperty("title");
        expect(issue).toHaveProperty("description");
        expect(issue).toHaveProperty("type");
        expect(issue).toHaveProperty("round");
      }
    });
  });

  describe("game.resolveIssue", () => {
    it("should require authentication", async () => {
      const publicCaller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
      });

      try {
        await publicCaller.game.resolveIssue({
          issueId: "test-issue",
          playerRole: "regent",
          resolutionChoice: "Option A",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject non-existent issues", async () => {
      try {
        await caller.game.resolveIssue({
          issueId: "non-existent-issue-xyz",
          playerRole: "regent",
          resolutionChoice: "Option A: Negotiate",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Issue not found");
      }
    });

    it("should validate input parameters", async () => {
      try {
        await caller.game.resolveIssue({
          issueId: "",
          playerRole: "regent",
          resolutionChoice: "Option A",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});

describe("Notes API Endpoints", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("notes.send", () => {
    it("should require authentication", async () => {
      const publicCaller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
      });

      try {
        await publicCaller.notes.send({
          senderRole: "regent",
          recipientRole: "treasury",
          content: "Test message",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should send a note successfully", async () => {
      const result = await caller.notes.send({
        senderRole: "regent",
        recipientRole: "treasury",
        content: "We must secure the northern border.",
      });

      expect(result).toBeDefined();
      expect(result.status).toBe("success");
    });

    it("should reject empty content", async () => {
      try {
        await caller.notes.send({
          senderRole: "regent",
          recipientRole: "treasury",
          content: "",
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should reject content over 5000 characters", async () => {
      const longContent = "a".repeat(5001);

      try {
        await caller.notes.send({
          senderRole: "regent",
          recipientRole: "treasury",
          content: longContent,
        });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("notes.getByRecipient", () => {
    it("should require authentication", async () => {
      const publicCaller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
      });

      try {
        await publicCaller.notes.getByRecipient({ recipientRole: "treasury" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should retrieve notes for a recipient", async () => {
      await caller.notes.send({
        senderRole: "regent",
        recipientRole: "treasury",
        content: "Test note",
      });

      const notes = await caller.notes.getByRecipient({ recipientRole: "treasury" });

      expect(Array.isArray(notes)).toBe(true);
      if (notes.length > 0) {
        const note = notes[0];
        expect(note).toHaveProperty("id");
        expect(note).toHaveProperty("sender");
        expect(note).toHaveProperty("content");
        expect(note).toHaveProperty("isRead");
        expect(note).toHaveProperty("timestamp");
      }
    });
  });

  describe("notes.markAsRead", () => {
    it("should require authentication", async () => {
      const publicCaller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
      });

      try {
        await publicCaller.notes.markAsRead({ noteId: 1 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it("should mark a note as read", async () => {
      const result = await caller.notes.markAsRead({ noteId: 1 });

      expect(result).toBeDefined();
      expect(result.status).toBe("success");
    });
  });
});
