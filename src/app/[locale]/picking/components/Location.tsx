import { Badge } from "@/components/ui/badge";
import React, { useEffect } from "react";

export const LocationSelect = ({ sku }: { sku: string }) => {
  useEffect(() => {
    console.log("LocationSelect");
  }, []);

  return (
    <div>
      <Badge className="bg-green-100 text-green-700 text-base">{sku}</Badge>
    </div>
  );
};
