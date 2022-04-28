/**
 * Dialog to confirm the deletion of an embedded item with advancement or decreasing a class level.
 * @extends {Dialog}
 */
export default class AdvancementConfirmationDialog extends Dialog {
  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: 'systems/wondershade/templates/advancement/advancement-confirmation-dialog.hbs',
      jQuery: false,
    });
  }

  /* -------------------------------------------- */

  /**
   * A helper function that displays the dialog prompting for an item deletion.
   * @param {WonderItem} item  Item to be deleted.
   */
  static forDelete(item) {
    return this.createDialog(
      item,
      game.i18n.localize('WonderSystem.AdvancementDeleteConfirmationTitle'),
      game.i18n.localize('WonderSystem.AdvancementDeleteConfirmationMessage'),
      {
        icon: '<i class="fas fa-trash"></i>',
        label: game.i18n.localize('Delete'),
      },
    );
  }

  /* -------------------------------------------- */

  /**
   * A helper function that displays the dialog prompting for leveling down.
   * @param {WonderItem} item  The class whose level is being changed.
   */
  static forLevelDown(item) {
    return this.createDialog(
      item,
      game.i18n.localize('WonderSystem.AdvancementLevelDownConfirmationTitle'),
      game.i18n.localize('WonderSystem.AdvancementLevelDownConfirmationMessage'),
      {
        icon: '<i class="fas fa-sort-numeric-down-alt"></i>',
        label: game.i18n.localize('WonderSystem.LevelActionDecrease'),
      },
    );
  }

  /* -------------------------------------------- */

  /**
   * A helper constructor function which displays the confirmation dialog.
   * @param {WonderItem} item              Item to be changed.
   * @param {string} title             Localized dialog title.
   * @param {string} message           Localized dialog message.
   * @param {object} continueButton    Object containing label and icon for the action button.
   * @returns {Promise<boolean|null>}  Resolves with whether advancements should be unapplied. Rejects with null.
   */
  static createDialog(item, title, message, continueButton) {
    return new Promise((resolve, reject) => {
      const dialog = new this({
        title: `${title}: ${item.name}`,
        content: message,
        buttons: {
          continue: foundry.utils.mergeObject(continueButton, {
            callback: (html) => {
              const checkbox = html.querySelector('input[name="apply-advancement"]');
              resolve(checkbox.checked);
            },
          }),
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('Cancel'),
            callback: html => reject(null),
          },
        },
        default: 'continue',
        close: () => reject(null),
      });
      dialog.render(true);
    });
  }
}
