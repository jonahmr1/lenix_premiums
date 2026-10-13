import { control, emitNui } from "lenix/client";
import type { Gang } from "types/index";

export default () => [
  control.on({
    event: "press",
    key: "K",
    onEvent: () => emitNui<Gang.Events["displayIpad"]>("ipad:display"),
  }),
];
