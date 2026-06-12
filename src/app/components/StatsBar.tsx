"use client";

import { motion } from "framer-motion";
import { memo, useEffect, useState } from "react";
import { strategyApi } from "@/lib/api/strategyApi";

type Stat = {
  label: string;
  value: string;
  accent?: boolean;
  loading?: boolean;
};

const baseStats: Stat[] = [
  { label: "Weekly Growth", value: "+2.4%", accent: true },
  { label: "Active Strategies", value: "—", loading: true },
  { label: "Invite Only Access", value: "By Invitation" },
];

export const StatsBar = memo(function StatsBar() {
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [loadingActive, setLoadingActive] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const strategies = await strategyApi.getAllStrategies();
        if (cancelled) return;
        const count = strategies.length;
        setActiveCount(count);
      } catch (err) {
        console.error("Failed to load active strategies count:", err);
        if (!cancelled) setActiveCount(null);
      } finally {
        if (!cancelled) setLoadingActive(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats: Stat[] = baseStats.map((stat) => {
    if (stat.label !== "Active Strategies") return stat;
    if (loadingActive) return { ...stat, value: "…", loading: true };
    if (activeCount === null) return { ...stat, value: "—", loading: false };
    return { ...stat, value: String(activeCount), loading: false };
  });

  return (
    <section className="px-6 pb-24 md:px-12 lg:px-16">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card px-5 py-5"
          >
            <p className="mb-2 text-[15px] font-semibold uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p
              className={`text-2xl font-bold md:text-[36px] ${
                stat.accent ? "text-primary" : "text-foreground"
              } ${stat.loading ? "animate-pulse text-muted-foreground" : ""}`}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
