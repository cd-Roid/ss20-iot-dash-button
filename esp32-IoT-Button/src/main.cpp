#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "credentials.h"
#include "rgb_lcd.h"
#include "paj7620.h"

WiFiClient espClient;
PubSubClient client(espClient);

rgb_lcd lcd;
const int switchPin = 33;
static int hits = 0;
int lastHit = -1;
int switchState = 0;
int prevSwitchState = 0;
int len = 0;
StaticJsonDocument<256> doc;

byte customChar[] = {
    B00000,
    B01010,
    B00000,
    B10001,
    B10001,
    B10001,
    B01110,
    B00000};

/*** Initales verbinden mit WLAN ***/
void setupWifi()
{
  Serial.print("\nConnecting to");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    Serial.println(WiFi.status());
  }

  Serial.print("\nConnected to");
  Serial.println(ssid);
}

/*** Connenct/Reconnect to MQTT Broker in Case of Connection loss ***/
const char *broker = "test.mosquitto.org";                          //Adresse des Brokers
const char *inTopic = "thkoeln/IoT/bmw/montage/mittelkonsole/list"; //Ein Topic

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");
      client.subscribe(inTopic);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

/*** Funktion welche ausgeführt wird, wenn eine Nachricht auf einem abbonierten Topic ankommt ***/
void callback(char *topic, byte *payload, unsigned int length)
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Updating...");
  Serial.print("Received messages: ");
  Serial.println(topic);
  for (int i = 0; i < length; i++)
  {
    Serial.printf("%c", (char)payload[i]); // Ausgabe der gesamten Nachricht
  }
  deserializeJson(doc, payload, length);
  Serial.println(doc[0]["name"].as<char *>());
  len = doc.size();
  Serial.println(len);
  if (hits >= len)
    hits = len - 1;
  lastHit = -1;
}

void setup()
{
  Serial.begin(9600);
  setupWifi();
  client.setServer(broker, 1883);
  client.setCallback(callback);

  lcd.begin(16, 2);
  pinMode(switchPin, OUTPUT);

  lcd.setCursor(0, 0);
  lcd.print("Swipe 2 Navigate");
  lcd.createChar(0, customChar);
  paj7620Init();
}

void loop()
{

  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  uint8_t data = 0; // Read Bank_0_Reg_0x43/0x44 for gesture result.

  paj7620ReadReg(0x43, 1, &data); // When different gestures be detected, the variable 'data' will be set to different values by paj7620ReadReg(0x43, 1, &data).

  if (data == GES_UP_FLAG)
  {
    if (hits + 1 < len)
      hits = hits + 1;
    else
      hits = 0;
    delay(10);
  }

  if (data == GES_DOWN_FLAG)
  {
    if (hits - 1 < 0)
      hits = len - 1;
    else
      hits = hits - 1;
    delay(10);
  }

  if (hits != lastHit)
  {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(doc[hits]["name"].as<char *>());
    lcd.setCursor(0, 1);
    String quantity = doc[hits]["quantitiy"].as<char *>();
    quantity += " St";
    lcd.print(quantity);
    lcd.write((unsigned char)0);
    lcd.print("ck");
    lcd.setCursor(13, 1);
    lcd.print(hits + 1);
    lcd.print("/");
    lcd.print(len);
    lastHit = hits;
  }
}
