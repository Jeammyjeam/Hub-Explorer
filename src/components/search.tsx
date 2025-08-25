"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon } from "lucide-react";

type SearchProps = {
  initialQuery?: string;
  initialType?: "models" | "datasets" | "spaces";
};

export default function Search({
  initialQuery = "",
  initialType = "models",
}: SearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.set("type", type);
    router.push(`/?${params.toString()}`);
  };

  const onTabChange = (value: string) => {
    const newType = value as "models" | "datasets" | "spaces";
    setType(newType);
    const params = new URLSearchParams(searchParams);
    params.set("type", newType);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex w-full items-center space-x-2 mb-4">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search models, datasets, and spaces..."
            className="pl-10 h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" size="lg" className="h-12">Search</Button>
      </form>
      <Tabs defaultValue={initialType} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
