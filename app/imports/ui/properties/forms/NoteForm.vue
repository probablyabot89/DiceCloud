<template lang="html">
  <div class="feature-form">
    <text-field
      label="Name"
      :value="model.name"
      :error-messages="errors.name"
      :debounce-time="debounceTime"
      @change="(value, ack) => $emit('change', {path: ['name'], value, ack})"
    />
    <text-area
      label="Description"
      :value="model.description"
      :error-messages="errors.description"
      :debounce-time="debounceTime"
      @change="(value, ack) => $emit('change', {path: ['description'], value, ack})"
    />
  </div>
</template>

<script>
	export default {
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
	};
</script>

<style lang="css" scoped>
</style>
