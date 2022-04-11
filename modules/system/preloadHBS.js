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
    'systems/wondershade/templates/partials/layout/inventory/weapons.hbs',
    'systems/wondershade/templates/partials/layout/inventory/equipment.hbs',
  ]);
}
