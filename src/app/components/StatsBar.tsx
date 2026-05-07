"use client";

import { motion } from "framer-motion";
import { memo } from "react";

const stats = [
  { label: "Total Capital", value: "$18,420,000" },
  { label: "Weekly Growth", value: "+2.4%", accent: true },
  { label: "Active Strategies", value: "12" },
  { label: "Clients Onboard", value: "847" },
];

export const StatsBar = memo(function StatsBar() {
  return (
    <section className="px-6 pb-24 md:px-12 lg:px-16">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
              className={`text-2xl font-bold md:text-[36px] ${stat.accent ? "text-primary" : "text-foreground"}`}
            >
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
