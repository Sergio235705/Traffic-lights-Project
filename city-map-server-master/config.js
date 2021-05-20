let KEY_1 = 'vmwR30PRARcr0c5cPGWpJHW3HqCZg1Aa'
let KEY_2 = '3IJDAr49O2MsTWAWHhYkG7am1jVsoju7'


let TIME_FOR_UPDATELIGHT = 5000 // 5 seconds for simulation , 25 seconds for real
let CONSTANT_TIME_API = 0.5
let CONSTANT_TIME_WORST = 2
let TIME_FOR_WORST = CONSTANT_TIME_WORST * TIME_FOR_UPDATELIGHT
// time for calculation the most traffic point and give a "precedence" 
// in crossroads this TIME is multiplied by number of roads 
let TIME_FOR_API = CONSTANT_TIME_API * TIME_FOR_UPDATELIGHT
// time for call API Traffic to update data traffic 
// in crossroads this TIME is multiplied by number of roads (for fairness)

let API_KEY = KEY_2

module.exports = {
    CROSSROADS: [
        {
            roads: [{name: 'A', lon: 5.723423877196694, lat: 45.1908607332353},
                {name: 'B', lon: 5.723565104168102, lat: 45.19073039999893},
                {name: 'C', lon: 5.723383644061244, lat: 45.190758658035065}], info: {
                lon: 5.723469616845613, lat: 45.19078014905249,
                roads: 3, center: [5.723469616845613, 45.19078014905249], Time_for_API: TIME_FOR_API * 3,
                Time_for_worst: TIME_FOR_WORST * 3 /*number of roads */
            }
        },

        {
            roads: [{name: 'A', cor: [5.720318946103311, 45.19253553627369]},
                {name: 'B', cor: [5.719950479924982, 45.19234896540596]},
                {name: 'C', cor: [5.720015863537626, 45.1921656816345]},
                {name: 'D', cor: [5.7202958396623504, 45.1920678751779]},
                {name: 'E', cor: [5.720561820632519, 45.19214102457309]},
                {name: 'F', cor: [5.720785816139062, 45.192312801929035]}], info:
                {
                    lon: 5.7204494946543205, lat: 45.19225526881751, roads: 6,
                    center: [5.7204494946543205, 45.19225526881751], Time_for_API: TIME_FOR_API * 6,
                    Time_for_worst: TIME_FOR_WORST * 6
                }
        },

        {
            roads: [{name: 'A', cor: [5.724147228868706, 45.19273719532775]},
                {name: 'B', cor: [5.724074152894234, 45.19267896208866]},
                {name: 'C', cor: [5.724081956589804, 45.19264076259289]},
                {name: 'D', cor: [5.724184071641524, 45.19262944233543]},
                {name: 'E', cor: [5.7242454949126875, 45.19268025703296]}],
            info: {
                lon: 5.72416306, lat: 45.19264952, roads: 5,
                center: [5.72416306, 45.19266452], Time_for_API: TIME_FOR_API * 5,
                Time_for_worst: TIME_FOR_WORST * 5
            }
        }

    ],
    API_KEY: KEY_2,
    COLORS: {
        RED: 0,
        GREEN: 1
    },
    SPEED_RATIO_THRESHOLD: 0.5,
    MAX_RATIO: 1,
    MEDIUM_RATIO: 0.6,
    LOW_RATIO: 0.35,
    RANGE_RATIO: 0.2,
    TIME_FOR_UPDATELIGHT


}

/*CROSSROADS: [
    {
        roads: [
            {
                name: 'A',
                lon: 5.723423877196694,
                lat: 45.1908607332353
            },
            {
                name: 'B',
                lon: 5.723565104168102,
                lat: 45.19073039999893
            },
            {
                name: 'C',
                lon: 5.723383644061244,
                lat: 45.190758658035065
            }
        ],
        center: {
            lon: 5.723469616845613,
            lat: 45.19078014905249,
        }
    }
],
API_KEY: KEY_1,
COLORS: {
    RED: 0,
    GREEN: 1
},
SPEED_RATIO_THRESHOLD: 0.6
}

*/
