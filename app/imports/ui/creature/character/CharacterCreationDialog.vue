<template>
  <dialog-base>
    <template slot="toolbar">New Character</template>
    <v-stepper v-model="step" class="no-shadow">
      <v-stepper-header class="no-shadow">
        <v-stepper-step :complete="step > 1" step="1">
					Name
				</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">
          Ability Scores
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 3" step="3">
          Class
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-text-field label="Name" v-model="name"></v-text-field>
					<v-text-field label="Gender" v-model="gender"></v-text-field>
					<v-text-field label="Alignment" v-model="alignment" @keydown.tab="step++"></v-text-field>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-text-field label="Race" v-model="race"></v-text-field>
					<v-layout row justify-center align-center>
						<h3>Point Cost:</h3>
						<h1 class="ml-2" :class="cost > 27 ? 'error--text' : ''">{{cost}}</h1>
						<span class="ml-1">/27</span>
					</v-layout>
					<table class="point-buy-table mt-2">
						<thead>
							<tr class="font-weight-bold">
								<td></td>
								<td>Base Values</td>
								<td>Race Bonus</td>
								<td>Score</td>
								<td>Modifier</td>
							</tr>
						</thead>
						<tr>
							<td>Strength</td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="baseStrength"
								min="8"
								max="15">
							</v-text-field></td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="strengthBonus">
							</v-text-field></td>
							<td>{{baseStrength + strengthBonus}}</td>
							<td>{{mod(baseStrength + strengthBonus)}}</td>
						</tr>
						<tr>
							<td>Dexterity</td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="baseDexterity"
								min="8"
								max="15">
							</v-text-field></td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="dexterityBonus">
							</v-text-field></td>
							<td>{{baseDexterity + dexterityBonus}}</td>
							<td>{{mod(baseDexterity + dexterityBonus)}}</td>
						</tr>
						<tr>
							<td>Constitution</td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="baseConstitution"
								min="8"
								max="15">
							</v-text-field></td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="constitutionBonus">
							</v-text-field></td>
							<td>{{baseConstitution + constitutionBonus}}</td>
							<td>{{mod(baseConstitution + constitutionBonus)}}</td>
						</tr>
						<tr>
							<td>Intelligence</td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="baseIntelligence"
								min="8"
								max="15">
							</v-text-field></td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="intelligenceBonus">
							</v-text-field></td>
							<td>{{baseIntelligence + intelligenceBonus}}</td>
							<td>{{mod(baseIntelligence + intelligenceBonus)}}</td>
						</tr>
						<tr>
							<td>Wisdom</td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="baseWisdom"
								min="8"
								max="15">
							</v-text-field></td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="wisdomBonus">
							</v-text-field></td>
							<td>{{baseWisdom + wisdomBonus}}</td>
							<td>{{mod(baseWisdom + wisdomBonus)}}</td>
						</tr>
						<tr>
							<td>Charisma</td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="baseCharisma"
								min="8"
								max="15">
							</v-text-field></td>
							<td><v-text-field
								type="number"
								height="20"
								reverse
								v-model.number="charismaBonus">
							</v-text-field></td>
							<td>{{baseCharisma + charismaBonus}}</td>
							<td>{{mod(baseCharisma + charismaBonus)}}</td>
						</tr>
					</table>
        </v-stepper-content>
        <v-stepper-content step="3">
          <v-text-field
          	label="Class"
						v-model="cls"
          >
          </v-text-field>
					<v-select
						:items="hitDiceItems"
						label="Hit Dice"
						v-model="hitDice">
					</v-select>
					</v-text-field>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
    <template slot="actions">
      <v-btn flat @click="$emit('pop')">Cancel</v-btn>
			<v-btn flat @click="step--" v-if="step > 1">Back</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="accent" @click="step++" v-if="step < 3">Next</v-btn>
      <v-btn
				:flat="step < 3"
				:color="step < 3? '' : 'accent'"
				@click="submit">
				Create
			</v-btn>
    </template>
  </dialog-base>
</template>

<script>
  import DialogBase from "/imports/ui/dialogStack/DialogBase.vue";
	const getCost = function(score){
		const costs = {
			8: 0,
			9: 1,
			10: 2,
			11: 3,
			12: 4,
			13: 5,
			14: 7,
			15: 9,
		};
		if (costs[score] || costs[score] === 0){
			return costs[score];
		} else {
			return NaN;
		}
	};
  export default {
    data(){return {
      step: 1,
			name: "New Character",
			gender: "",
			alignment: "",
			race: "Race",
			baseStrength: 10,
			baseDexterity: 10,
			baseConstitution: 10,
			baseIntelligence: 10,
			baseWisdom: 10,
			baseCharisma: 10,
			strengthBonus: 0,
			dexterityBonus: 0,
			constitutionBonus: 0,
			intelligenceBonus: 0,
			wisdomBonus: 0,
			charismaBonus: 0,
			hitDiceItems: ["d6", "d8", "d10", "d12"],
			hitDice: "d8",
			cls: "Class",
    }},
		methods: {
			mod(score){
				let mod = Math.floor((score - 10) / 2);
				if (mod >= 0) {
					return `+${mod}`;
				} else {
					return `${mod}`;
				}
			},
			submit(){
				let char = {
					name: this.name,
					gender: this.gender,
					alignment: this.alignment,
					race: this.race,
					baseStrength: this.baseStrength,
					baseDexterity: this.baseDexterity,
					baseConstitution: this.baseConstitution,
					baseIntelligence: this.baseIntelligence,
					baseWisdom: this.baseWisdom,
					baseCharisma: this.baseCharisma,
					strengthBonus: this.strengthBonus,
					dexterityBonus: this.dexterityBonus,
					constitutionBonus: this.constitutionBonus,
					intelligenceBonus: this.intelligenceBonus,
					wisdomBonus: this.wisdomBonus,
					charismaBonus: this.charismaBonus,
					hitDice: this.hitDice,
					cls: this.cls,
				};
				this.$emit("pop", char);
			},
		},
		computed: {
			cost(){
				return [
					this.baseStrength,
					this.baseDexterity,
					this.baseConstitution,
					this.baseIntelligence,
					this.baseWisdom,
					this.baseCharisma,
				].map(getCost)
				.reduce((memo, score) => memo + score, 0);
			},
		},
    components: {
      DialogBase,
    },
  };
</script>

<style scoped>
	.no-shadow {
		box-shadow: none;
	}
	.point-buy-table {
		width: 100%;
	}
	.point-buy-table td {
		text-align: center;
		padding: 0 8px 0 8px;
		max-width: 50px;
	}
</style>
