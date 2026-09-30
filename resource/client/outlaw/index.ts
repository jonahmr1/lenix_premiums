import "./wall";
import emotes from "./emotes";
// import rank from './rank'
import identities from "./identities";
import radialmenu from "./radialmenu";
import criminaltask from "./criminaltask";
import vehicles from "./vehicles";
import robbery from "./robbery";
import roster from "./roster";
import elevators from "./elevators";
import hud from "./hud";
import safezones from "./safezones";
// import topscore from './topscore'
import locker from "./locker";
import { asserts } from "@lenix/lenix";
// import ipad from './ipad'

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

export const login = (logout: () => void) => {
  logout();
  const modules = [
    emotes,
    // rank,
    identities,
    radialmenu,
    criminaltask,
    vehicles,
    robbery,
    roster,
    elevators,
    hud,
    safezones,
    // topscore,
		locker,
		// ipad,
  ];

  return () => {
    for (const disposes of modules) for (const dispose of disposes) dispose();
  };
};
