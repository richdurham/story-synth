import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { sendNote, getNotesByRecipient, markNoteAsRead } from "../gameDb";

/**
 * Notes Router
 * Provides endpoints for private player-to-player communication
 */
export const notesRouter = router({
  /**
   * POST /api/trpc/notes.send
   * Sends a private note from one player to another
   */
  send: protectedProcedure
    .input(
      z.object({
        senderRole: z.string(),
        recipientRole: z.string(),
        content: z.string().min(1).max(5000),
      })
    )
    .mutation(async ({ input }) => {
      await sendNote(input.senderRole, input.recipientRole, input.content);
      return {
        status: "success",
        message: "Note sent successfully",
      };
    }),

  /**
   * GET /api/trpc/notes.getByRecipient
   * Retrieves all private notes addressed to a specific player role
   */
  getByRecipient: protectedProcedure
    .input(z.object({ recipientRole: z.string() }))
    .query(async ({ input }) => {
      const playerNotes = await getNotesByRecipient(input.recipientRole);
      return playerNotes.map(note => ({
        id: note.id,
        sender: note.senderRole,
        content: note.content,
        isRead: note.isRead === 1,
        timestamp: note.createdAt.toISOString(),
      }));
    }),

  /**
   * POST /api/trpc/notes.markAsRead
   * Marks a note as read
   */
  markAsRead: protectedProcedure
    .input(z.object({ noteId: z.number() }))
    .mutation(async ({ input }) => {
      await markNoteAsRead(input.noteId);
      return {
        status: "success",
        message: "Note marked as read",
      };
    }),
});
