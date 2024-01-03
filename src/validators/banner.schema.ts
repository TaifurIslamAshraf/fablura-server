import * as z from "zod";

export const createBannerSchema = z.object({
  body: z.object({
    bannerType: z.enum(["topBanner", "mainBanner", "categoryBanner"], {
      required_error: "Banner type is required",
    }),
    category: z.string().optional(),
  }),
});
