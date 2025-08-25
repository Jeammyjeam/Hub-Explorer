import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full max-w-lg mb-2" />
            <Skeleton className="h-6 w-48" />
          </div>

          {/* Code Snippets Skeleton */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
             </div>
             <Skeleton className="h-8 w-40" />
             <Skeleton className="h-40 w-full" />
          </div>

          {/* README Skeleton */}
          <div className="mt-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Actions Skeleton */}
          <div className="space-y-4">
             <Skeleton className="h-8 w-24 mb-4" />
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>

          {/* Info Skeleton */}
          <div className="space-y-4">
             <Skeleton className="h-8 w-32 mb-4" />
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-full" />
             <Skeleton className="h-6 w-3/4" />
             <Skeleton className="h-6 w-1/2" />
          </div>

          {/* Tags Skeleton */}
          <div className="space-y-4">
             <Skeleton className="h-8 w-20 mb-4" />
             <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-28" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
