import React from 'react';

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="rounded-3xl bg-white border border-stone-200/90 p-8 space-y-4 shadow-sm">
        <div className="h-6 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-100 rounded w-1/2" />
        <div className="h-2.5 bg-stone-200/80 rounded-full w-full max-w-md mt-4" />
      </div>

      {/* 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
            <div className="h-5 bg-stone-200 rounded w-1/2" />
            <div className="space-y-3">
              <div className="h-12 bg-stone-100 rounded-xl" />
              <div className="h-12 bg-stone-100 rounded-xl" />
              <div className="h-12 bg-stone-100 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Column (Form Fields) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-10 bg-stone-100 rounded-xl" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-10 bg-stone-100 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-stone-200 rounded w-1/4" />
              <div className="h-10 bg-stone-100 rounded-xl" />
            </div>
            <div className="h-11 bg-stone-200 rounded-xl w-36 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
