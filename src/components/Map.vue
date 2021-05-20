<template>
  <div style="width: 100%; height: 100%;">
    <b-container>
      <b-row>
        <b-col>
          <b-row class="my-1" v-for="light in roads" :key="light.name">
            <b-col sm="3">
              <label :for="`type-${light.name}`">
                <p v-bind:class="{'font-weight-bold': light.yourTurn,  'font-weight-normal': !light.yourTurn}"> Traffic
                  light: <code>{{ light.name }}</code> : <code>{{light.ratio}}</code></p></label>
            </b-col>
            <b-col sm="5">
              <b-form-input :disabled="Traffic" :id="`type-${light.name}`" type='range' v-model="light.ratio" min="0"
                            max="1" step="0.01"></b-form-input>
            </b-col>
            <b-col>
              <i>Traffic ratio </i>: {{light.Showratio}}
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" md="auto">
          <p class="font-weight-bold"><i>Projet Internet des objets 2020-2021</i></p>
          <div class="font-weight-bold">Medric Sonwa Sergio Giardina</div>
          <div class="text-secondary">Anir El kabiri</div>
          <b-form-checkbox v-model="Traffic" name="check-button" v-on:change="SendApiValue()" size="lg" switch>

            <p class="font-weight-bold" v-bind:class="{'text-primary': Traffic,  '': !Traffic}"> Traffic API </p>
          </b-form-checkbox>
          <b-row class="pb-4">
            <b-button v-bind:class="{'disabled': Traffic,  '': !Traffic}" class="font-italic" variant="primary"
                      v-on:click="SendCustomerValue()">Set these values
            </b-button>
          </b-row>
          <!--    <b-row class="pt-5"><p class="font-weight-bold" > Crossroads :  </p>
            <div class="btn btn-outline-light" type="button"  > v-on:click="ChangeCrossroads(selected)"
              <b-form-radio-group
                id="btn-radios-2"
                v-model="selected"
                :options="['1','2','3']"
                button-variant="outline-primary"
                size="lg"
                name="radio-btn-outline"
                buttons
              ></b-form-radio-group></div></b-row>-->
        </b-col>
      </b-row>
    </b-container>
    <div style="width: 100%; height: 100%;">

      <img v-for="point in roads" :key="'('+point.lon+','+point.lat+')'" id="traffic-light"
           :src="trafficLightIcon(point)" alt="" :style="'top:'+(point.x)+'px;left:'+(point.y-10)+'px;'">

      <div id="map" style="width: 100%; height: 100%;"></div>
    </div>
  </div>
</template>
<script>
import tt from '@tomtom-international/web-sdk-maps';
import axios from 'axios'

let KEY_1 = 'vmwR30PRARcr0c5cPGWpJHW3HqCZg1Aa'
let KEY_2 = '3IJDAr49O2MsTWAWHhYkG7am1jVsoju7'


let API_KEY = KEY_2

let colors = {
  RED: 0,
  GREEN: 1,
  YELLOW: 2
}

let trafficFlowConfig = {
  key: API_KEY,
  theme: {
    style: 'relative-delay',
    source: 'vector'
  },
  refresh: 1000
}


