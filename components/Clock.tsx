"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Vancouver", hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short",
});

export default function Clock() {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return <b suppressHydrationWarning>{now}</b>;
}
