#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <ArduinoJson.h>

// ***************** CONSTANTS ***************

/**
 * Wifi Module Pin Constants
 * */
#define D0 16 
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13
#define D8 15
#define D9 3
#define D10 1

/* *
 * Traffic light color
 * */

#define GREEN 1
#define RED 0


#define WIFI_SSID "HUAWEI_MED" // The ssid of the Wi-Fi used
#define WIFI_PASSWORD "Med!Huawei20" // The password of the Wi-Fi used
#define SERVER_ADDRESS "http://192.168.1.101:3000/last-data/" // Url to the local server being in the same LAN


// ******************* STRUCTS ***********************

struct TrafficLight { // Traffic light structure
  int green_pin; // Arduino pin for green light
  int red_pin; // Arduino pin for red light
  int state; // State of the traffic light (GREEN or RED)
};
typedef struct TrafficLight TrafficLight;

struct Crossroad { // Crossroad structure
  TrafficLight *tl_set; // Table of traffic light objects
  int nb_tl; // Number of traffic lights of the crossroad
};

typedef struct Crossroad Crossroad;




// ******************** FUNCTIONS *******************

// Function which creates a crossraod
Crossroad create_crossroad(int nb_tl, int pins[]) {
  Crossroad cr;
  cr.nb_tl = nb_tl;  
  cr.tl_set = (TrafficLight*)malloc(sizeof(TrafficLight)*nb_tl);

  int i = 0;
  for (i = 0; i < nb_tl; i++) {
    cr.tl_set[i] = create_traffic_light(pins[i*2], pins[i*2+1]);
  }
  return cr;
}


// Function which frees a crossroad (Free the memory used)
void free_crossraod(Crossroad cr) {
  free(cr.tl_set);
}

// Function which initializes the crossroad in arduino
void init_crossroad(Crossroad cr) {
  int i = 0;
  for (i = 0; i < cr.nb_tl; i++) {
    init_traffic_light(cr.tl_set[i]);
  }
}


// Function which set colors of a crossroad
void set_crossroad_colors(Crossroad cr, int colors[]) {
  int i = 0;
  for (i = 0; i < cr.nb_tl; i++) {
    set_traffic_light_color(cr.tl_set[i], colors[i]);
  }
}


//Function which initializes a traffic light
void init_traffic_light(TrafficLight tl) {
  pinMode(tl.green_pin, OUTPUT);
  pinMode(tl.red_pin, OUTPUT);
  update_traffic_light_pins(tl);
}

// Function which set color of a traffic light
void set_traffic_light_color(TrafficLight tl, int color) {
  tl.state = color;
  update_traffic_light_pins(tl);
}


void update_traffic_light_pins(TrafficLight tl) {
  if (tl.state == GREEN) {
    digitalWrite(tl.green_pin, HIGH);
    digitalWrite(tl.red_pin, LOW);
  }
  if (tl.state == RED) {
    digitalWrite(tl.green_pin, LOW);
    digitalWrite(tl.red_pin, HIGH);
  }
}


// Function which create a traffic light
TrafficLight create_traffic_light(int green_pin, int red_pin) {
   TrafficLight tl;
   tl.green_pin = green_pin;
   tl.red_pin = red_pin;
   tl.state = RED;
   return tl;
}



// ********************* GLOBAL VARIABLES ********************

ESP8266WiFiMulti WiFiMulti;
Crossroad cr;



// ********************* MAIN PROGRAM ************************

void setup() {
  int pins[] = {D2, D3, D5, D6, D7, D8};
  cr = create_crossroad(3, pins);
  init_crossroad(cr);

  int initial_colors[] = {RED, RED, RED};
  set_crossroad_colors(cr, initial_colors);

  Serial.begin(115200);
  // Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(WIFI_SSID, WIFI_PASSWORD);
}

void loop() {
  // Test for the wifi connectivity
  if ((WiFiMulti.run() == WL_CONNECTED)) {
    WiFiClient client;
    HTTPClient http;
    StaticJsonBuffer<700> jsonBuffer;

    if (http.begin(client, SERVER_ADDRESS)) {
      // start connection and send HTTP header
      int httpCode = http.GET();

      // httpCode will be negative on error
      if (httpCode > 0) {
        // HTTP header has been send and Server response header has been handled

        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_MOVED_PERMANENTLY) {
          String stringData = http.getString();
          Serial.println(stringData);
          
          JsonObject& jsonData = jsonBuffer.parseObject(stringData);

          int *colors = (int*)malloc(sizeof(int)*cr.nb_tl);
          int i = 0;
          for (i = 0; i < cr.nb_tl; i++) {
            colors[i] = jsonData["roads"][i]["color"];
          }
          
          set_crossroad_colors(cr, colors);
          free(colors);
        }
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
      }

      http.end();
    } else {
      Serial.printf("[HTTP} Unable to connect\n");
    }
  } else {
    Serial.printf("Error Wifi\n");
  }

  delay(3000);  
}
