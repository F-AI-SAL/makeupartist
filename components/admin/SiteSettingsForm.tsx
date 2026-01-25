"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type SiteSettingsFormProps = {
  siteSettings: Record<string, any>;
  setSiteSettings: (value: Record<string, any>) => void;
  saveSiteSettings: () => Promise<void>;
};

export default function SiteSettingsForm({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}: SiteSettingsFormProps) {
  return (
    <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
      <h2 className="font-serif text-2xl text-neutral-900">Site Settings</h2>
      <p className="mt-1 text-sm text-neutral-600">Update phone, address, and social links.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Input
          placeholder="Brand name"
          value={siteSettings.name}
          onChange={(e) => setSiteSettings({ ...siteSettings, name: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={siteSettings.phone}
          onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
        />
        <Input
          placeholder="Address"
          value={siteSettings.address}
          onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
        />
        <Input
          placeholder="Meta Pixel ID (optional)"
          value={siteSettings.pixelId}
          onChange={(e) => setSiteSettings({ ...siteSettings, pixelId: e.target.value })}
        />
        <Textarea
          placeholder="Short description"
          value={siteSettings.description}
          onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
        />
        <div className="grid gap-2">
          <Input
            placeholder="Facebook URL"
            value={siteSettings.socials.facebook}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                socials: { ...siteSettings.socials, facebook: e.target.value }
              })
            }
          />
          <Input
            placeholder="Instagram URL"
            value={siteSettings.socials.instagram}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                socials: { ...siteSettings.socials, instagram: e.target.value }
              })
            }
          />
          <Input
            placeholder="YouTube URL"
            value={siteSettings.socials.youtube}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                socials: { ...siteSettings.socials, youtube: e.target.value }
              })
            }
          />
          <Input
            placeholder="TikTok URL"
            value={siteSettings.socials.tiktok}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                socials: { ...siteSettings.socials, tiktok: e.target.value }
              })
            }
          />
          <Input
            placeholder="WhatsApp URL"
            value={siteSettings.socials.whatsapp}
            onChange={(e) =>
              setSiteSettings({
                ...siteSettings,
                socials: { ...siteSettings.socials, whatsapp: e.target.value }
              })
            }
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-neutral-500">Tip: PIXEL_ID env var overrides this pixel field on production.</p>
      <Button className="mt-4" onClick={saveSiteSettings}>
        Save Site Settings
      </Button>
    </section>
  );
}
