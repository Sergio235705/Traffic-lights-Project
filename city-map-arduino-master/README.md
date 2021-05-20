# city-map-arduino

This project is the code for the electronique part of our global project.
This will be compile to a wifi module in order to create a communication between the wifi module, the circuit and the server.


## Installation

* Install Arduino App [here](https://www.arduino.cc/en/software)

* Install wifi module by following [these instructions](https://projetsdiy.fr/programmer-esp8266-ide-arduino-librairies-gpio-web-serveur-client/)

* Install Json library by following [these instructions](https://randomnerdtutorials.com/decoding-and-encoding-json-with-arduino-or-esp8266/)


## Manipulation 

* Connect your circuit to your computer through your Wi-Fi module

* Ensure that your [server](https://gitlab.ensimag.fr/djeafeam/city-map-server) is running

* Configure the top of the city-map-arduino.ino file by changing the wifi ssid, the wifi password and the ip address of your server
```
#define WIFI_SSID "HUAWEI_MED" // The ssid of the Wi-Fi used
#define WIFI_PASSWORD "Med!Huawei20" // The password of the Wi-Fi used
#define SERVER_ADDRESS "http://192.168.1.101:3000/last-data/" // Url to the local server being in the same LAN
```

* Compile the program

* Have a great experience !
