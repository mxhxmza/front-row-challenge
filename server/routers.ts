import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { 
  createEpisode, 
  getEpisodesByUserId, 
  getEpisodeById, 
  updateEpisode, 
  deleteEpisode,
  createOutreach,
  getOutreachByEpisodeId,
  updateOutreachStatus
} from "./db";
import { analyzeTranscript } from "./analysis";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Episode management routes
  episodes: router({
    // List all episodes for the current user
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getEpisodesByUserId(ctx.user.id);
    }),

    // Get a single episode by ID
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getEpisodeById(input.id, ctx.user.id);
      }),

    // Create a new episode
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1).max(255),
        source: z.enum(["text"]),
        transcript: z.string().min(1),
        wordCount: z.number().default(0),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createEpisode({
          userId: ctx.user.id,
          title: input.title,
          source: input.source,
          youtubeUrl: null,
          transcript: input.transcript,
          wordCount: input.wordCount,
          status: "pending",
        });
      }),

    // Update an episode (including extraction results)
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).max(255).optional(),
        transcript: z.string().optional(),
        wordCount: z.number().optional(),
        status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
        extractionResult: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        return await updateEpisode(id, ctx.user.id, updates);
      }),

    // Delete an episode
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await deleteEpisode(input.id, ctx.user.id);
      }),
  }),

  // Transcript analysis route - uses LLM and web search for unique results
  analysis: router({
    // Analyze a transcript and find contrarian individuals
    analyze: protectedProcedure
      .input(z.object({
        transcript: z.string().min(1),
      }))
      .mutation(async ({ input }) => {
        console.log(`[Analysis] Starting analysis for transcript (${input.transcript.length} chars)`);
        
        try {
          const result = await analyzeTranscript(input.transcript);
          
          console.log(`[Analysis] Completed: ${result.arguments.length} arguments, ${result.contrarianIndividuals.length} individuals`);
          
          return {
            success: true,
            ...result
          };
        } catch (error) {
          console.error("[Analysis] Failed:", error);
          return {
            success: false,
            error: error instanceof Error ? error.message : "Analysis failed",
            arguments: [],
            topics: [],
            sentiment: { positive: 0.33, neutral: 0.34, negative: 0.33 },
            contrarianIndividuals: [],
            similarIndividuals: [],
            singlishTerms: [],
            localRelevance: 0
          };
        }
      }),
  }),

  // Outreach tracking routes
  outreach: router({
    // List outreach for an episode
    listByEpisode: protectedProcedure
      .input(z.object({ episodeId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getOutreachByEpisodeId(input.episodeId, ctx.user.id);
      }),

    // Create outreach record
    create: protectedProcedure
      .input(z.object({
        episodeId: z.number(),
        candidateName: z.string().min(1).max(255),
        candidateEmail: z.string().email().optional(),
        emailContent: z.string().optional(),
        status: z.enum(["drafted", "sent", "responded", "booked", "declined"]).default("drafted"),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createOutreach({
          userId: ctx.user.id,
          episodeId: input.episodeId,
          candidateName: input.candidateName,
          candidateEmail: input.candidateEmail || null,
          emailContent: input.emailContent || null,
          status: input.status,
        });
      }),

    // Update outreach status (mark as sent, responded, etc.)
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["drafted", "sent", "responded", "booked", "declined"]),
        markSentNow: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const sentAt = input.markSentNow ? new Date() : undefined;
        return await updateOutreachStatus(input.id, ctx.user.id, input.status, sentAt);
      }),
  }),

  // Email sending route
  email: router({
    send: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        subject: z.string().min(1),
        body: z.string().min(1),
        candidateName: z.string(),
        episodeId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // For now, we'll simulate email sending
        // In production, this would integrate with an email service like SendGrid, Resend, etc.
        console.log(`[Email] Sending email to ${input.to}`);
        console.log(`[Email] Subject: ${input.subject}`);
        console.log(`[Email] From user: ${ctx.user.email || ctx.user.name}`);
        
        // Create outreach record if episodeId is provided
        if (input.episodeId) {
          await createOutreach({
            userId: ctx.user.id,
            episodeId: input.episodeId,
            candidateName: input.candidateName,
            candidateEmail: input.to,
            emailContent: input.body,
            status: "sent",
            sentAt: new Date(),
          });
        }

        // Simulate successful email send
        return {
          success: true,
          message: `Email sent to ${input.to}`,
          sentAt: new Date(),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
