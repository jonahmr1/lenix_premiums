import type { LucideIcon } from "lucide-react";

export interface AppIcon {
  name: string;
  styles: string;
  icon: {
    element: LucideIcon;
    styles: string;
  };
  element: () => React.JSX.Element;
}

export interface Storage {
  theme: "dark" | "light";
  orientation: Orientation;
}

export type Orientation = "portrait" | "landscape";
