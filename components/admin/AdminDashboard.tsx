"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import ServicesForm from "./ServicesForm";
import OffersForm from "./OffersForm";
import SiteSettingsForm from "./SiteSettingsForm";
import MenuForm from "./MenuForm";

const emptyService = { id: "", title: "", description: "", image: "", price: "" };
const emptyTeam = { id: "", name: "", role: "", image: "", bio: "" };
const emptyOffer = { id: "", title: "", description: "", discount: "", startDate: "", endDate: "" };
const emptyMedia = { id: "", title: "", type: "image", url: "", tag: "" };
const emptyMenuItem = { name: "", price: "" };
const emptyMenuSection = {
  title: "",
  description: "",
  image: "",
  align: "left",
  badge: "",
  items: [emptyMenuItem]
};

export default function AdminDashboard() {
  const [services, setServices] = useState<Array<any>>([]);
  const [team, setTeam] = useState<Array<any>>([]);
  const [offers, setOffers] = useState<Array<any>>([]);
  const [calendar, setCalendar] = useState<{ dates: Array<any> }>({ dates: [] });
  const [media, setMedia] = useState<Array<any>>([]);
  const [payments, setPayments] = useState<Array<any>>([]);
  const [status, setStatus] = useState<string>("");
  const [siteSettings, setSiteSettings] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    pixelId: "",
    socials: {
      facebook: "",
      instagram: "",
      youtube: "",
      tiktok: "",
      whatsapp: ""
    }
  });
  const [menuData, setMenuData] = useState<{ en: Array<any>; bn: Array<any> }>({ en: [], bn: [] });

  const [newService, setNewService] = useState(emptyService);
  const [newTeam, setNewTeam] = useState(emptyTeam);
  const [newOffer, setNewOffer] = useState(emptyOffer);
  const [newMedia, setNewMedia] = useState(emptyMedia);
  const [calendarDraft, setCalendarDraft] = useState<string>("");

  const sync = async () => {
    const [svc, tm, off, cal, med, pay, site, menu] = await Promise.all([
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/team").then((r) => r.json()),
      fetch("/api/admin/offers").then((r) => r.json()),
      fetch("/api/admin/calendar").then((r) => r.json()),
      fetch("/api/admin/media").then((r) => r.json()),
      fetch("/api/admin/payments").then((r) => r.json()),
      fetch("/api/admin/site").then((r) => r.json()),
      fetch("/api/admin/menu").then((r) => r.json())
    ]);
    setServices(svc.data || []);
    setTeam(tm.data || []);
    setOffers(off.data || []);
    setCalendar(cal.data || { dates: [] });
    setMedia(med.data || []);
    setPayments(pay.data || []);
    setCalendarDraft(JSON.stringify(cal.data || { dates: [] }, null, 2));
    if (site?.data) {
      setSiteSettings({
        name: site.data.name || "",
        description: site.data.description || "",
        phone: site.data.phone || "",
        address: site.data.address || "",
        pixelId: site.data.pixelId || "",
        socials: {
          facebook: site.data.socials?.facebook || "",
          instagram: site.data.socials?.instagram || "",
          youtube: site.data.socials?.youtube || "",
          tiktok: site.data.socials?.tiktok || "",
          whatsapp: site.data.socials?.whatsapp || ""
        }
      });
    }
    if (menu?.data) {
      setMenuData({
        en: Array.isArray(menu.data.en) ? menu.data.en : [],
        bn: Array.isArray(menu.data.bn) ? menu.data.bn : []
      });
    }
  };

  useEffect(() => {
    void sync();
  }, []);

  const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const json = await response.json();
    return json?.data?.url as string;
  };

  const handleCreate = async (endpoint: string, payload: Record<string, unknown>) => {
    const response = await fetch(`/api/admin/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      setStatus("Save failed. Check admin password.");
      return;
    }
    setStatus("Saved.");
    await sync();
  };

  const handleDelete = async (endpoint: string, id: string) => {
    await fetch(`/api/admin/${endpoint}?id=${id}`, { method: "DELETE" });
    await sync();
  };

  const saveCalendar = async () => {
    try {
      const parsed = JSON.parse(calendarDraft);
      await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });
      setStatus("Calendar saved.");
      await sync();
    } catch {
      setStatus("Calendar JSON invalid.");
    }
  };

  const saveSiteSettings = async () => {
    const response = await fetch("/api/admin/site", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteSettings)
    });
    if (!response.ok) {
      setStatus("Site settings save failed.");
      return;
    }
    setStatus("Site settings saved.");
    await sync();
  };

  const saveMenu = async () => {
    const response = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuData)
    });
    if (!response.ok) {
      setStatus("Menu save failed.");
      return;
    }
    setStatus("Service menu saved.");
    await sync();
  };

  const updateSection = (lang: "en" | "bn", index: number, patch: Record<string, unknown>) => {
    setMenuData((prev) => {
      const updated = [...prev[lang]];
      updated[index] = { ...updated[index], ...patch };
      return { ...prev, [lang]: updated };
    });
  };

  const addSection = (lang: "en" | "bn") => {
    setMenuData((prev) => ({ ...prev, [lang]: [...prev[lang], { ...emptyMenuSection }] }));
  };

  const removeSection = (lang: "en" | "bn", index: number) => {
    setMenuData((prev) => ({ ...prev, [lang]: prev[lang].filter((_, i) => i !== index) }));
  };

  const updateItem = (lang: "en" | "bn", sectionIndex: number, itemIndex: number, patch: Record<string, unknown>) => {
    setMenuData((prev) => {
      const updatedSections = [...prev[lang]];
      const section = { ...updatedSections[sectionIndex] };
      const items = Array.isArray(section.items) ? [...section.items] : [];
      items[itemIndex] = { ...items[itemIndex], ...patch };
      section.items = items;
      updatedSections[sectionIndex] = section;
      return { ...prev, [lang]: updatedSections };
    });
  };

  const addItem = (lang: "en" | "bn", sectionIndex: number) => {
    setMenuData((prev) => {
      const updatedSections = [...prev[lang]];
      const section = { ...updatedSections[sectionIndex] };
      const items = Array.isArray(section.items) ? [...section.items, { ...emptyMenuItem }] : [{ ...emptyMenuItem }];
      section.items = items;
      updatedSections[sectionIndex] = section;
      return { ...prev, [lang]: updatedSections };
    });
  };

  const removeItem = (lang: "en" | "bn", sectionIndex: number, itemIndex: number) => {
    setMenuData((prev) => {
      const updatedSections = [...prev[lang]];
      const section = { ...updatedSections[sectionIndex] };
      const items = Array.isArray(section.items) ? section.items.filter((_: any, i: number) => i !== itemIndex) : [];
      section.items = items;
      updatedSections[sectionIndex] = section;
      return { ...prev, [lang]: updatedSections };
    });
  };

  const nextId = useRef(Date.now().toString());

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-neutral-900">Admin Panel</h1>
          <p className="text-sm text-neutral-600">Manage services, team, offers, calendar, media, and uploads.</p>
        </div>
        <Button
          variant="outline"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
        >
          Logout
        </Button>
      </div>
      {status && <p className="mt-3 text-sm text-peach-600">{status}</p>}
      <ServicesForm
        services={services}
        newService={newService}
        setNewService={setNewService}
        uploadFile={uploadFile}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        nextId={nextId}
      />

      <SiteSettingsForm
        siteSettings={siteSettings}
        setSiteSettings={setSiteSettings}
        saveSiteSettings={saveSiteSettings}
      />

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Team Members</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Name"
            value={newTeam.name}
            onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          />
          <Input
            placeholder="Role"
            value={newTeam.role}
            onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })}
          />
          <Textarea
            placeholder="Bio"
            value={newTeam.bio}
            onChange={(e) => setNewTeam({ ...newTeam, bio: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newTeam.image}
            onChange={(e) => setNewTeam({ ...newTeam, image: e.target.value })}
          />
          <Input
            type="file"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const url = await uploadFile(e.target.files[0], "team");
              setNewTeam({ ...newTeam, image: url });
            }}
          />
        </div>
        <Button
          className="mt-4"
          onClick={() => handleCreate("team", { ...newTeam, id: newTeam.id || `team-${nextId.current}` })}
        >
          Add Team Member
        </Button>
        <div className="mt-4 space-y-3">
          {team.map((member) => (
            <div key={member.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="font-semibold">{member.name}</p>
                <p className="text-xs text-neutral-500">{member.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete("team", member.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

      <OffersForm
        offers={offers}
        newOffer={newOffer}
        setNewOffer={setNewOffer}
        handleCreate={handleCreate}
        handleDelete={handleDelete}
        nextId={nextId}
      />

      <MenuForm
        menuData={menuData}
        addSection={addSection}
        removeSection={removeSection}
        updateSection={updateSection}
        addItem={addItem}
        removeItem={removeItem}
        updateItem={updateItem}
        uploadFile={uploadFile}
        saveMenu={saveMenu}
      />

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Calendar & Slot Setup</h2>
        <p className="text-sm text-neutral-600">Edit JSON to mark full days and slots.</p>
        <Textarea
          className="mt-4 min-h-[220px] font-mono text-xs"
          value={calendarDraft}
          onChange={(e) => setCalendarDraft(e.target.value)}
        />
        <Button className="mt-4" onClick={saveCalendar}>
          Save Calendar
        </Button>
      </section>

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Media (Before/After, Videos)</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Title"
            value={newMedia.title}
            onChange={(e) => setNewMedia({ ...newMedia, title: e.target.value })}
          />
          <Input
            placeholder="Tag (before-after, influencer, live)"
            value={newMedia.tag}
            onChange={(e) => setNewMedia({ ...newMedia, tag: e.target.value })}
          />
          <Input
            placeholder="Type (image/video)"
            value={newMedia.type}
            onChange={(e) => setNewMedia({ ...newMedia, type: e.target.value })}
          />
          <Input
            placeholder="Media URL"
            value={newMedia.url}
            onChange={(e) => setNewMedia({ ...newMedia, url: e.target.value })}
          />
          <Input
            type="file"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const url = await uploadFile(e.target.files[0], "media");
              setNewMedia({ ...newMedia, url });
            }}
          />
        </div>
        <Button
          className="mt-4"
          onClick={() => handleCreate("media", { ...newMedia, id: newMedia.id || `media-${nextId.current}` })}
        >
          Add Media
        </Button>
        <div className="mt-4 space-y-3">
          {media.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.type}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete("media", item.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Payment Proofs</h2>
        <div className="mt-4 space-y-3">
          {payments.length === 0 && <p className="text-sm text-neutral-500">No payments yet.</p>}
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-xl border p-3 text-sm">
              <p className="font-semibold">{payment.method}</p>
              <p className="text-neutral-500">Phone: {payment.phone}</p>
              <p className="text-neutral-500">Amount: {payment.amount}</p>
              <p className="text-neutral-500">Txn: {payment.transactionId}</p>
              {payment.slipUrl && (
                <a className="text-peach-600" href={payment.slipUrl} target="_blank" rel="noreferrer">
                  View slip
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Calendar Overview</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {calendar.dates.map((entry) => (
            <div key={entry.date} className="rounded-xl border p-3 text-sm">
              <p className="font-semibold">{entry.date}</p>
              <p className="text-neutral-500">{entry.isFull ? "Full booked" : "Open"}</p>
              <p className="text-neutral-500">Slots: {entry.slots?.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
