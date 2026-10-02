import emotes from "./emotes";
import identities from "./identities";
import radialmenu from "./radialmenu";
import hud from "./hud";
import safezones from "./safezones";
import { asserts } from "@lenix/lenix";
import type { Start } from "types/index";

let modifiers: string[] = [];
let currentIndex = 0;
let active = false;

// Build the list once on resource start
setTick(async () => {
    for (let i = 0; i < 300; i++) {
        const name = GetTimecycleModifierNameByIndex(i);
        if (name && name !== "") {
            modifiers.push(name);
        }
    }
    console.log(`Loaded ${modifiers.length} timecycle modifiers`);
});

function applyCurrent(): void {
    if (modifiers.length === 0) return;
    const name = modifiers[currentIndex];
		asserts(name)
    SetTimecycleModifier(name);
    active = true;
    console.log(`[${currentIndex + 1}/${modifiers.length}] ${name}`);
}

RegisterCommand('blurnext', () => {
    if (modifiers.length === 0) return;
    currentIndex = (currentIndex + 1) % modifiers.length;
    applyCurrent();
}, false);

RegisterCommand('blurprev', () => {
    if (modifiers.length === 0) return;
    currentIndex = (currentIndex - 1 + modifiers.length) % modifiers.length;
    applyCurrent();
}, false);

RegisterCommand('blurclear', () => {
    ClearTimecycleModifier();
    active = false;
    console.log("Cleared");
}, false);

RegisterKeyMapping('blurnext', 'Next Timecycle Modifier', 'keyboard', 'PAGEUP');
RegisterKeyMapping('blurprev', 'Previous Timecycle Modifier', 'keyboard', 'PAGEDOWN');
RegisterKeyMapping('blurclear', 'Clear Timecycle Modifier', 'keyboard', 'PAGEDOWN');

export default (logout: () => void, mode: Start.Mode) => {
  logout();
	const radialmenuMod = radialmenu(mode)
  const modules = [
    emotes,
    identities,
    radialmenuMod,
		hud,
    safezones,
  ];

  return () => {
    for (const disposes of modules) for (const dispose of disposes) dispose();
  };
};
