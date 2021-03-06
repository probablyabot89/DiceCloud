<template lang="html">
  <div class="stats-tab ma-2">
    <div class="px-2 pt-2">
      <health-bar-card-container :creature-id="creatureId" />
    </div>

    <column-layout>
      <div class="ability-scores">
        <v-card>
          <v-list>
            <template v-for="(ability, index) in abilities">
              <v-divider
                v-if="index !== 0"
                :key="index"
              />
              <ability-list-tile
                :key="ability._id"
                :model="ability"
                :data-id="ability._id"
                @click="clickProperty({_id: ability._id})"
              />
            </template>
          </v-list>
        </v-card>
      </div>

      <div
        v-for="stat in stats"
        :key="stat._id"
        class="stat"
      >
        <attribute-card
          v-bind="stat"
          :data-id="stat._id"
          @click="clickProperty({_id: stat._id})"
        />
      </div>

      <div
        v-for="modifier in modifiers"
        :key="modifier._id"
        class="modifier"
      >
        <attribute-card
          modifier
          v-bind="modifier"
          :data-id="modifier._id"
          @click="clickProperty({_id: modifier._id})"
        />
      </div>

      <div
        v-for="check in checks"
        :key="check._id"
        class="check"
      >
        <attribute-card
          modifier
          v-bind="check"
          :data-id="check._id"
          @click="clickProperty({_id: check._id})"
        />
      </div>

      <div class="hit-dice">
        <v-card>
          <v-list>
            <v-subheader>Hit Dice</v-subheader>
            <template v-for="(hitDie, index) in hitDice">
              <v-divider
                v-if="index !== 0"
                :key="hitDie._id + 'divider'"
              />
              <hit-dice-list-tile
                :key="hitDie._id"
                :model="hitDie"
                :data-id="hitDie._id"
                @click="clickProperty({_id: hitDie._id})"
                @change="e => incrementChange(hitDie._id, e)"
              />
            </template>
          </v-list>
        </v-card>
      </div>

      <div
        v-for="resource in resources"
        :key="resource._id"
        class="resource"
      >
        <resource-card
          v-bind="resource"
          :data-id="resource._id"
          @click="clickProperty({_id: resource._id})"
          @change="e => incrementChange(resource._id, e)"
        />
      </div>

      <div
        v-if="spellSlots.length"
        class="spell-slots"
      >
        <v-card>
          <v-list>
            <v-subheader>Spell Slots</v-subheader>
            <spell-slot-list-tile
              v-for="spellSlot in spellSlots"
              :key="spellSlot._id"
              v-bind="spellSlot"
              :data-id="spellSlot._id"
              @click="clickProperty({_id: spellSlot._id})"
              @change="e => incrementChange(spellSlot._id, e)"
            />
          </v-list>
        </v-card>
      </div>

      <div class="saving-throws">
        <v-card>
          <v-list>
            <v-subheader>Saving Throws</v-subheader>
            <skill-list-tile
              v-for="save in savingThrows"
              :key="save._id"
              :model="save"
              :data-id="save._id"
              @click="clickProperty({_id: save._id})"
            />
          </v-list>
        </v-card>
      </div>

      <div class="skills">
        <v-card>
          <v-list>
            <v-subheader>Skills</v-subheader>
            <skill-list-tile
              v-for="skill in skills"
              :key="skill._id"
              :model="skill"
              :data-id="skill._id"
              @click="clickProperty({_id: skill._id})"
            />
          </v-list>
        </v-card>
      </div>

      <div
        v-if="weapons.length || tools.length || languages.length"
        class="proficiencies"
      >
        <v-card>
          <v-list>
            <v-subheader v-if="weapons.length">
              Weapons
            </v-subheader>
            <skill-list-tile
              v-for="weapon in weapons"
              :key="weapon._id"
              hide-modifier
              :model="weapon"
              :data-id="weapon._id"
              @click="clickProperty({_id: weapon._id})"
            />
            <v-subheader v-if="tools.length">
              Tools
            </v-subheader>
            <skill-list-tile
              v-for="tool in tools"
              :key="tool._id"
              hide-modifier
              :model="tool"
              :data-id="tool._id"
              @click="clickProperty({_id: tool._id})"
            />
            <v-subheader v-if="languages.length">
              Languages
            </v-subheader>
            <skill-list-tile
              v-for="language in languages"
              :key="language._id"
              hide-modifier
              :model="language"
              :data-id="language._id"
              @click="clickProperty({_id: language._id})"
            />
          </v-list>
        </v-card>
      </div>

      <div
        v-if="actions.length"
        class="actions"
      >
        <v-card>
          <v-list
            two-line
            subheader
          >
            <v-subheader>Actions</v-subheader>
            <action-list-tile
              v-for="action in actions"
              :key="action._id"
              :model="action"
              :data-id="action._id"
              @click="clickProperty({_id: action._id})"
            />
            <v-subheader>Attacks</v-subheader>
            <attack-list-tile
              v-for="attack in attacks"
              :key="attack._id"
              :model="attack"
              :data-id="attack._id"
              @click="clickProperty({_id: attack._id})"
            />
          </v-list>
        </v-card>
      </div>
    </column-layout>
  </div>
