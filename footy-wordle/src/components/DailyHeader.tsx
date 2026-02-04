"use client";
import { useEffect, useState } from "react";
import { getFormattedDate, getGameNumber } from "@/lib/gameLogic";

export default function DailyHeader() {
  const [info, setInfo] = useState({ date: "", number: 0 });

  useEffect(() => {
    setInfo({
      date: getFormattedDate(),
      number: getGameNumber(),
    });
  }, []);

  if (!info.date) return <div className="h-5"></div>; // Placeholder invisível para não pular

  return (
    <div className="w-full max-w-150 px-10 flex justify-between text-[#1D1B20] font-medium text-sm">
      <span>{info.date}</span>
      <span>No. {info.number}</span>
    </div>
  );
}
