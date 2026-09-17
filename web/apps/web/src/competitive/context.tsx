import { createContext } from "react";
import type { States } from "@/types";
import type { S } from "@lenix/lenix";

export const CompetitiveContext = createContext<{
	state: States
	setState: S<States>
} | null>(null)