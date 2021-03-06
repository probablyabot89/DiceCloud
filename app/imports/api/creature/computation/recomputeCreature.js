import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { assertEditPermission } from '/imports/api/creature/creaturePermissions.js';
import ComputationMemo from '/imports/api/creature/computation/ComputationMemo.js';
import computeMemo from '/imports/api/creature/computation/computeMemo.js';
import getCalculationProperties from '/imports/api/creature/computation/getCalculationProperties.js';
import writeAlteredProperties from '/imports/api/creature/computation/writeAlteredProperties.js';
import writeCreatureVariables from '/imports/api/creature/computation/writeCreatureVariables.js';

export const recomputeCreature = new ValidatedMethod({

  name: 'Creatures.methods.recomputeCreature',

  validate: new SimpleSchema({
    charId: { type: String }
  }).validator(),

  run({charId}) {
    // Permission
    assertEditPermission(charId, this.userId);
    // Work, call this direcly if you are already in a method that has checked
    // for permission to edit a given character
    recomputeCreatureById(charId);
  },

});

/**
 * This function is the heart of DiceCloud. It recomputes a creature's stats,
 * distilling down effects and proficiencies into the final stats that make up
 * a creature.
 *
 * Essentially this is a depth first tree traversal algorithm that computes
 * stats' dependencies before computing stats themselves, while detecting
 * dependency loops.
 *
 * At the moment it makes no effort to limit recomputation to just what was
 * changed.
 *
 * Attempting to implement dependency management to limit recomputation to just
 * change affected stats should only happen as a last resort, when this function
 * can no longer be performed more efficiently, and server resources can not be
 * expanded to meet demand.
 *
 * A brief overview:
 * - Fetch the stats of the creature and add them to
 *   an object for quick lookup
 * - Fetch the effects and proficiencies which apply to each stat and store them with the stat
 * - Fetch the class levels and store them as well
 * - Mark each stat and effect as uncomputed
 * - Iterate over each stat in order and compute it
 *   - If the stat is already computed, skip it
 *   - If the stat is busy being computed, we are in a dependency loop, make it NaN and mark computed
 *   - Mark the stat as busy computing
 *   - Iterate over each effect which applies to the attribute
 *     - If the effect is not computed compute it
 *       - If the effect relies on another attribute, get its computed value
 *       - Recurse if that attribute is uncomputed
 *     - apply the effect to the attribute
 *   - Conglomerate all the effects to compute the final stat values
 *   - Mark the stat as computed
 * - Write the computed results back to the database
 */
export function recomputeCreatureById(creatureId){
  let props = getCalculationProperties(creatureId);
  let computationMemo = new ComputationMemo(props);
  computeMemo(computationMemo);
  writeAlteredProperties(computationMemo);
  writeCreatureVariables(computationMemo, creatureId);
  // if(Meteor.isClient) console.log(computationMemo);
  return computationMemo;
}
