import { AdvancementError } from './advancement-flow.js';

/**
 * @typedef {object} AdvancementStep
 * @property {string} type                Step type from "forward", "reverse", "restore", or "delete".
 * @property {AdvancementFlow} [flow]     Flow object for the advancement being applied by this step.
 * @property {WonderItem} [item]              For "delete" steps only, the item to be removed.
 * @property {object} [class]             Contains data on class if step was triggered by class level change.
 * @property {WonderItem} [class.item]        Class item that caused this advancement step.
 * @property {number} [class.level]       Level the class should be during this step.
 * @property {boolean} [automatic=false]  Should the manager attempt to apply this step without user interaction?
 */

/**
 * Application for controlling the advancement workflow and displaying the interface.
 *
 * @property {WonderActor} actor        Actor on which this advancement is being performed.
 * @property {object} [steps=[]]    Any initial steps that should be displayed.
 * @property {object} [options={}]  Additional application options.
 * @extends {Application}
 */
export class AdvancementManager extends Application {
  constructor(actor, options = {}) {
    super(options);

    /**
     * The original actor to which changes will be applied when the process is complete.
     * @type {WonderActor}
     */
    this.actor = actor;

    /**
     * A clone of the original actor to which the changes can be applied during the advancement process.
     * @type {WonderActor}
     */
    this.clone = actor.clone();

    /**
     * Individual steps that will be applied in order.
     * @type {object}
     */
    this.steps = [];

    /**
     * Step being currently displayed.
     * @type {number|null}
     * @private
     */
    this._stepIndex = null;

    /**
     * Is the prompt currently advancing through un-rendered steps?
     * @type {boolean}
     * @private
     */
    this._advancing = false;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['wondershade', 'advancement', 'flow'],
      template: 'systems/wondershade/templates/advancement/advancement-manager.hbs',
      width: 460,
      height: 'auto',
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get title() {
    const visibleSteps = this.steps.filter(s => !s.automatic);
    const visibleIndex = visibleSteps.indexOf(this.step);
    const step = visibleIndex < 0 ? '' : game.i18n.format('WonderSystem.AdvancementManagerSteps', {
      current: visibleIndex + 1,
      total: visibleSteps.length,
    });
    return `${game.i18n.localize('WonderSystem.AdvancementManagerTitle')} ${step}`;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  get id() {
    return `actor-${this.actor.id}-advancement`;
  }

  /* -------------------------------------------- */

  /**
   * Get the step that is currently in progress.
   * @type {object|null}
   */
  get step() {
    return this.steps[this._stepIndex] ?? null;
  }

  /* -------------------------------------------- */

  /**
   * Get the step before the current one.
   * @type {object|null}
   */
  get previousStep() {
    return this.steps[this._stepIndex - 1] ?? null;
  }

  /* -------------------------------------------- */

  /**
   * Get the step after the current one.
   * @type {object|null}
   */
  get nextStep() {
    const nextIndex = this._stepIndex === null ? 0 : this._stepIndex + 1;
    return this.steps[nextIndex] ?? null;
  }

  /* -------------------------------------------- */
  /*  Factory Methods                             */
  /* -------------------------------------------- */

  /**
   * Construct a manager for a newly added item.
   * @param {WonderActor} actor         Actor to which the item is being added.
   * @param {object} itemData       Data for the item being added.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forNewItem(actor, itemData, options = {}) {
    const manager = new this(actor, options);

    // Prepare data for adding to clone
    const dataClone = foundry.utils.deepClone(itemData);
    dataClone._id = foundry.utils.randomID();
    if (itemData.type === 'class') {
      dataClone.data.levels = 0;
      if (!manager.clone.data.data.details.originalClass) {
        manager.clone.data.update({'data.details.originalClass': dataClone._id});
      }
    }

    // Add item to clone & get new instance from clone
    manager.clone.data.update({items: [dataClone]});
    manager.clone.prepareData();
    const clonedItem = manager.clone.items.get(dataClone._id);

    // For class items, prepare level change data
    if (itemData.type === 'class') {
      return manager.createLevelChangeSteps(clonedItem, itemData.data?.levels ?? 1);
    }

    // All other items, just create some flows up to current character level (or class level for subclasses)
    let targetLevel = manager.clone.data.data.details.level;
    if (clonedItem.type === 'subclass') targetLevel = clonedItem.class?.data.data.levels ?? 0;
    Array.fromRange(targetLevel + 1)
      .flatMap(l => this.flowsForLevel(clonedItem, l))
      .forEach(flow => manager.steps.push({ type: 'forward', flow }));

    return manager;
  }

  /* -------------------------------------------- */

  /**
   * Construct a manager for modifying choices on an item at a specific level.
   * @param {WonderActor} actor         Actor from which the choices should be modified.
   * @param {object} itemId         ID of the item whose choices are to be changed.
   * @param {number} level          Level at which the choices are being changed.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forModifyChoices(actor, itemId, level, options) {
    const manager = new this(actor, options);
    const clonedItem = manager.clone.items.get(itemId);
    if (!clonedItem) return manager;

    const currentLevel = clonedItem.data.data.levels ?? clonedItem.class?.data.data.levels
      ?? manager.clone.data.data.details.level;

    const flows = Array.fromRange(currentLevel + 1).slice(level)
      .flatMap(l => this.flowsForLevel(clonedItem, l));

    // Revert advancements through changed level
    flows.reverse().forEach(flow => manager.steps.push({ type: 'reverse', flow, automatic: true }));

    // Create forward advancements for level being changed
    flows.reverse().filter(f => f.level === level).forEach(flow => manager.steps.push({ type: 'forward', flow }));

    // Create restore advancements for other levels
    flows.filter(f => f.level > level).forEach(flow => manager.steps.push({ type: 'restore', flow, automatic: true }));

    return manager;
  }

  /* -------------------------------------------- */

  /**
   * Construct a manager for an item that needs to be deleted.
   * @param {WonderActor} actor         Actor from which the item should be deleted.
   * @param {object} itemId         ID of the item to be deleted.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forDeletedItem(actor, itemId, options) {
    const manager = new this(actor, options);
    const clonedItem = manager.clone.items.get(itemId);
    if (!clonedItem) return manager;

    // For class items, prepare level change data
    if (clonedItem.type === 'class') {
      return manager.createLevelChangeSteps(clonedItem, clonedItem.data.data.levels * -1);
    }

    // All other items, just create some flows down from current character level
    Array.fromRange(manager.clone.data.data.details.level + 1)
      .flatMap(l => this.flowsForLevel(clonedItem, l))
      .reverse()
      .forEach(flow => manager.steps.push({ type: 'reverse', flow, automatic: true }));

    // Add a final step to remove the item only if there are advancements to apply
    if (manager.steps.length) manager.steps.push({ type: 'delete', item: clonedItem, automatic: true });
    return manager;
  }

  /* -------------------------------------------- */

  /**
   * Construct a manager for a change in a class's levels.
   * @param {WonderActor} actor         Actor whose level has changed.
   * @param {string} classId        ID of the class being changed.
   * @param {number} levelDelta     Levels by which to increase or decrease the class.
   * @param {object} options        Rendering options passed to the application.
   * @returns {AdvancementManager}  Prepared manager. Steps count can be used to determine if advancements are needed.
   */
  static forLevelChange(actor, classId, levelDelta, options = {}) {
    const manager = new this(actor, options);
    const clonedItem = manager.clone.items.get(classId);
    if (!clonedItem) return manager;
    return manager.createLevelChangeSteps(clonedItem, levelDelta);
  }

  /* -------------------------------------------- */

  /**
   * Create steps based on the provided level change data.
   * @param {string} classItem      Class being changed.
   * @param {number} levelDelta     Levels by which to increase or decrease the class.
   * @returns {AdvancementManager}  Manager with new steps.
   * @private
   */
  createLevelChangeSteps(classItem, levelDelta) {
    const pushSteps = (flows, data) => this.steps.push(...flows.map(flow => ({ flow, ...data })));
    const getItemFlows = characterLevel => this.clone.items.contents.flatMap((i) => {
      if (['class', 'subclass'].includes(i.type)) return [];
      return this.constructor.flowsForLevel(i, characterLevel);
    });

    // Level increased
    for (let offset = 1; offset <= levelDelta; offset++) {
      const classLevel = classItem.data.data.levels + offset;
      const characterLevel = this.actor.data.data.details.level + offset;
      const stepData = { type: 'forward', class: {item: classItem, level: classLevel} };
      pushSteps(this.constructor.flowsForLevel(classItem, classLevel), stepData);
      pushSteps(this.constructor.flowsForLevel(classItem.subclass, classLevel), stepData);
      pushSteps(getItemFlows(characterLevel), stepData);
    }

    // Level decreased
    for (let offset = 0; offset > levelDelta; offset--) {
      const classLevel = classItem.data.data.levels + offset;
      const characterLevel = this.actor.data.data.details.level + offset;
      const stepData = { type: 'reverse', class: {item: classItem, level: classLevel}, automatic: true };
      pushSteps(getItemFlows(characterLevel).reverse(), stepData);
      pushSteps(this.constructor.flowsForLevel(classItem.subclass, classLevel).reverse(), stepData);
      pushSteps(this.constructor.flowsForLevel(classItem, classLevel).reverse(), stepData);
      if (classLevel === 1) this.steps.push({ type: 'delete', item: classItem, automatic: true });
    }

    return this;
  }

  /* -------------------------------------------- */

  /**
   * Creates advancement flows for all advancements at a specific level.
   * @param {WonderItem} item          Item that has advancement.
   * @param {number} level         Level in question.
   * @returns {AdvancementFlow[]}  Created flow applications.
   * @protected
   */
  static flowsForLevel(item, level) {
    return (item?.advancement.byLevel[level] ?? [])
      .filter(a => a.appliesToClass)
      .map(a => new a.constructor.metadata.apps.flow(item, a.id, level));
  }

  /* -------------------------------------------- */
  /*  Form Rendering                              */
  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    if (!this.step) return {};

    // Prepare information for subheading
    const item = this.step.flow.item;
    let level = this.step.flow.level;
    if ((this.step.class) && ['class', 'subclass'].includes(item.type)) level = this.step.class.level;

    const visibleSteps = this.steps.filter(s => !s.automatic);
    const visibleIndex = visibleSteps.indexOf(this.step);

    return {
      actor: this.clone,
      flowId: this.step.flow.id,
      header: item.name,
      subheader: level ? game.i18n.format('WonderSystem.AdvancementLevelHeader', { level }) : '',
      steps: {
        current: visibleIndex + 1,
        total: visibleSteps.length,
        hasPrevious: visibleIndex > 0,
        hasNext: visibleIndex < visibleSteps.length - 1,
      },
    };
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  render(...args) {
    if (this.steps.length && (this._stepIndex === null)) this._stepIndex = 0;

    // Ensure the level on the class item matches the specified level
    if (this.step?.class) {
      let level = this.step.class.level;
      if (this.step.type === 'reverse') level -= 1;
      this.step.class.item.data.update({'data.levels': level});
      this.clone.prepareData();
    }

    /**
     * A hook event that fires when an AdvancementManager is about to be processed.
     * @function wondershade.preAdvancementManagerRender
     * @memberof hookEvents
     * @param {AdvancementManager} advancementManager The advancement manager about to be rendered
     */
    const allowed = Hooks.call('wondershade.preAdvancementManagerRender', this);

    // Abort if not allowed
    if (allowed === false) return this;

    if (this.step?.automatic) {
      if (this._advancing) return this;
      this._forward();
      return this;
    }

    return super.render(...args);
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async _render(force, options) {
    await super._render(force, options);
    if ((this._state !== Application.RENDER_STATES.RENDERED) || !this.step) return;

    // Render the step
    this.step.flow._element = null;
    await this.step.flow._render(force, options);
    this.setPosition();
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);
    html.find('button[data-action]').click((event) => {
      const buttons = html.find('button');
      buttons.attr('disabled', true);
      html.find('.error').removeClass('error');
      try {
        switch (event.currentTarget.dataset.action) {
          case 'restart':
            if (!this.previousStep) return;
            return this._restart(event);
          case 'previous':
            if (!this.previousStep) return;
            return this._backward(event);
          case 'next':
          case 'complete':
            return this._forward(event);
        }
      } finally {
        buttons.attr('disabled', false);
      }
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async close(options = {}) {
    if (!options.skipConfirmation) {
      return new Dialog({
        title: `${game.i18n.localize('WonderSystem.AdvancementManagerCloseTitle')}: ${this.actor.name}`,
        content: game.i18n.localize('WonderSystem.AdvancementManagerCloseMessage'),
        buttons: {
          close: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('WonderSystem.AdvancementManagerCloseButtonStop'),
            callback: () => super.close(options),
          },
          continue: {
            icon: '<i class="fas fa-chevron-right"></i>',
            label: game.i18n.localize('WonderSystem.AdvancementManagerCloseButtonContinue'),
          },
        },
        default: 'close',
      }).render(true);
    }
    await super.close(options);
  }

  /* -------------------------------------------- */
  /*  Process                                     */
  /* -------------------------------------------- */

  /**
   * Advance through the steps until one requiring user interaction is encountered.
   * @param {Event} [event]  Triggering click event if one occurred.
   * @returns {Promise}
   * @private
   */
  async _forward(event) {
    this._advancing = true;
    try {
      do {
        const flow = this.step.flow;

        // Apply changes based on step type
        if (this.step.type === 'delete') this.clone.items.delete(this.step.item.id);
        else if (this.step.type === 'restore') await flow.advancement.restore(flow.level, flow.retainedData);
        else if (this.step.type === 'reverse') flow.retainedData = await flow.advancement.reverse(flow.level);
        else await flow._updateObject(event, flow._getSubmitData());

        this._stepIndex++;

        // Ensure the level on the class item matches the specified level
        if (this.step?.class) {
          let level = this.step.class.level;
          if (this.step.type === 'reverse') level -= 1;
          this.step.class.item.data.update({'data.levels': level});
        }

        this.clone.prepareData();
      } while (this.step?.automatic);
    } catch (error) {
      if (!(error instanceof AdvancementError)) throw error;
      ui.notifications.error(error.message);
      this.step.automatic = false;
      if (this.step.type === 'restore') this.step.type = 'forward';
    } finally {
      this._advancing = false;
    }

    if (this.step) this.render(true);
    else this._complete();
  }

  /* -------------------------------------------- */

  /**
   * Reverse through the steps until one requiring user interaction is encountered.
   * @param {Event} [event]                  Triggering click event if one occurred.
   * @param {object} [options]               Additional options to configure behaviour.
   * @param {boolean} [options.render=true]  Whether to render the Application after the step has been reversed. Used
   *                                         by the restart workflow.
   * @returns {Promise}
   * @private
   */
  async _backward(event, { render = true } = {}) {
    this._advancing = true;
    try {
      do {
        this._stepIndex--;
        if (!this.step) break;
        const flow = this.step.flow;

        // Reverse step based on step type
        if (this.step.type === 'delete') this.clone.data.update({items: [this.step.item]});
        else if (this.step.type === 'reverse') await flow.advancement.restore(flow.level, flow.retainedData);
        else flow.retainedData = await flow.advancement.reverse(flow.level);

        this.clone.prepareData();
      } while (this.step?.automatic);
    } catch (error) {
      if (!(error instanceof AdvancementError)) throw error;
      ui.notifications.error(error.message);
      this.step.automatic = false;
    } finally {
      this._advancing = false;
    }

    if (!render) return;
    if (this.step) this.render(true);
    else this.close({ skipConfirmation: true });
  }

  /* -------------------------------------------- */

  /**
   * Reset back to the manager's initial state.
   * @param {MouseEvent} [event]  The triggering click event if one occurred.
   * @returns {Promise}
   * @private
   */
  async _restart(event) {
    const restart = await Dialog.confirm({
      title: game.i18n.localize('WonderSystem.AdvancementManagerRestartConfirmTitle'),
      content: game.i18n.localize('WonderSystem.AdvancementManagerRestartConfirm'),
    });
    if (!restart) return;
    // While there is still a renderable step.
    while (this.steps.slice(0, this._stepIndex).some(s => !s.automatic)) {
      await this._backward(event, {render: false});
    }
    this.render(true);
  }

  /* -------------------------------------------- */

  /**
   * Apply changes to actual actor after all choices have been made.
   * @param {Event} event  Button click that triggered the change.
   * @returns {Promise}
   * @private
   */
  async _complete(event) {
    const updates = this.clone.toObject();
    const items = updates.items;
    delete updates.items;

    // Gather changes to embedded items
    const { toCreate, toUpdate, toDelete } = items.reduce((obj, item) => {
      if (!this.actor.items.get(item._id)) {
        obj.toCreate.push(item);
      } else {
        obj.toUpdate.push(item);
        obj.toDelete.findSplice(id => id === item._id);
      }
      return obj;
    }, { toCreate: [], toUpdate: [], toDelete: this.actor.items.map(i => i.id) });

    // Apply changes from clone to original actor
    await Promise.all([
      this.actor.update(updates, { isAdvancement: true }),
      this.actor.createEmbeddedDocuments('Item', toCreate, { keepId: true, isAdvancement: true }),
      this.actor.updateEmbeddedDocuments('Item', toUpdate, { isAdvancement: true }),
      this.actor.deleteEmbeddedDocuments('Item', toDelete, { isAdvancement: true }),
    ]);

    /**
     * A hook event that fires when an AdvancementManager is done modifying an actor.
     * @function wondershade.advancementManagerComplete
     * @memberof hookEvents
     * @param {AdvancementManager} advancementManager The advancement manager that just completed
     */
    Hooks.callAll('wondershade.advancementManagerComplete', this);

    // Close prompt
    return this.close({ skipConfirmation: true });
  }
}
