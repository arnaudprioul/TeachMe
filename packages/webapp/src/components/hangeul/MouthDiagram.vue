<script setup lang="ts">
import type { ArticulationPlace } from '~/composables/useHangeul'

import bilabial from '~/assets/images/articulation/bilabial.svg'
import alveolar from '~/assets/images/articulation/alveolar.svg'
import alveolarLateral from '~/assets/images/articulation/alveolar_lateral.svg'
import alveolarFricative from '~/assets/images/articulation/alveolar-fricative.svg'
import palatal from '~/assets/images/articulation/palatal.svg'
import velar from '~/assets/images/articulation/velar.svg'
import glottal from '~/assets/images/articulation/glottal.svg'
import glottalFricative from '~/assets/images/articulation/glottal-fricative.svg'

const props = defineProps<{ place: ArticulationPlace }>()

const imageMap: Partial<Record<ArticulationPlace, string>> = {
  'bilabial': bilabial,
  'alveolar': alveolar,
  'alveolar-lateral': alveolarLateral,
  'alveolar-fricative': alveolarFricative,
  'palatal': palatal,
  'velar': velar,
  'glottal': glottal,
  'glottal-fricative': glottalFricative,
}

const imageSrc = computed(() => imageMap[props.place])
</script>

<template>
  <div class="mouth" v-if="imageSrc">
    <img :src="imageSrc" :alt="`Mouth position: ${place}`" class="mouth__img" />
  </div>
</template>

<style scoped>
.mouth {
  display: flex;
  justify-content: center;
  padding: var(--space-3);
}

.mouth__img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: var(--radius-lg);
}
</style>
