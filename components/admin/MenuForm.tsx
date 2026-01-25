"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type MenuFormProps = {
  menuData: { en: Array<any>; bn: Array<any> };
  addSection: (lang: "en" | "bn") => void;
  removeSection: (lang: "en" | "bn", index: number) => void;
  updateSection: (lang: "en" | "bn", index: number, patch: Record<string, unknown>) => void;
  addItem: (lang: "en" | "bn", sectionIndex: number) => void;
  removeItem: (lang: "en" | "bn", sectionIndex: number, itemIndex: number) => void;
  updateItem: (
    lang: "en" | "bn",
    sectionIndex: number,
    itemIndex: number,
    patch: Record<string, unknown>
  ) => void;
  uploadFile: (file: File, folder: string) => Promise<string>;
  saveMenu: () => Promise<void>;
};

export default function MenuForm({
  menuData,
  addSection,
  removeSection,
  updateSection,
  addItem,
  removeItem,
  updateItem,
  uploadFile,
  saveMenu
}: MenuFormProps) {
  return (
    <section className="mt-10 rounded-2xl bg-white/80 p-6 shadow-card">
      <h2 className="font-serif text-2xl text-neutral-900">Service Menu (BN + EN)</h2>
      <p className="text-sm text-neutral-600">
        Add sections and items in Bangla and English. Images can be uploaded or pasted as URLs.
      </p>
      {(["bn", "en"] as Array<"bn" | "en">).map((lang) => (
        <div key={lang} className="mt-6 rounded-2xl border border-peach-100 bg-white/60 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-700">{lang === "bn" ? "বাংলা মেনু" : "English menu"}</p>
            <Button variant="outline" size="sm" onClick={() => addSection(lang)}>
              Add section
            </Button>
          </div>
          <div className="mt-4 space-y-5">
            {menuData[lang].map((section, sectionIndex) => (
              <div key={`${lang}-${sectionIndex}`} className="rounded-xl border border-peach-100 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Section {sectionIndex + 1}</p>
                  <Button variant="outline" size="sm" onClick={() => removeSection(lang, sectionIndex)}>
                    Remove
                  </Button>
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Title"
                    value={section.title}
                    onChange={(e) => updateSection(lang, sectionIndex, { title: e.target.value })}
                  />
                  <Input
                    placeholder="Badge (optional)"
                    value={section.badge || ""}
                    onChange={(e) => updateSection(lang, sectionIndex, { badge: e.target.value })}
                  />
                  <Textarea
                    placeholder="Short description"
                    value={section.description}
                    onChange={(e) => updateSection(lang, sectionIndex, { description: e.target.value })}
                  />
                  <div className="space-y-2">
                    <Input
                      placeholder="Image URL"
                      value={section.image}
                      onChange={(e) => updateSection(lang, sectionIndex, { image: e.target.value })}
                    />
                    <Input
                      type="file"
                      onChange={async (e) => {
                        if (!e.target.files?.[0]) return;
                        const url = await uploadFile(e.target.files[0], "services");
                        updateSection(lang, sectionIndex, { image: url });
                      }}
                    />
                  </div>
                  <select
                    className="h-11 w-full rounded-xl border border-peach-100 bg-white/80 px-4 text-sm"
                    value={section.align || "left"}
                    onChange={(e) => updateSection(lang, sectionIndex, { align: e.target.value })}
                  >
                    <option value="left">Image left</option>
                    <option value="right">Image right</option>
                  </select>
                </div>
                <div className="mt-4 space-y-3">
                  {section.items?.map((item: any, itemIndex: number) => (
                    <div key={`${lang}-${sectionIndex}-${itemIndex}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <Input
                        placeholder="Item name"
                        value={item.name}
                        onChange={(e) => updateItem(lang, sectionIndex, itemIndex, { name: e.target.value })}
                      />
                      <Input
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateItem(lang, sectionIndex, itemIndex, { price: e.target.value })}
                      />
                      <Button variant="outline" size="sm" onClick={() => removeItem(lang, sectionIndex, itemIndex)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addItem(lang, sectionIndex)}>
                    Add item
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button className="mt-4" onClick={saveMenu}>
        Save Service Menu
      </Button>
    </section>
  );
}
