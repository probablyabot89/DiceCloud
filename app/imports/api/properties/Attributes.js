import SimpleSchema from 'simpl-schema';
import VARIABLE_NAME_REGEX from '/imports/constants/VARIABLE_NAME_REGEX.js';

/*
 * Attributes are numbered stats of a character
 */
let AttributeSchema = new SimpleSchema({
  name: {
		type: String,
    defaultValue: 'New Attribute',
	},
  // The technical, lowercase, single-word name used in formulae
  variableName: {
    type: String,
		regEx: VARIABLE_NAME_REGEX,
    min: 3,
    defaultValue: 'newAttribute',
  },
	// How it is displayed and computed is determined by type
  attributeType: {
    type: String,
    allowedValues: [
      'ability', //Strength, Dex, Con, etc.
      'stat', // Speed, Armor Class
			'modifier', // Proficiency Bonus, Initiative
      'hitDice', // d12 hit dice
      'healthBar', // Hitpoints, Temporary Hitpoints, can take damage
			'bar', // Displayed as a health bar, can't take damage
      'resource', // Rages, sorcery points
      'spellSlot', // Level 1, 2, 3... spell slots
      'utility', // Aren't displayed, Jump height, Carry capacity
    ],
    defaultValue: 'stat',
		index: 1,
  },
  // For type hitDice, the size needs to be stored separately
  hitDiceSize: {
    type: String,
    allowedValues: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
    optional: true,
  },
	// The starting value, before effects
	baseValueCalculation: {
		type: String,
		optional: true,
	},
  // Description of what the attribute is used for
  description: {
		type: String,
		optional: true,
	},
	// The damage done to the attribute, always positive
  damage: {
    type: SimpleSchema.Integer,
    optional: true,
		min: 0,
  },
  // Can the value be decimal?
  decimal: {
    type: Boolean,
    optional: true,
  },
	// Automatically zero the adjustment on these conditions
  reset: {
    type: String,
    optional: true,
    allowedValues: ['shortRest', 'longRest'],
  },
});

let ComputedOnlyAttributeSchema = new SimpleSchema({
  // The result of baseValueCalculation
  baseValue: {
    type: SimpleSchema.oneOf(Number, String, Boolean),
    optional: true,
  },
	// The computed value of the attribute
  value: {
    type: SimpleSchema.oneOf(Number, String, Boolean),
		defaultValue: 0,
    optional: true,
  },
	// The computed modifier, provided the attribute type is `ability`
	modifier: {
		type: SimpleSchema.Integer,
		optional: true,
	},
});

const ComputedAttributeSchema = new SimpleSchema()
  .extend(ComputedOnlyAttributeSchema)
  .extend(AttributeSchema);

export { AttributeSchema, ComputedOnlyAttributeSchema, ComputedAttributeSchema };
