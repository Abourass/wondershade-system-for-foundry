export default async function preloadHBSTemplates(){
  const templatePaths = [
    // Layout
    'systems/wondershade/templates/partials/layout/backgroundInfo.hbs',
    'systems/wondershade/templates/partials/layout/stats.hbs',
    'systems/wondershade/templates/partials/layout/forces.hbs',
    'systems/wondershade/templates/partials/layout/difficultyInitAndRest.hbs',
    'systems/wondershade/templates/partials/layout/tabs.hbs',
    // Tabs
    'systems/wondershade/templates/partials/layout/tabs/combat.hbs',
    'systems/wondershade/templates/partials/layout/tabs/inventory.hbs',
    'systems/wondershade/templates/partials/layout/tabs/journal.hbs',
    'systems/wondershade/templates/partials/layout/tabs/magick.hbs',
    'systems/wondershade/templates/partials/layout/tabs/skills.hbs',
  ];

  return loadTemplates(templatePaths);
}
