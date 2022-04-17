export async function sendPercentileToChat(actor, skill, target, rollMode){
  const roll = new Roll('1d100', actor.data.data);

  await roll.evaluate({ async: true });

  const total = roll.total;
  let isCritical = false;
  let isSuccess = false;
  let html = '';
  let label = '';
  let resultString = '';
  let styleOverride = '';

  if (rollMode == null || rollMode === ''){
    rollMode = game.settings.get('core', 'rollMode');
  }

  // if using private san rolls, must hide any SAN role unless user is a GM
  let setting = false;

  setting = game.settings.get('wondershade', 'keepSanityPrivate');

  if (setting === true && (skill === 'SAN' || skill === 'RITUAL' || skill === 'Unsanity') && !game.user.isGM){
    rollMode = 'blindroll';
  }

  // "Inhuman" stat being rolled, logic is different per page 188 of the Handler's Guide.
  // Note - originally implemented by Uriele, but my attempt at merging conficts went poorly, so re-implementing.
  // For an inhuman check, the roll succeeds except on a roll of 100 which fails AND fumbles.
  // If the roll is a matching digit roll, it is a critical as normal.
  // Also, if the roll is below the regular (non-x5) value of the stat, it is a critical.  E.g. a CON of 25, a d100 roll of 21 would be a critical.
  if (target > 99 && skillIsStatTest(skill)){
    label = `${game.i18n.localize('DG.Roll.Rolling')} <b>${skill} [${game.i18n.localize('DG.Roll.Inhuman').toUpperCase()}]</b> ${game.i18n.localize('DG.Roll.Target')} ${Math.floor(target / 5)}`;

    if (total === 100){
      // only possible fail criteria, and also a fumble.
      isSuccess = false;
      isCritical = true;
    } else {
      isSuccess = true;
      if (total <= (target / 5.0)){
        isCritical = true;
      } else if (skillCheckResultIsCritical(total)){
        isCritical = true;
      } else {
        isCritical = false;
      }
    }
  } else {
    label = `${game.i18n.localize('DG.Roll.Rolling')} <b>${skill}</b> ${game.i18n.localize('DG.Roll.Target')} ${target}`;

    isCritical = skillCheckResultIsCritical(total);

    if (total <= target){
      isSuccess = true;
    }
  }

  if (isCritical){
    resultString = `${game.i18n.localize('DG.Roll.Critical')} `;
  }

  if (isSuccess){
    resultString += `${game.i18n.localize('DG.Roll.Success')}`;

    if (isCritical){
      resultString = `${resultString.toUpperCase()}!`;
      styleOverride = 'color: green';
    }
  } else {
    resultString += `${game.i18n.localize('DG.Roll.Failure')}`;

    if (isCritical){
      resultString = `${resultString.toUpperCase()}!`;
      styleOverride = 'color: red';
    }
  }

  html = `<div class="dice-roll">
            <div class="dice-result">
              <div style="${styleOverride}" class="dice-formula">${resultString}</div>
              <div class="dice-tooltip">
                <section class="tooltip-part">
                  <div class="dice">
                    <p class="part-formula">
                      ${roll.formula}
                      <span class="part-total">${roll.total}</span>
                    </p>
                    <ol class="dice-rolls">
                      <li class="roll die ${roll.formula}">${roll.total}</li>
                    </ol>
                  </div>
                </section>
              </div>
            <h4 class="dice-total">${roll.total}</h4>
          </div>`;

  const chatData = {
    speaker: ChatMessage.getSpeaker({actor: actor}),
    content: html,
    flavor: label,
    type: 5, //CHAT_MESSAGE_TYPES.ROLL,
    roll: roll,
    rollMode: rollMode,
  };

  ChatMessage.create(chatData, {});
}

export default class WonderRoll extends Roll {

}
