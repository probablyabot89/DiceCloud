<template lang="html">
  <div class="effect-form">
    <text-field
      label="Name"
      :value="model.name"
      :error-messages="errors.name"
      :debounce-time="debounceTime"
      @change="(value, ack) => $emit('change', {path: ['name'], value, ack})"
    />
    <div class="layout row wrap justify-start">
      <smart-select
        label="Operation"
        append-icon="arrow_drop_down"
        class="mx-2"
        :error-messages="errors.operation"
        :menu-props="{transition: 'slide-y-transition', lazy: true}"
        :items="operations"
        :value="model.operation"
        @change="(value, ack) => $emit('change', {path: ['operation'], value, ack})"
      >
        <v-icon
          slot="prepend"
          class="icon"
          :class="iconClass"
        >
          {{ displayedIcon }}
        </v-icon>
        <template
          slot="item"
          slot-scope="item"
        >
          <v-icon
            class="icon mr-2"
          >
            {{ getEffectIcon(item.item.value, 1) }}
          </v-icon>
          {{ item.item.text }}
        </template>
      </smart-select>

      <text-field
        label="Value"
        class="mr-2"
        :persistent-hint="needsValue"
        :value="needsValue ? (model.calculation) : ' '"
        :disabled="!needsValue"
        :error-messages="errors.calculation"
        :hint="!isFinite(model.calculation) && model.result ? model.result + '' : '' "
        :debounce-time="debounceTime"
        @change="(value, ack) => $emit('change', {path: ['calculation'], value, ack})"
      />

      <smart-combobox
        label="Stat"
        class="mr-2"
        multiple
        :value="model.stats"
        :items="attributeList"
        :error-messages="errors.stats"
        :debounce-time="debounceTime"
        @change="(value, ack) => $emit('change', {path: ['stats'], value, ack})"
      />
    </div>
  </div>
</template>

<script>
	import getEffectIcon from '/imports/ui/utility/getEffectIcon.js';
  import attributeListMixin from '/imports/ui/properties/forms/shared/lists/attributeListMixin.js';

	const ICON_SPIN_DURATION = 300;
	export default {
    mixins: [attributeListMixin],
		props: {
			model: {
				type: Object,
				default: () => ({}),
			},
			errors: {
				type: Object,
				default: () => ({}),
			},
      debounceTime: {
        type: Number,
        default: undefined,
      },
		},
		data(){ return {
			displayedIcon: 'add',
			iconClass: '',
			operations: [
				{value: 'base', text: 'Base Value'},
				{value: 'add', text: 'Add'},
				{value: 'mul', text: 'Multiply'},
				{value: 'min', text: 'Minimum'},
				{value: 'max', text: 'Maximum'},
				{value: 'advantage', text: 'Advantage'},
				{value: 'disadvantage', text: 'Disadvantage'},
				{value: 'passiveAdd', text: 'Passive Bonus'},
				{value: 'fail', text: 'Fail'},
				{value: 'conditional', text: 'Conditional Benefit'},
			],
		}},
		computed: {
			needsValue(){
				switch(this.model.operation) {
					case 'base': return true;
					case 'add': return true;
					case 'mul': return true;
					case 'min': return true;
					case 'max': return true;
					case 'advantage': return false;
					case 'disadvantage': return false;
					case 'passiveAdd': return true;
					case 'fail': return false;
					case 'conditional': return true;
          default: return true;
				}
			},
		},
		watch: {
			'model.operation': {
				immediate: true,
				handler(newValue, oldValue){
					let newIcon = getEffectIcon(newValue, 1);
					if (!oldValue){
						// Skip animation
						this.displayedIcon = newIcon;
					} else {
						this.iconClass='leaving';
						setTimeout(() => {
							this.displayedIcon = newIcon;
							this.iconClass='arriving';
							requestAnimationFrame(() => {
								this.iconClass='';
							});
						}, ICON_SPIN_DURATION / 2);
					}
				},
			},
		},
		methods: {
			getEffectIcon,
      log: console.log,
		}
	};
</script>

<style lang="css" scoped>
	.theme--light .icon {
		color: black;
	}
	.icon {
		min-width: 30px;
		transition: transform 0.15s linear, opacity 0.15s ease;
		transform-origin: 18px center;
		margin-left: -12px;
	}
	.icon.leaving {
		transform: translateY(-24px);
		opacity: 0;
	}
	.icon.arriving {
		transform: translateY(24px);
		opacity: 0;
		transition: none;
	}
	.hidden {
		visibility: hidden;
	}
	.effect-form > div {
		flex-basis: 220px;
	}
</style>
