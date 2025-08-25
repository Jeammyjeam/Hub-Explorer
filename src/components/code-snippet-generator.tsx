"use client";

import { useState } from "react";
import { useFlow } from "@genkit-ai/next/client";
import { generateCodeSnippet } from "@/ai/flows/generate-code-snippet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Wand2, Bot, CodeXml } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResourceType } from "@/types/huggingface";

type CodeSnippetGeneratorProps = {
  resourceId: string;
  resourceType: ResourceType extends "spaces" ? never : ResourceType;
};

export default function CodeSnippetGenerator({ resourceId, resourceType }: CodeSnippetGeneratorProps) {
  if (resourceType === 'spaces') return null;

  const [language, setLanguage] = useState<"python" | "javascript">("python");
  const [code, setCode] = useState<string>("");
  const { toast } = useToast();
  const { run: generate, running } = useFlow(generateCodeSnippet, {
    onSuccess: (result) => {
      setCode(result.codeSnippet.replace(/```(python|javascript)\n|```/g, "").trim());
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error Generating Code",
        description: error.message,
      });
    },
  });

  const handleGenerate = () => {
    setCode("");
    generate({ resourceId, resourceType, language });
  };
  
  const handleCopyToClipboard = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard!",
      description: "The code snippet has been copied.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot className="mr-2" />
            Usage Snippets
          </div>
          <Button onClick={handleGenerate} disabled={running} size="sm">
            <Wand2 className="mr-2 h-4 w-4" />
            {running ? 'Generating...' : code ? 'Regenerate' : 'Generate'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={language} onValueChange={(v) => setLanguage(v as "python" | "javascript")} className="mb-4">
          <TabsList>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative rounded-md bg-background border p-4 font-mono text-sm min-h-[150px]">
          {running && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {!running && code && (
            <>
              <pre className="whitespace-pre-wrap break-all">{code}</pre>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </>
          )}
          {!running && !code && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[100px]">
              <CodeXml className="h-8 w-8 mb-2" />
              <p>Click 'Generate' to get a code snippet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
