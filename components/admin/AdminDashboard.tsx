"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const emptyService = { id: "", title: "", description: "", image: "", price: "" };
const emptyTeam = { id: "", name: "", role: "", image: "", bio: "" };
const emptyOffer = { id: "", title: "", description: "", discount: "", startDate: "", endDate: "" };
const emptyMedia = { id: "", title: "", type: "image", url: "", tag: "" };

export default function AdminDashboard() {
  const [services, setServices] = useState<Array<any>>([]);
  const [team, setTeam] = useState<Array<any>>([]);
  const [offers, setOffers] = useState<Array<any>>([]);
  const [calendar, setCalendar] = useState<{ dates: Array<any> }>({ dates: [] });
  const [media, setMedia] = useState<Array<any>>([]);
  const [payments, setPayments] = useState<Array<any>>([]);
  const [status, setStatus] = useState<string>("");

  const [newService, setNewService] = useState(emptyService);
  const [newTeam, setNewTeam] = useState(emptyTeam);
  const [newOffer, setNewOffer] = useState(emptyOffer);
  const [newMedia, setNewMedia] = useState(emptyMedia);
  const [calendarDraft, setCalendarDraft] = useState<string>("");

  const sync = async () => {
    const [svc, tm, off, cal, med, pay] = await Promise.all([
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/team").then((r) => r.json()),
      fetch("/api/admin/offers").then((r) => r.json()),
      fetch("/api/admin/calendar").then((r) => r.json()),
      fetch("/api/admin/media").then((r) => r.json()),
      fetch("/api/admin/payments").then((r) => r.json())
    ]);
    setServices(svc.data || []);
    setTeam(tm.data || []);
    setOffers(off.data || []);
    setCalendar(cal.data || { dates: [] });
    setMedia(med.data || []);
    setPayments(pay.data || []);
    setCalendarDraft(JSON.stringify(cal.data || { dates: [] }, null, 2));
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

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Services</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Service title"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
          />
          <Input
            placeholder="Price"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
          />
          <Input
            placeholder="Image URL"
            value={newService.image}
            onChange={(e) => setNewService({ ...newService, image: e.target.value })}
          />
          <Input
            type="file"
            onChange={async (e) => {
              if (!e.target.files?.[0]) return;
              const url = await uploadFile(e.target.files[0], "services");
              setNewService({ ...newService, image: url });
            }}
          />
        </div>
        <Button
          className="mt-4"
          onClick={() =>
            handleCreate("services", { ...newService, id: newService.id || `svc-${nextId.current}` })
          }
        >
          Add Service
        </Button>
        <div className="mt-4 space-y-3">
          {services.map((svc) => (
            <div key={svc.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="font-semibold">{svc.title}</p>
                <p className="text-xs text-neutral-500">{svc.price}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete("services", svc.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

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

      <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
        <h2 className="font-serif text-2xl text-neutral-900">Weekly Offers & Discounts</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Offer title"
            value={newOffer.title}
            onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
          />
          <Input
            placeholder="Discount (e.g. 10%)"
            value={newOffer.discount}
            onChange={(e) => setNewOffer({ ...newOffer, discount: e.target.value })}
          />
          <Input
            type="date"
            value={newOffer.startDate}
            onChange={(e) => setNewOffer({ ...newOffer, startDate: e.target.value })}
          />
          <Input
            type="date"
            value={newOffer.endDate}
            onChange={(e) => setNewOffer({ ...newOffer, endDate: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={newOffer.description}
            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
          />
        </div>
        <Button
          className="mt-4"
          onClick={() => handleCreate("offers", { ...newOffer, id: newOffer.id || `offer-${nextId.current}` })}
        >
          Add Offer
        </Button>
        <div className="mt-4 space-y-3">
          {offers.map((offer) => (
            <div key={offer.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <p className="font-semibold">{offer.title}</p>
                <p className="text-xs text-neutral-500">{offer.discount}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleDelete("offers", offer.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </section>

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
