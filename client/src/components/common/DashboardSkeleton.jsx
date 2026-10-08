import React from 'react';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-4">
        <div className="h-4 bg-slate-800 rounded-full w-32" />
        <div className="h-8 bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-800/60 rounded w-1/2" />
      </div>

      {/* 4 Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-3">
            <div className="h-4 bg-slate-800/80 rounded w-1/2" />
            <div className="h-7 bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-800/50 rounded w-2/3" />
          </div>
        ))}
      </div>

      {/* 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="h-5 bg-slate-800 rounded w-1/2" />
            <div className="h-28 bg-slate-950 rounded-xl" />
          </div>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="h-5 bg-slate-800 rounded w-1/2" />
            <div className="h-24 bg-slate-950 rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
            <div className="h-6 bg-slate-800 rounded w-1/3" />
            <div className="h-36 bg-slate-950 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
