import { useEffect, useState } from "react";

export type CalendarEntry = { date: string; isFull: boolean; slots: string[] };

export function useCalendar() {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/calendar");
      const data = await response.json();
      setEntries(data?.data?.dates || []);
    };
    void load();
  }, []);

  return entries;
}
