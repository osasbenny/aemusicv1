import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";
import { sendArtistConfirmation } from "./email";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { createBeatProduct } from "./products";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

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

  beats: router({
    list: publicProcedure.query(async () => {
      return db.getAllBeats();
    }),
    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return db.getBeatById(input.id);
    }),
    filter: publicProcedure
      .input(
        z.object({
          genre: z.string().optional(),
          mood: z.string().optional(),
          minBpm: z.number().optional(),
          maxBpm: z.number().optional(),
        })
      )
      .query(async ({ input }) => {
        return db.filterBeats(input);
      }),
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          genre: z.string(),
          mood: z.string(),
          bpm: z.number(),
          price: z.number(),
          description: z.string().optional(),
          audioFile: z.string(), // base64 encoded audio file
          audioFileName: z.string(),
          coverImage: z.string().optional(), // base64 encoded image
          coverImageName: z.string().optional(),
          licenseType: z.string().default("Basic"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        // Upload audio file to S3
        const audioBuffer = Buffer.from(input.audioFile, "base64");
        const audioKey = `beats/audio/${nanoid()}-${input.audioFileName}`;
        const { url: audioUrl } = await storagePut(audioKey, audioBuffer, "audio/mpeg");

        // Upload cover image if provided
        let coverImageKey: string | undefined;
        let coverImageUrl: string | undefined;
        if (input.coverImage && input.coverImageName) {
          const imageBuffer = Buffer.from(input.coverImage, "base64");
          coverImageKey = `beats/covers/${nanoid()}-${input.coverImageName}`;
          const result = await storagePut(coverImageKey, imageBuffer, "image/jpeg");
          coverImageUrl = result.url;
        }

        return db.createBeat({
          title: input.title,
          genre: input.genre,
          mood: input.mood,
          bpm: input.bpm,
          price: input.price,
          description: input.description,
          audioFileKey: audioKey,
          audioUrl,
          coverImageKey,
          coverImageUrl,
          licenseType: input.licenseType,
        });
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          genre: z.string().optional(),
          mood: z.string().optional(),
          bpm: z.number().optional(),
          price: z.number().optional(),
          description: z.string().optional(),
          licenseType: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        const { id, ...updateData } = input;
        await db.updateBeat(id, updateData);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      await db.deleteBeat(input.id);
      return { success: true };
    }),
    createCheckout: publicProcedure
      .input(z.object({ beatId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const beat = await db.getBeatById(input.beatId);
        if (!beat) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Beat not found" });
        }

        const product = createBeatProduct(beat);
        const origin = ctx.req.headers.origin || "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: product.name,
                  description: product.description,
                },
                unit_amount: product.priceInCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/beats`,
          customer_email: ctx.user?.email || undefined,
          client_reference_id: ctx.user?.id.toString() || undefined,
          metadata: {
            beat_id: beat.id.toString(),
            user_id: ctx.user?.id.toString() || "guest",
            customer_email: ctx.user?.email || "",
            customer_name: ctx.user?.name || "",
          },
          allow_promotion_codes: true,
        });

        return { checkoutUrl: session.url };
      }),
  }),

  submissions: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      return db.getAllSubmissions();
    }),
    create: publicProcedure
      .input(
        z.object({
          artistName: z.string(),
          email: z.string().email(),
          songTitle: z.string(),
          message: z.string().optional(),
          file: z.string(), // base64 encoded file
          fileName: z.string(),
          fileType: z.enum(["audio", "video"]),
        })
      )
      .mutation(async ({ input }) => {
        // Upload file to S3
        const fileBuffer = Buffer.from(input.file, "base64");
        const fileKey = `submissions/${input.fileType}/${nanoid()}-${input.fileName}`;
        const mimeType = input.fileType === "audio" ? "audio/mpeg" : "video/mp4";
        const { url: fileUrl } = await storagePut(fileKey, fileBuffer, mimeType);

        const submission = await db.createSubmission({
          artistName: input.artistName,
          email: input.email,
          songTitle: input.songTitle,
          message: input.message,
          fileType: input.fileType,
          fileKey,
          fileUrl,
          fileName: input.fileName,
        });

        // Send detailed email notification to admin
        await notifyOwner({
          title: "🎵 New Music Submission - AE Music Lab",
          content: `
**New Artist Submission Received**

**Artist Details:**
- Name: ${input.artistName}
- Email: ${input.email}

**Song Information:**
- Title: ${input.songTitle}
- File Type: ${input.fileType.toUpperCase()}
- File Name: ${input.fileName}

**Message from Artist:**
${input.message || 'No message provided'}

**File Access:**
Download Link: ${fileUrl}

**Action Required:**
Please review this submission and respond to the artist at ${input.email}

---
This notification was sent to: cactusdigitalmedialtd@gmail.com
From: AE Music Lab Submission System
          `.trim(),
        });

        // Send confirmation email to artist
        await sendArtistConfirmation(input.artistName, input.email, input.songTitle);

        return submission;
      }),
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }

        await db.updateSubmissionStatus(input.id, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
