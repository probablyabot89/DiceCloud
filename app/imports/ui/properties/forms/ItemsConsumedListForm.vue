<template lang="html">
  <div class="mt-4">
    <v-slide-x-transition group>
      <div
        v-for="(item, i) in model"
        :key="item._id || i"
      >
        <div class="layout row align-center">
          <div style="flex-grow: 1;">
            <item-consumed-form
              :model="item"
              @change="({path, value, ack}) => $emit('change', {path: [i, ...path], value, ack})"
            />
          </div>
          <v-btn
            outline
            icon
            large
            class="ma-3"
            @click="$emit('pull', {path: [i]})"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </div>
      </div>
    </v-slide-x-transition>
  </div>
</template>

<script>
	import ItemConsumedForm from '/imports/ui/properties/forms/ItemConsumedForm.vue';

	export default {
		components: {
			ItemConsumedForm,
		},
		props: {
			model: {
				type: Array,
				default: () => ([]),
			},
      debounceTime: {
        type: Number,
        default: undefined,
      },
		},
	}
</script>
