"use client";

import type { Dispatch, SetStateAction } from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type OfferDraft = {
  id: string;
  title: string;
  description: string;
  discount: string;
  startDate: string;
  endDate: string;
};

type OffersFormProps = {
  offers: Array<any>;
  newOffer: OfferDraft;
  setNewOffer: Dispatch<SetStateAction<OfferDraft>>;
  handleCreate: (endpoint: string, payload: Record<string, unknown>) => Promise<void>;
  handleDelete: (endpoint: string, id: string) => Promise<void>;
  nextId: React.MutableRefObject<string>;
};

export default function OffersForm({
  offers,
  newOffer,
  setNewOffer,
  handleCreate,
  handleDelete,
  nextId
}: OffersFormProps) {
  return (
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
  );
}
