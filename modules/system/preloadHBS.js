export default async function preloadHBSTemplates(){
  return loadTemplates([
    // Layout
    'systems/wondershade/templates/partials/layout/backgroundInfo.hbs',
    'systems/wondershade/templates/partials/layout/stats.hbs',
    'systems/wondershade/templates/partials/layout/forces.hbs',
    'systems/wondershade/templates/partials/layout/difficultyInitAndRest.hbs',
    'systems/wondershade/templates/partials/layout/tabs.hbs',
    // Tabs
    'systems/wondershade/templates/partials/tabs/combat.hbs',
    'systems/wondershade/templates/partials/tabs/inventory.hbs',
    'systems/wondershade/templates/partials/tabs/journal.hbs',
    'systems/wondershade/templates/partials/tabs/magick.hbs',
    'systems/wondershade/templates/partials/tabs/skills.hbs',
    // Inventory
    'systems/wondershade/templates/partials/layout/inventory/currencies.hbs',
    'systems/wondershade/templates/partials/layout/inventory/weapons.hbs',
    'systems/wondershade/templates/partials/layout/inventory/equipment.hbs',
    'systems/wondershade/templates/partials/layout/inventory/consumables.hbs',
    'systems/wondershade/templates/partials/layout/inventory/tools.hbs',
    'systems/wondershade/templates/partials/layout/inventory/loot.hbs',
    'systems/wondershade/templates/partials/layout/inventory/containers.hbs',
    // Item Sheets
    'systems/wondershade/templates/sheets/items/partials/item-description.hbs',
    'systems/wondershade/templates/sheets/items/partials/item-activation.hbs',
    'systems/wondershade/templates/sheets/items/partials/item-action.hbs',
    // Actor Sheets
    'systems/wondershade/templates/sheets/actors/partials/active-effects.hbs',
  ]);
}
