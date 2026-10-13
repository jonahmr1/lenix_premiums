import { Constants } from "common/config/constants";
import { api } from "lenix/client";

const load = () => {
  const id = api.ox_target?.addSphereZone?.({
    coords: Constants.locker.coords,
    options: {
      label: "Personal Locker",
      onSelect: () => api.ox_inventory?.openInventory?.("stash", Constants.locker.name),
    },
  });

  return () => api.ox_target?.removeZone?.(id);
};

export default () => [load()];
