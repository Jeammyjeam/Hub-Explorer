import Link from "next/link";
import { getResourceDetails } from "@/lib/huggingface";
import type { ResourceType } from "@/types/huggingface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CodeSnippetGenerator from "@/components/code-snippet-generator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, GitClone, Heart, Calendar, FileText, Tag, User, Scale } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type PageProps = {
  params: {
    type: ResourceType;
    id: string[];
  };
};

function formatStat(num?: number) {
  return num?.toLocaleString() ?? 'N/A';
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { type, id: idParts } = params;
  const id = idParts.join("/");
  const resource = await getResourceDetails(type, id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/?type=${type}`} className="text-sm text-primary hover:underline mb-2 block capitalize">
              &larr; Back to {type}
            </Link>
            <h1 className="text-4xl font-headline font-bold break-words">{resource.id}</h1>
            <p className="text-lg text-muted-foreground mt-1">
              by <Link href={`https://huggingface.co/${resource.author}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{resource.author}</Link>
            </p>
          </div>

          {/* Code Snippets */}
          <CodeSnippetGenerator resourceId={id} resourceType={type} />
          
          {/* README */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center"><FileText className="mr-2"/> README.md</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full rounded-md border p-4 bg-muted/20">
                <pre className="text-sm whitespace-pre-wrap font-body">{resource.readme}</pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader><CardTitle>Actions</CardTitle></CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button asChild>
                <a href={`https://huggingface.co/${id}/resolve/main`}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </a>
              </Button>
               <div className="relative">
                <Input readOnly value={`git clone https://huggingface.co/${id}`} className="pr-10" />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={() => navigator.clipboard.writeText(`git clone https://huggingface.co/${id}`)}>
                  <GitClone className="h-4 w-4"/>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Info Card */}
          <Card>
            <CardHeader><CardTitle>Information</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center"><Heart className="w-4 h-4 mr-3 text-primary" /> {formatStat(resource.likes)} likes</div>
              <div className="flex items-center"><Download className="w-4 h-4 mr-3 text-primary" /> {formatStat(resource.downloads)} downloads</div>
              <div className="flex items-center"><Calendar className="w-4 h-4 mr-3 text-primary" />Updated {formatDistanceToNow(new Date(resource.lastModified), { addSuffix: true })}</div>
              {resource.license && <div className="flex items-center"><Scale className="w-4 h-4 mr-3 text-primary" /> {resource.license}</div>}
              {resource.pipeline_tag && <div className="flex items-center"><Tag className="w-4 h-4 mr-3 text-primary" />{resource.pipeline_tag}</div>}
            </CardContent>
          </Card>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resource.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// Dummy Input for compilation
function Input(props: any) {
  return <input {...props} />;
}
