import React, { Suspense } from "react";
import Search from "@/components/search";
import { getModels, getDatasets, getSpaces } from "@/lib/huggingface";
import ResourceCard from "@/components/resource-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Model, Dataset, Space } from "@/types/huggingface";

type SearchParams = {
  q?: string;
  type?: "models" | "datasets" | "spaces";
};

async function ResourceList({ q, type }: SearchParams) {
  let resources: (Model | Dataset | Space)[] = [];
  const searchType = type || "models";
  const sort = q ? "likes" : "downloads";

  try {
    if (searchType === "models") {
      resources = await getModels({ search: q, sort });
    } else if (searchType === "datasets") {
      resources = await getDatasets({ search: q, sort });
    } else if (searchType === "spaces") {
      resources = await getSpaces({ search: q, sort });
    }
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return <p className="text-center text-destructive">Failed to load resources. Please try again later.</p>;
  }

  if (resources.length === 0) {
    return <p className="text-center text-muted-foreground mt-8">No results found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {resources.slice(0, 24).map((resource) => (
        <ResourceCard key={resource.id} resource={resource} type={searchType} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, type = "models" } = searchParams;
  const title = q ? `Search results for "${q}"` : `Trending ${type}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Explore the ML Universe
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover models, datasets, and spaces on Hugging Face.
        </p>
      </section>

      <Search initialQuery={q} initialType={type} />
      
      <h2 className="text-2xl font-headline font-semibold my-8 capitalize">{title}</h2>

      <Suspense fallback={<LoadingSkeleton />}>
        <ResourceList q={q} type={type} />
      </Suspense>
    </div>
  );
}
