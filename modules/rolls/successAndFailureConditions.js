import keepInsideRange from '../helpers/keepInsideRange.js';
/**
  *
  * @param {number} value
  * @param {number} difficulty
  * @param {number} innateLuck
  * @returns {{success: number, hardSuccess: number, criticalSuccess: number, hardFailure: number, criticalFailure: number}}
**/
export function successAndFailureConditions(value, difficulty, innateLuck){
  // Typecast the attributes if they are not already numbers
  if (typeof value !== 'number') Number(value);
  if (typeof difficulty !== 'number') difficulty = Number(difficulty);
  if (typeof innateLuck !== 'number') innateLuck = Number(innateLuck);
  // Success is equal to the skill's value minus the difficulty
  const success = keepInsideRange((value + difficulty + innateLuck), 1, 100);
  // Hard Success is 25% of success
  const hardSuccess = (success !== 1)
    ? keepInsideRange(Math.floor(success / 4), 1, 100)
    : 0;
  // Crit success is 12.5% of success
  let criticalSuccess = (success !== 1)
    ? keepInsideRange(Math.floor(success / 8), 1, 100)
    : 0;
  // if hard success and crit success are the same subtract one from crit success
  if (hardSuccess === criticalSuccess) --criticalSuccess;
  // Hard Failure is 100 - 28% lack of skill (easier to fuck up in life)
  const hardFailure = keepInsideRange(100 - Math.floor((100 - success) / 3.5), 1, 100);
  // Critical Failure is 100 - 12.5% lack of skill
  const criticalFailure = keepInsideRange(100 - Math.floor((100 - success) / 8), 1, 100);

  return { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure };
}

/**
   *
   * @param {number} computedRoll
   * @param {number} value
   * @param {number} difficulty
   * @param {number} innateLuck
   * @returns {'Success'|'Hard Success'|'Critical Success'|'Failure'|'Hard Failure'|'Critical Failure'}
   */
export function getOutcome(computedRoll, value, difficulty, innateLuck){
  const { success, hardSuccess, criticalSuccess, hardFailure, criticalFailure } = successAndFailureConditions(value, difficulty, innateLuck);

  if (computedRoll <= success) {
    if (computedRoll <= hardSuccess) {
      if (computedRoll <= criticalSuccess) return 'Critical Success';
      return 'Hard Success';
    }
    return 'Success';
  }
  if (computedRoll >= hardFailure) {
    if (computedRoll >= criticalFailure) return 'Critical Failure';
    return 'Hard Failure';
  }
  return 'Failure';
}

/**
 *
 * @param {number} computedRoll
 * @param {number} value
 * @param {number} difficulty
 * @param {number} innateLuck
 * @returns {{
 *  outcome: { success: number, hardSuccess: number, criticalSuccess: number, hardFailure: number, criticalFailure: number },
 *  condition: 'Success'|'Hard Success'|'Critical Success'|'Failure'|'Hard Failure'|'Critical Failure'
 * }}
 */
export default function getOutcomeAndConditions(computedRoll, value, difficulty, innateLuck){
  return {
    outcome: getOutcome(computedRoll, value, difficulty, innateLuck),
    condition: successAndFailureConditions(value, difficulty, innateLuck),
  };
}
