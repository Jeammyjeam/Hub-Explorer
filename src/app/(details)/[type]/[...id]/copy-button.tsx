"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { GitClone } from "lucide-react";

export default function CopyButton({ textToCopy }: { textToCopy: string }) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to clipboard!",
      description: "The command has been copied.",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8"
      onClick={handleCopy}
    >
      <GitClone className="h-4 w-4" />
    </Button>
  );
}