</template>

<script>
	import CreatureProperties, { damageProperty } from '/imports/api/creature/CreatureProperties.js';
	import AttributeCard from '/imports/ui/properties/components/attributes/AttributeCard.vue';
	import AbilityListTile from '/imports/ui/properties/components/attributes/AbilityListTile.vue';
	import ColumnLayout from '/imports/ui/components/ColumnLayout.vue';
	import HealthBarCardContainer from '/imports/ui/properties/components/attributes/HealthBarCardContainer.vue';
	import HitDiceListTile from '/imports/ui/properties/components/attributes/HitDiceListTile.vue';
	import SkillListTile from '/imports/ui/properties/components/skills/SkillListTile.vue';
	import ResourceCard from '/imports/ui/properties/components/attributes/ResourceCard.vue';
	import SpellSlotListTile from '/imports/ui/properties/components/attributes/SpellSlotListTile.vue';
  import ActionListTile from '/imports/ui/properties/components/actions/ActionListTile.vue';
  import AttackListTile from '/imports/ui/properties/components/actions/AttackListTile.vue';

  const getProperties = function(creatureId, filter = {}){
    filter['ancestors.id'] = creatureId;
    filter.removed = {$ne: true};
    return CreatureProperties.find(filter, {
			sort: {order: 1}
		});
  };

	const getAttributeOfType = function(creatureId, type){
    return getProperties(creatureId, {
      type: 'attribute',
      attributeType: type,
    });
	};

  const getSkillOfType = function(creatureId, type){
    return getProperties(creatureId, {
      type: 'skill',
      skillType: type,
    });
  }

	export default {
		components: {
			AbilityListTile,
			AttributeCard,
			ColumnLayout,
			HealthBarCardContainer,
			HitDiceListTile,
			SkillListTile,
			ResourceCard,
			SpellSlotListTile,
      ActionListTile,
      AttackListTile,
		},
		props: {
			creatureId: {
        type: String,
        required: true,
      },
		},
		meteor: {
			abilities(){
				return getAttributeOfType(this.creatureId, 'ability');
			},
			stats(){
				return getAttributeOfType(this.creatureId, 'stat');
			},
			modifiers(){
				return getAttributeOfType(this.creatureId, 'modifier');
			},
			resources(){
				return getAttributeOfType(this.creatureId, 'resource');
			},
			spellSlots(){
				return getAttributeOfType(this.creatureId, 'spellSlot');
			},
			hitDice(){
        return getAttributeOfType(this.creatureId, 'hitDice');
			},
			checks(){
        return getSkillOfType(this.creatureId, 'check');
			},
			savingThrows(){
        return getSkillOfType(this.creatureId, 'save');
			},
			skills(){
        return getSkillOfType(this.creatureId, 'skill');
			},
      tools(){
        return getSkillOfType(this.creatureId, 'tool');
			},
      weapons(){
        return getSkillOfType(this.creatureId, 'weapon');
			},
      languages(){
        return getSkillOfType(this.creatureId, 'language');
			},
      actions(){
        return getProperties(this.creatureId, {type: 'action'});
			},
      attacks(){
        return getProperties(this.creatureId, {type: 'attack'});
			},
		},
		methods: {
			clickProperty({_id}){
				this.$store.commit('pushDialogStack', {
					component: 'creature-property-dialog',
					elementId: `${_id}`,
					data: {_id},
				});
			},
			incrementChange(_id, {type, value}){
				if (type === 'increment'){
					damageProperty.call({_id, operation: 'increment' ,value: -value});
				}
			},
		},
	};
</script>

<style lang="css" scoped>
</style>
