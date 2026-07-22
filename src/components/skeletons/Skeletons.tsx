export function NewsCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="skeleton aspect-[16/10] w-full rounded-lg" />
      <div className="skeleton mt-3 h-3 w-16 rounded" />
      <div className="skeleton mt-2 h-4 w-full rounded" />
      <div className="skeleton mt-1.5 h-4 w-3/4 rounded" />
    </div>
  );
}

export function NewsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SliderSkeleton() {
  return <div className="skeleton aspect-[16/9] w-full rounded-xl sm:aspect-[21/9]" />;
}

export function ArticlePageSkeleton() {
  return (
    <div className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton mt-4 h-10 w-full rounded" />
        <div className="skeleton mt-2 h-10 w-2/3 rounded" />
        <div className="skeleton mt-6 aspect-video w-full rounded-xl" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-4 w-full rounded" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
