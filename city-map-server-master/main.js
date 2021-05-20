const config = require('./config')
const utils = require('./utils.js')
const axios = require('axios')
const api = require('./routes')


let colors = {
    RED: 0,
    GREEN: 1,
    YELLOW: 2
}
TIME = true
CROSSROAD = {}
local_ratio = []

function _updateLight(crossroad) {
    // Simple algo for time of lights
    let newTurn = (crossroad.info.turn + 1) % crossroad.info.roads
    console.log("Old turn: " + crossroad.roads[crossroad.info.turn].name + " " + crossroad.roads[crossroad.info.turn].ratio)
    console.log("New turn. " + crossroad.roads[newTurn].name + " " + crossroad.roads[newTurn].ratio)
    //console.log("Turn ratio = " + roads[info.turn].ratio)
    // console.log("Turn ratio next = " + roads[newTurn].ratio)
    let numTurn = getNumberTurn(crossroad.roads[crossroad.info.turn].ratio, crossroad.roads[newTurn].ratio)
    console.log(numTurn)
    let worstTurn = -1
    if (!crossroad.cache && !TIME) {
        console.log("Calculate : " + worstTurn)
        worstTurn = FindWorstRatio(crossroad.roads)
        cache = true
        TIME = true
    }

    //console.log(worstTurn)
    //console.log("Worst turn =" +worstTurn + " turn = " + info.turn)
    if (worstTurn > 0 && crossroad.info.turn !== worstTurn) // CHANGING TO THE WORST
    {
        crossroad.roads[crossroad.info.turn].turn = 0
        console.log("CHANGE TURN worst")
        changeTurn(crossroad, worstTurn)
    } else if ((crossroad.roads[crossroad.info.turn].ratio >= crossroad.roads[newTurn].ratio && getHarmonicAverage(crossroad.roads) < crossroad.roads[crossroad.info.turn].ratio) || crossroad.roads[crossroad.info.turn].turn >= numTurn || crossroad.roads[crossroad.info.turn].ratio === 0) {
        if (crossroad.roads[crossroad.info.turn].ratio >= crossroad.roads[newTurn].ratio && (getHarmonicAverage(crossroad.roads) + config.RANGE_RATIO) <= crossroad.roads[newTurn].ratio && crossroad.roads[newTurn].skipTurn < 2) {
            console.log("SKIP TURN")
            crossroad.roads[newTurn].skipTurn += 1
            newTurn = (newTurn + 1) % crossroad.info.roads
        }
        crossroad.roads[crossroad.info.turn].turn = 0
        crossroad.roads[newTurn].skipTurn = 0
        changeTurn(crossroad, newTurn)
    } else {
        console.log("NOT CHANGE TURN")
        crossroad.roads[crossroad.info.turn].turn = crossroad.roads[crossroad.info.turn].turn + 1
    }
    _saveState(crossroad)
}

function _saveState(crossroad) {
    /* if(!api.CustomerRatio[0])
    { */
    console.log(CROSSROAD)
    obj = {
        roads: crossroad.roads.map((point) => {
            return {
                lon: point.lon,
                lat: point.lat,
                color: point.color,
                name: point.name,
                ratio: point.ratio
            }
        }),
        turn: crossroad.info.turn
    }
    api.data.push(obj)
    //console.log(api.data)
    if (api.data.length != 1)
        api.data.splice(0, 1)
    // console.log(api.data.length)
    //  console.log(api.data[0].roads)
}

/*  else
  {
      obj = {
          roads : crossroad.roads.map((point) => {
              return {
                lon: point.lon,
                lat: point.lat,
                color: point.color,
                name : point.name,
                ratio : 0
              }
            }),
            turn : crossroad.info.turn
      }
      for( let i=0; i<local_ratio.length ;i++)
      {  obj.roads[i].ratio = local_ratio[i]}
      api.data.push(obj)
      //console.log(api.data)
      if(api.data.length!=1)
      api.data.splice(0,1)
     // console.log(api.data.length)
      //console.log(api.data[0].roads)

  }
}*/
function changeTurn(crossroad, newTurn) {
    console.log("CHANGE TURN")
    crossroad.roads[crossroad.info.turn].color = colors.RED
    crossroad.roads[crossroad.info.turn].yourTurn = false
    crossroad.roads[newTurn].color = colors.GREEN
    crossroad.roads[newTurn].yourTurn = true
    crossroad.info.turn = newTurn


}

