import type { AppIcon } from "@/ipad/types";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router";
import { apps } from "../constants";

const App = ({ name, styles, icon: { element: Element, styles: iconStyles } }: Omit<AppIcon, "element">) => {
  const nav = useNavigate();

  return (
    <div className="text-center">
      <Button
        className="size-13 p-0 bg-background hover:bg-background rounded-xl cursor-pointer"
        onClick={() => nav(`/${name}`)}
      >
        <div className={cn("size-full p-2 rounded-xl", styles)}>
          <Element className={cn("size-full", iconStyles)} />
        </div>
      </Button>
      <p className="text-white text-xs font-bold drop-shadow-lg drop-shadow-black">{name}</p>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="relative grid size-full grid-cols-5 content-start gap-4 p-4">
      <App
        name="Settings"
        styles="bg-muted"
        icon={{
          element: Settings,
          styles: "text-foreground",
        }}
      />
      {apps.map((app) => (
        <App {...app} key={app.name} />
      ))}
    </div>
  );
};
