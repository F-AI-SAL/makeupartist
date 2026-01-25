"use client";

import type { Dispatch, SetStateAction } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type ServiceDraft = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
};

type ServicesFormProps = {
  services: Array<any>;
  newService: ServiceDraft;
  setNewService: Dispatch<SetStateAction<ServiceDraft>>;
  uploadFile: (file: File, folder: string) => Promise<string>;
  handleCreate: (endpoint: string, payload: Record<string, unknown>) => Promise<void>;
  handleDelete: (endpoint: string, id: string) => Promise<void>;
  nextId: React.MutableRefObject<string>;
};

export default function ServicesForm({
  services,
  newService,
  setNewService,
  uploadFile,
  handleCreate,
  handleDelete,
  nextId
}: ServicesFormProps) {
  return (
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
  );
}
