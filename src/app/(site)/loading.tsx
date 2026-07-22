import { SliderSkeleton, NewsGridSkeleton } from "@/components/skeletons/Skeletons";

export default function Loading() {
  return (
    <div className="container-page py-6">
      <div className="mb-8">
        <SliderSkeleton />
      </div>
      <NewsGridSkeleton count={9} />
    </div>
  );
}
