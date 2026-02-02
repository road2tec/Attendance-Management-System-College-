"use client";

import { useEffect, useState } from "react";
import { IconArrowLeft, IconClockHour4, IconRocket } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();
  const targetDate = new Date("2025-10-20T00:00:00+05:30").getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="h-full flex items-center justify-center px-4 Orbitron">
      <div className="max-w-2xl w-full p-8 rounded-2xl shadow-xl border border-primary bg-base-300/70 backdrop-blur-lg">
        <div className="flex flex-col items-center space-y-4">
          <IconRocket className="text-success animate-bounce" size={48} />
          <h1 className="text-4xl md:text-5xl font-bold text-success">
            Coming Soon 🚀
          </h1>
          <p className="text-base-content/70">
            Something incredible is on the horizon. We’re launching soon — stay
            tuned!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max justify-center mt-8">
          <div className="flex flex-col p-4 bg-base-100 rounded-box shadow-md">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": timeLeft.days } as any}></span>
            </span>
            days
          </div>
          <div className="flex flex-col p-4 bg-base-100 rounded-box shadow-md">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": timeLeft.hours } as any}></span>
            </span>
            hrs
          </div>
          <div className="flex flex-col p-4 bg-base-100 rounded-box shadow-md">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": timeLeft.minutes } as any}></span>
            </span>
            min
          </div>
          <div className="flex flex-col p-4 bg-base-100 rounded-box shadow-md">
            <span className="countdown font-mono text-5xl">
              <span style={{ "--value": timeLeft.seconds } as any}></span>
            </span>
            sec
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <button
            className="btn btn-primary mx-auto mt-4"
            onClick={() => router.back()}
          >
            <IconArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Footer / Additional Message */}
        <div className="mt-10 text-sm text-base-content/60 flex items-center justify-center gap-2">
          <IconClockHour4 size={16} />
          <span>Launch date: 20th October 2025</span>
        </div>
      </div>
    </div>
  );
}
