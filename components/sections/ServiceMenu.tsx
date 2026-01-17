import Image from "next/image";

import { cn } from "../../lib/utils";

type MenuItem = {
  name: string;
  price: string;
};

type MenuSection = {
  title: string;
  description: string;
  image: string;
  align?: "left" | "right";
  badge?: string;
  items: MenuItem[];
};

type ServiceMenuProps = {
  sections: MenuSection[];
  viewAllLabel: string;
  className?: string;
};

export default function ServiceMenu({ sections, viewAllLabel, className }: ServiceMenuProps) {
  return (
    <div className={cn("mt-12 space-y-12", className)}>
      {sections.map((section, index) => {
        const isRight = section.align ? section.align === "right" : index % 2 === 1;
        return (
          <div key={section.title} className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
            <div className={cn("relative mx-auto w-full max-w-sm", isRight ? "md:order-2" : "")}>
              <span className="blob -left-6 -top-8 opacity-60" />
              <span className="blob -bottom-8 right-0 opacity-40" />
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[120px] bg-white/70 shadow-card">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover object-center opacity-70"
                  sizes="(max-width: 768px) 90vw, 360px"
                />
              </div>
            </div>
            <div className={cn("card-surface p-6 md:p-8", isRight ? "md:order-1" : "")}>
              {section.badge && (
                <span className="inline-flex items-center rounded-full border border-peach-200 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-peach-600">
                  {section.badge}
                </span>
              )}
              <h3 className="mt-3 font-serif text-2xl text-neutral-900">{section.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{section.description}</p>
              <ul className="mt-5 space-y-2 text-sm text-neutral-700">
                {section.items.map((item) => (
                  <li
                    key={`${section.title}-${item.name}`}
                    className="flex items-center justify-between gap-4 border-b border-dashed border-peach-100 pb-2"
                  >
                    <span>{item.name}</span>
                    <span className="font-medium text-peach-600">{item.price}</span>
                  </li>
                ))}
              </ul>
              <a className="mt-4 inline-flex text-sm font-semibold text-peach-600" href="/book">
                {viewAllLabel}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
