<template>
  <div id="map" style="width: 100%; height: 100%;"></div>
</template>
<script>
import tt from '@tomtom-international/web-sdk-maps';
import '../assets/css/main.css';

//let GRENOBLE = [5.7246091, 45.1889547]
//let PARIS = [2.3488, 48.85341]
let BOGOTA = [-74.075833, 4.598056]

let trafficFlowConfig = {
  key: 'CB6VIoOo9ZMZiG80Hbev3jhVhWTqGaNc',
  theme: {
    style: 'absolute',
    source: 'vector'
  },
  refresh: 1000
}
let nome = new tt.TrafficFlowTilesTier(trafficFlowConfig)
console.log(nome)


export default {
  name: 'Map',
  props: {},
  mounted() {
    let map = tt.map({
      key: 'CB6VIoOo9ZMZiG80Hbev3jhVhWTqGaNc',
      container: 'map',
      center: BOGOTA,
      zoom: 16,
      dragPan: true,
      theme: {
        style: 'night',
        layer: 'hybrid',
        source: 'vector'
      }
    });
    map.addControl(new tt.NavigationControl())
    map.addControl(new tt.FullscreenControl())

    map.on('load', function () {
      map.addTier(new tt.TrafficFlowTilesTier(trafficFlowConfig))
    })
    var element = document.createElement('div');
    element.id = 'marker';
    element.style.position = 'fixed';

    let marker = new tt.Marker({element: element, anchor: "left"}).setLngLat(BOGOTA).addTo(map);


    let popupOffsets = {
      top: [0, 0],
      bottom: [0, -70],
      'bottom-right': [0, -70],
      'bottom-left': [0, -70],
      left: [25, -35],
      right: [-25, -35]
    }
    let popup = new tt.Popup({offset: popupOffsets}).setHTML("<b>Semaphore 1 </b>");
    marker.setPopup(popup).togglePopup();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
