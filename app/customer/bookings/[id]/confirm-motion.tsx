"use client";

import { motion, useReducedMotion } from "motion/react";

export function BookingConfirmMotion({
  celebrate,
  children,
}: {
  celebrate: boolean;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce || !celebrate) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
