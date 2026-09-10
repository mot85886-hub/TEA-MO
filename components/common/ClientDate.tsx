'use client';

import React, { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

interface ClientDateProps {
  date: string | number | Date;
  format?: 'datetime' | 'date' | 'time' | 'full';
  className?: string;
}

export default function ClientDate({ date, format = 'datetime', className }: ClientDateProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  let text = '';
  if (!isMounted) {
    // Deterministic SSR & initial hydration value (fixed to UTC)
    if (format === 'time') {
      text = d.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
    } else if (format === 'date') {
      text = d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
    } else if (format === 'full') {
      text = d.toLocaleString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else {
      const dateStr = d.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
      const timeStr = d.toLocaleTimeString('en-US', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
      text = `${dateStr} • ${timeStr}`;
    }
  } else {
    // Hydrated client: user's local timezone and system formatting
    if (format === 'time') {
      text = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (format === 'date') {
      text = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else if (format === 'full') {
      text = d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      text = `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  }

  return (
    <span suppressHydrationWarning className={className}>
      {text}
    </span>
  );
}
