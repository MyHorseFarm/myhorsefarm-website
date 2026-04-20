"use client";

import { useState, useEffect, useCallback } from "react";
import type { AvailabilityDay } from "@/lib/types";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface DateTimePickerProps {
  selectedDate: string | null;
  selectedSlot: "morning" | "afternoon";
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: "morning" | "afternoon") => void;
  compact?: boolean;
}

export default function DateTimePicker({
  selectedDate,
  selectedSlot,
  onDateSelect,
  onSlotSelect,
  compact = false,
}: DateTimePickerProps) {
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/availability?days=60");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAvailability(data.dates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load availability");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const availByDate = new Map<string, AvailabilityDay>();
  for (const d of availability) {
    availByDate.set(d.date, d);
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function getDateStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  if (loading) {
    return <p className="text-gray-500 py-10 text-center">Loading availability...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className={compact ? "" : "max-w-md mx-auto"}>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
          aria-label="Previous month"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <i className="fas fa-chevron-left text-gray-600" aria-hidden="true" />
        </button>
        <h3 className="font-bold text-lg">{monthLabel}</h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
          aria-label="Next month"
          className="p-2 hover:bg-gray-100 rounded"
        >
          <i className="fas fa-chevron-right text-gray-600" aria-hidden="true" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-500 py-2">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const dateStr = getDateStr(day);
          const avail = availByDate.get(dateStr);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = new Date(dateStr + "T12:00:00") <= today;

          let bgClass = "bg-gray-50 text-gray-300 cursor-default";
          if (!isPast && avail) {
            if (avail.status === "available") bgClass = "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer";
            else if (avail.status === "limited") bgClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer";
            else bgClass = "bg-gray-200 text-gray-400 cursor-default";
          }

          const isSelected = selectedDate === dateStr;
          if (isSelected) bgClass = "bg-primary text-white";

          return (
            <button
              key={dateStr}
              disabled={isPast || !avail || avail.status === "full"}
              onClick={() => onDateSelect(dateStr)}
              className={`p-2 rounded text-sm font-medium transition-colors ${bgClass}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-gray-500 mb-6">
        <span><span className="inline-block w-3 h-3 bg-green-100 rounded mr-1" /> Available</span>
        <span><span className="inline-block w-3 h-3 bg-yellow-100 rounded mr-1" /> Limited</span>
        <span><span className="inline-block w-3 h-3 bg-gray-200 rounded mr-1" /> Full</span>
      </div>

      {/* Time slot selection */}
      {selectedDate && (
        <div className={compact ? "" : "text-left"}>
          <h4 className="font-semibold mb-2">Select a time</h4>
          <div className="flex gap-3 mb-4">
            {(["morning", "afternoon"] as const).map((slot) => (
              <button
                key={slot}
                onClick={() => onSlotSelect(slot)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  selectedSlot === slot
                    ? "border-primary bg-green-50"
                    : "border-gray-200 hover:border-primary"
                }`}
              >
                <div className="font-semibold capitalize">{slot}</div>
                <div className="text-xs text-gray-500">
                  {slot === "morning" ? "8 AM \u2013 12 PM" : "12 PM \u2013 5 PM"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