function getNumberTurn(ratio, next) {
    if (ratio > config.MEDIUM_RATIO * config.MAX_RATIO)
        return 1  // it can be used a constant ( both number of turns (1,2..) , threshold of traffic ( 0.6..))
    if (ratio < config.MEDIUM_RATIO * config.MAX_RATIO && ratio > config.LOW_RATIO * config.MAX_RATIO && next > 0.7 * config.MAX_RATIO)
        return 2
    if (ratio < config.MEDIUM_RATIO * config.MAX_RATIO && ratio > config.LOW_RATIO * config.MAX_RATIO && next <= 0.55 * config.MAX_RATIO)
        return 1
    if (ratio <= config.LOW_RATIO * config.MAX_RATIO)
        return 3
    return 1

}

function SetCustomerRatio(ratio) {
    api.CustomerRatio.pop()
    api.CustomerRatio.push(true)
    data = api.data.pop()
    for (let i = 0; ratio != undefined && data != undefined && i < ratio.length; i++) {
        console.log("ratio")
        CROSSROAD.roads[i].ratio = ratio[i]
        local_ratio.push(ratio[i])
    }
    if (data != undefined)
        api.data.push(data)
    //console.log(api.data)
    if (api.data.length != 1)
        api.data.splice(0, 1)


}

function SetApiRatio() {
    api.CustomerRatio.pop()
    api.CustomerRatio.push(false)
    getData()
}

function FindWorstRatio(roads) {
    let average = getHarmonicAverage(roads)
    //console.log(average)
    let element = roads.findIndex((p) => {
        if (p.ratio <= average - config.RANGE_RATIO)
            return p
    })
    if (element !== undefined)
        return element
    else
        return -1

}

function getHarmonicAverage(roads) {
    let ratioArray = roads.map(p => p.ratio)
    let i = 0
    let sum = 0
    for (i = 0; i < ratioArray.length; i++)
        sum = sum + 1 / ratioArray[i];
    let average = ratioArray.length / sum;
    average = average.toFixed(2)
    console.log("AVERAGE: " + average)
    return average

}

function changeCrossroads(id_crossroads) {
    id = id_crossroads[0]
    if (config.CROSSROADS[id].info.center[0] == CROSSROAD.info.center[0] &&
        config.CROSSROADS[id].info.center[1] == CROSSROAD.info.center[1])
        return true
    return false
}


function initCrossRoads() {
    console.log(api.id_crossroads)
    CROSSROAD = utils.cloneDeep(config.CROSSROADS[api.id_crossroads])
    CROSSROAD.roads.forEach((road) => {
        road.color = colors.RED
        road.yourTurn = false
        road.ratio = 0
        road.skipTurn = 0
        road.turn = 0

    })
    CROSSROAD.info.turn = 0
    CROSSROAD.cache = false

}

function getData() {
    let change = false
    CROSSROAD.roads.forEach((road) => {
        console.log("GET")
        //console.log(road)
        let event = axios.get('https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=' + config.API_KEY + '&point=' + road.lat + ',' + road.lon).then((response) => {
            console.log(response.status)
            if (response.status === 200) {
                newratio = response.data.flowSegmentData.currentSpeed * 1.0 / response.data.flowSegmentData.freeFlowSpeed
                console.log(newratio)
                newratio = newratio.toFixed(2)
                console.log(newratio)
                if (road.ratio !== newratio) {
                    road.ratio = newratio
                    change = true
                }
            }

        }, reason => {
        })
    })
    return change

}

function _run() {
    initCrossRoads()
    setInterval(() => {
        if (api.id_crossroads != undefined && !api.CustomerRatio[0]) {
            console.log("TRAFFIC API")
            /* CROSSROAD.roads[0].ratio = 1  //  simulation for all roads with
             CROSSROAD.roads[1].ratio = 0.8    // " Math.floor(Math.random() * (max - min)) + min "  (max = 1 , min = 0)
             CROSSROAD.roads[2].ratio = 0.9  // For simulation we may request these data to the client with input form
             CROSSROAD.roads[3].ratio = 0.70 // we may show these data for improving the comprehension of the traffic light algorithm
             CROSSROAD.roads[4].ratio = 0.35 // if this.roads[4].ratio is set 0.35 -> TRUE "CHANGING TO THE WORST"
             */
            if (getData()) {
                CROSSROAD.cache = false
            }
        }


    }, CROSSROAD.info.Time_for_API/*10000*/)

    setInterval(() => {
        if (changeCrossroads(api.id_crossroads))
            _updateLight(CROSSROAD)
        else {
            initCrossRoads()
            api.data.pop()
        }
    }, config.TIME_FOR_UPDATELIGHT)
    setInterval(() => {
        TIME = false
    }, CROSSROAD.info.Time_for_worst)
}


module.exports = {_run, SetApiRatio, SetCustomerRatio}