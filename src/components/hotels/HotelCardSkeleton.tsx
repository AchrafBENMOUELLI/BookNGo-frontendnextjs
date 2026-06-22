import { Skeleton } from "@/components/ui/skeleton";

export function HotelCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    </div>
  );
}
