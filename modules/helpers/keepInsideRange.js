/**
 *
 * @param {number} value
 * @param {number} min The minimum the value can be returned as
 * @param {number} max The maximum the value can be returned as
 * @returns {number}
 */
export default function keepInsideRange(value, min, max) {
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Math.keepInsideRange: value, min and max must be numbers');
  }
  if (value < min) value = min;
  if (value > max) value = max;
  return value;
}
