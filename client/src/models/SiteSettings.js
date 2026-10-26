import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Bhaskar Budha" },
    logo:     { type: String, default: "" }, // image URL shown in navbar + footer
    favicon:  { type: String, default: "" }, // dynamic browser tab favicon (.ico, .png, .svg, .webp)
  },
  { timestamps: true }
);

if (mongoose.models.SiteSettings) {
  delete mongoose.models.SiteSettings;
}

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);

