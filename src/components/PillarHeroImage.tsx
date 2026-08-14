"use client";

import React from "react";
import { TechPlaceholder } from "@/components/TechPlaceholder";
import { ShieldCheck } from "lucide-react";

interface PillarHeroImageProps {
  imagePath: string;
  title: string;
  caption?: string;
  iconName?: string;
}

export function PillarHeroImage({ imagePath, title, caption }: PillarHeroImageProps) {
  return (
    <div className="w-full">
      <TechPlaceholder
        guidePath={imagePath}
        title={`${title} — Site Deployment Asset`}
        subtitle={caption || "High-definition photo of on-site equipment, control room video wall, or infrastructure installation."}
        icon={ShieldCheck}
        ratio="21:9"
        dimensions="1280 × 500 px (Landscape HD)"
        tag="SPECIFICATION ASSET READY"
        className="rounded-3xl"
      />
    </div>
  );
}
