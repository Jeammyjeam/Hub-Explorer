import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Heart, Bot, Database, Rocket } from "lucide-react";
import type { Model, Dataset, Space, ResourceType } from "@/types/huggingface";
import { formatDistanceToNow } from "date-fns";

type ResourceCardProps = {
  resource: Model | Dataset | Space;
  type: ResourceType;
};

function formatDownloads(downloads?: number) {
  if (downloads === undefined) return "N/A";
  if (downloads >= 1_000_000) return `${(downloads / 1_000_000).toFixed(1)}M`;
  if (downloads >= 1_000) return `${(downloads / 1_000).toFixed(0)}k`;
  return downloads.toString();
}

const typeIconMap = {
  models: <Bot className="h-4 w-4 mr-2" />,
  datasets: <Database className="h-4 w-4 mr-2" />,
  spaces: <Rocket className="h-4 w-4 mr-2" />,
};

export default function ResourceCard({ resource, type }: ResourceCardProps) {
  const { id, author, lastModified, downloads, likes, tags, pipeline_tag } = resource as Model;
  const displayTag = pipeline_tag || (tags && tags.length > 0 && !tags[0].includes(':') ? tags[0] : null);

  return (
    <Link href={`/${type}/${id}`} className="block">
      <Card className="h-full flex flex-col hover:border-primary transition-colors duration-200 group">
        <CardHeader>
          <CardDescription className="flex items-center justify-between">
            <span className="flex items-center capitalize">
              {typeIconMap[type]}
              {type.slice(0, -1)}
            </span>
            <span>by {author}</span>
          </CardDescription>
          <CardTitle className="font-headline text-lg group-hover:text-primary transition-colors">
            {id}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {displayTag && <Badge variant="secondary">{displayTag}</Badge>}
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {downloads !== undefined && (
              <span className="flex items-center">
                <Download className="h-4 w-4 mr-1" /> {formatDownloads(downloads)}
              </span>
            )}
            {likes !== undefined && (
              <span className="flex items-center">
                <Heart className="h-4 w-4 mr-1" /> {likes}
              </span>
            )}
          </div>
          <time dateTime={lastModified}>
            {formatDistanceToNow(new Date(lastModified), { addSuffix: true })}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}