export default {
  name: 'Map',
  props: {},
  data: function () {
    return {
      roads: [],
      info: {},
      cache: false,
      points: [],
      Traffic: true

    }
  },
  methods: {
    initPoints: function (crossroad) {
      console.log(crossroad)
      this.roads = crossroad.roads.map((point) => {
        return {
          lon: point.lon,
          lat: point.lat,
          color: colors.RED,
          name: point.name,
          ratio: 0,
          yourTurn: false
        }
      })
      this.info = {
        turn: 0, // turn of GREEN/RED
        lon: crossroad.info.lon, // Lon of center of crossroads
        lat: crossroad.info.lat,
        roads: crossroad.info.roads,
        timeApi: crossroad.info.Time_for_API,
        timeWorst: crossroad.info.Time_for_worst
      }
      /*
      //console.log(this.crossroad)
      //console.log(this.roads)
      //this.roads[this.info.turn].color= colors.GREEN
      // Start
      console.log("API TRAFFIC")
      this.roads[0].ratio = 1  //  simulation for all roads with
      this.roads[1].ratio = 0.8    // " Math.floor(Math.random() * (max - min)) + min "  (max = 1 , min = 0)
      this.roads[2].ratio = 0.9  // For simulation we may request these data to the client with input form 
      this.roads[3].ratio = 0.70 // we may show these data for improving the comprehension of the traffic light algorithm
      this.roads[4].ratio = 0.55 // if this.roads[4].ratio is set 0.35 -> TRUE "CHANGING TO THE WORST"
     //*/
    },
    trafficLightIcon: function (point) {
      if (point.color === colors.GREEN)
        return 'img/green.png'
      else if (point.color == colors.RED)
        return 'img/red.png'
      else
        return 'img/yellow.png'

    },
    /* GetData: function(){
       setInterval(()=>{  axios.get('http://localhost:3000/last-data').then((response) => {
            if (response.status === 200 && response.data != null) {
               this.ChangeStates(response.data.info.turn)
               this.InitRatio(response.data)
             }
             })

         },5000)
     },*/
    InitRatio: function (crossroad) {
      if (crossroad.roads[0].ratio != undefined) {
        let ratioArray = crossroad.roads.map(p => p.ratio)
        for (let i = 0; i < this.roads.length; i++)
          this.roads[i].Showratio = ratioArray[i] + this.ReturnRatio(ratioArray[i])
      }
    },
    ReturnRatio: function (ratio) {
      if (ratio > 0.85)
        return "(Low Traffic)"
      if (ratio <= 0.85 && ratio > 0.6)
        return "(Med Traffic)"
      if (ratio <= 0.6 && ratio > 0.4)
        return "(High Traffic)"
      if (ratio <= 0.4 && ratio >= 0)
        return "(Hard Traffic)"


    },
    SendCustomerValue: function () {
      console.log("SEND")
      this.roads.forEach((r) => {
            r.Showratio = r.ratio + this.ReturnRatio(r.ratio)
          }
      )
      fetch('http://localhost:3000/crossroads/customer/values', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ratio: this.roads.map(point => point.ratio)
        })
      });
    },
    SendApiValue: function () {
      if (this.Traffic) {
        console.log("NOT-SEND")
        fetch('http://localhost:3000/crossroads/api/values', {
          method: 'POST'
        });
      }
    },
    ChangeCrossroads: function (id) {
      console.log("CHANGECROSS")
      let numero = id - 1

      axios.get('http://localhost:3000/crossroads/' + numero).then((response) => {
        if (response.status == 200) {
          console.log(response.data)
          this.center = response.data.info.center
          this.initPoints(response.data)
          this.initPointPositions(this)
          this.selected = id
        }
      })
    },
    ChangeStates: function (newTurn) {
      this.roads[this.info.turn].color = colors.YELLOW
      setTimeout(() => {
        this.roads[this.info.turn].color = colors.RED
        this.roads[this.info.turn].yourTurn = false
      }, 500);

      setTimeout(() => {
        this.roads[newTurn].color = colors.GREEN
        this.roads[newTurn].yourTurn = true
        this.info.turn = newTurn
      }, 1000);
    },
    initPointPositions: function (map) {
      let x
      this.roads.forEach((point) => {
        let mapPoint = map.project(new tt.LngLat(point.lon, point.lat))
        if (this.roads.length <= 5)
          x = 188
        else
          x = 263 + (this.roads.length - 5) * 51
        point.x = mapPoint.y + x
        point.y = mapPoint.x
      })
    },
  },
  computed: {},
  mounted() {
    let map;

    axios.get('http://localhost:3000/crossroads/0').then((response) => {
      if (response.status === 200) {
        console.log(response.data)
        map = tt.map({
          key: API_KEY,
          container: 'map',
          center: response.data.info.center,
          zoom: 18,
          dragPan: true,
          theme: {
            style: 'main',
            layer: 'basic',
            source: 'vector'
          }
        });
        this.selected = 3
        this.initPoints(response.data)
        this.initPointPositions(map)
        map.dragPan.disable()
        map.scrollZoom.disable()
        map.dragRotate.disable()
        map.on('load', () => {
          map.addTier(new tt.TrafficFlowTilesTier(trafficFlowConfig))
        })
        map.on('resize', () => {
          this.initPointPositions(map)
        })
        setInterval(() => {
          axios.get('http://localhost:3000/last-data').then((response) => {
            if (response.status === 200 && response.data != null) {
              console.log("GETTT")
              if (response.data.turn != undefined) {
                if (response.data.turn != this.info.turn)
                  this.ChangeStates(response.data.turn)
              } else
                this.ChangeStates(0)
              this.InitRatio(response.data)
            }
          })

        }, 5000)
        /*
        setInterval(() => {
          axios.get('http://localhost:3000/last-data').then((response) => {
            if (response.status === 200 && response.data != null) {
              let crossroad = response.data
              this.points = crossroad.roads.map((road) => {
                let point = JSON.parse(JSON.stringify(road))
                point.x = 0
                point.y = 0
                return point
               // this.ChangeStates(response.data.info.turn)

            }})
             // this.initPointPositions(map)
          
        }, 5000)*/

      }
    })
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#traffic-light {
  height: 20px;
  width: 20px;
  z-index: 1000;
  position: absolute;
}
</style>
