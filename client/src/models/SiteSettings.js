import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Bhaskar Budha" },
    logo:     { type: String, default: "" }, // image URL shown in navbar + footer instead of the initials badge
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);
