import { Advancement } from './advancement.js';
import AdvancementConfig from './advancement-config.js';
import AdvancementConfirmationDialog from './advancement-confirmation-dialog.js';
import { AdvancementError, AdvancementFlow } from './advancement-flow.js';
import { AdvancementManager } from './advancement-manager.js';
import { AdvancementSelection } from './advancement-selection.js';
import { HitPointsAdvancement } from './hit-points.js';
import { ItemGrantAdvancement } from './item-grant.js';
import { ScaleValueAdvancement } from './scale-value.js';

export const advancement = {
  Advancement,
  AdvancementConfig,
  AdvancementConfirmationDialog,
  AdvancementError,
  AdvancementFlow,
  AdvancementManager,
  AdvancementSelection,
  types: {
    HitPointsAdvancement,
    ItemGrantAdvancement,
    ScaleValueAdvancement,
  },
};
export default advancement;
