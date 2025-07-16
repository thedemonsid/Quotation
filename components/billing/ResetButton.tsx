import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface ResetButtonProps {
  onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
  return (
    <Button onClick={onReset} variant="outline" className="w-full" size="lg">
      <RotateCcw className="h-4 w-4 mr-2" />
      Reset All Values
    </Button>
  );
}
