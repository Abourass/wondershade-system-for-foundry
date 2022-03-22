export default async function preloadHBSTemplates(){
  const templatePaths = [
    'systems/wondershade/templates/partials/layout/backgroundInfo.hbs',
    'systems/wondershade/templates/partials/layout/stats.hbs',
    'systems/wondershade/templates/partials/layout/forces.hbs',
    'systems/wondershade/templates/partials/layout/difficultyInitAndRest.hbs',
  ];

  return loadTemplates(templatePaths);
}
