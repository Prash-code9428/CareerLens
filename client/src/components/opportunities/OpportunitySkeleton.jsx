import React from 'react';

export default function OpportunitySkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 animate-pulse shadow-sm"
        >
          {/* Top header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-stone-200 rounded-md w-3/4" />
              <div className="flex items-center gap-3">
                <div className="h-3.5 bg-stone-200/80 rounded w-1/4" />
                <div className="h-3.5 bg-stone-200/80 rounded w-1/4" />
              </div>
            </div>
            <div className="h-7 w-24 bg-stone-200 rounded-lg shrink-0" />
          </div>

          {/* Metadata pill skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 bg-stone-100 rounded" />
            <div className="h-5 w-20 bg-stone-100 rounded" />
          </div>

          {/* AI Match Box Skeleton */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="h-3.5 bg-stone-200/70 rounded w-full" />
            <div className="h-3.5 bg-stone-200/70 rounded w-4/5" />
            <div className="flex items-center gap-2 pt-1">
              <div className="h-5 w-14 bg-stone-200 rounded" />
              <div className="h-5 w-16 bg-stone-200 rounded" />
              <div className="h-5 w-16 bg-stone-200 rounded" />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
            <div className="h-3 bg-stone-200/80 rounded w-20" />
            <div className="h-7 w-28 bg-stone-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
