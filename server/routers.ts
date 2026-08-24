import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { protectedProcedure } from "./_core/trpc";
import { addTarget, confirmAuthorization, createPreviewJob, createWorkspace, ensureDefaultProfile, getWorkspace, listFindings, listProfiles, listRecentJobs, listTargets, listWorkspaces } from "./assessmentDb";
import { buildReport } from "./reporting";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

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

  assessment: router({
    workspaces: protectedProcedure.query(({ ctx }) => listWorkspaces(ctx.user.id)),
    getWorkspace: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => getWorkspace(ctx.user.id, input.workspaceId)),
    createWorkspace: protectedProcedure.input(z.object({ name: z.string().trim().min(3).max(160), description: z.string().trim().max(1000).optional() })).mutation(({ ctx, input }) => createWorkspace(ctx.user.id, input)),
    confirmAuthorization: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), evidenceUrl: z.string().url().optional() })).mutation(({ ctx, input }) => confirmAuthorization(ctx.user.id, input.workspaceId, input.evidenceUrl)),
    targets: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listTargets(ctx.user.id, input.workspaceId)),
    addTarget: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), value: z.string().trim().min(1).max(255), targetType: z.enum(["domain", "url", "ip", "cidr"]) })).mutation(({ ctx, input }) => addTarget(ctx.user.id, input.workspaceId, input)),
    profiles: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      await ensureDefaultProfile(input.workspaceId);
      return listProfiles(ctx.user.id, input.workspaceId);
    }),
    previewScan: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), profileId: z.number().int().positive() })).mutation(({ ctx, input }) => createPreviewJob(ctx.user.id, input.workspaceId, input.profileId)),
    jobs: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listRecentJobs(ctx.user.id, input.workspaceId)),
    findings: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive() })).query(({ ctx, input }) => listFindings(ctx.user.id, input.workspaceId)),
    report: protectedProcedure.input(z.object({ workspaceId: z.number().int().positive(), format: z.enum(["json", "html"]) })).query(({ ctx, input }) => buildReport(ctx.user.id, input.workspaceId, input.format)),
  }),
});

export type AppRouter = typeof appRouter;
