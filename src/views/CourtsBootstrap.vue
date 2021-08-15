<template>
  <div class="d-flex flex-row justify-center mb-6">
    <CourtCarousel
      class="pa-2"
      :slides="slides1"
      title="WPT Court"
      :description="description1"
      :subtitle="subtitle1"
    />
    <CourtCarousel
      class="pa-2"
      :slides="slides2"
      title="Panoramic Court"
      :description="description2"
      :subtitle="subtitle2"
    />
  </div>
</template>
<script>
import CourtCarousel from "../components/CourtCarousel.vue";
export default {
  components: { CourtCarousel },
  data: () => ({
    slides1: [
      "https://i-events.net/wp-content/uploads/2021/04/DSC_0029-4-scaled.jpg",
      "https://www.midotradingco.com/wp-content/uploads/2021/03/main-min-3.jpg",
      "http://www.kiteelgouna.cz/wp-content/uploads/2021/01/Tenis.jpg"
    ],
    subtitle1: " 100×50 in panoramical areas Electrowelded mesh 50x50x4mm.",
    description1:
      "Structure Panoramical sides and bottom in 3 mts. glass . Corner tubeless. Tube 100×50 in panoramical areas Electrowelded mesh 50x50x4mm. Inti-injury system Tempered Glass de 12 mm. Artificial grass MondoTurf Supercourt WPT Official Turf. Curved lighting Especial World Padel Tour. Led lighting 8 * 180w by LedProject Stove-finished painting, Official WPT colour.",

    slides2: [
      "https://www.midotradingco.com/wp-content/uploads/2021/03/AAA00375-min.jpg",
      "http://www.kiteelgouna.cz/wp-content/uploads/2021/01/Tenis.jpg",
      "https://www.kiteelgouna.com/wp-content/uploads/2018/10/XXX05090.jpg"
    ],
    subtitle2: " 100×100 in panoramical areas Electrowelded mesh 50x50x4mm.",
    description2:
      "Structure Panoramical sides and bottom in 3 mts. glass .Corner pillarless. (Thin tube) Tube 100×100 in panoramical areas Electrowelded mesh 50x50x4mm. Inti-injury system Tempered Glass de 12 mm. Artificial grass MondoTurf Supercourt WPT Official Turf Straight lighting system or Galis kind. Led lighting Stove-finished painting the client chooses the colour."
  })
};
</script>
