#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "credentials.h"
#include "rgb_lcd.h"
#include "paj7620.h"
#include <ESP32Encoder.h>

#define WAKEUP_PIN_BITMASK 0x100004000

ESP32Encoder encoder;
int lastCount = 0;

WiFiClient espClient;
PubSubClient client(espClient);

rgb_lcd lcd;
const int switchPin = 33;
static int hits = 0;
int lastHit = -1;
int switchState = 0;
int prevSwitchState = 0;
int len = 0;
int timer = 0;
DynamicJsonDocument doc(1024);

byte customChar[] = {
    B00000,
    B01010,
    B00000,
    B10001,
    B10001,
    B10001,
    B01110,
    B00000};

byte topLeftCheck[] = {
    B00001,
    B00011,
    B00111,
    B01111,
    B11111,
    B11111,
    B11111,
    B11111};

byte topRightCheck[] = {
    B10000,
    B11000,
    B11100,
    B11110,
    B11111,
    B11111,
    B11101,
    B11101};

byte bottomLeftCheck[] = {
    B11111,
    B11011,
    B11101,
    B11110,
    B01111,
    B00111,
    B00011,
    B00001};

byte bottomRightCheck[] = {
    B11011,
    B10111,
    B01111,
    B11111,
    B11110,
    B11100,
    B11000,
    B10000};

/*** Initales verbinden mit WLAN ***/
void setupWifi()
{
  int counter = 0;
  int retryCounter = 0;
  lcd.setCursor(0, 0);
  lcd.print("Connecting...");
  Serial.print("\nConnecting to");
  Serial.println(ssid);

  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED)
  {
    if (counter > 25)
    {
      retryCounter++;
      WiFi.reconnect();
      counter = 0;
    }
    delay(100);
    lcd.setCursor(0, 2);
    lcd.print("Status ");
    lcd.print(WiFi.status());
    Serial.println(WiFi.status());
    counter++;
  }

  Serial.print("\nConnected to");
  Serial.println(ssid);
}

/*** Connenct/Reconnect to MQTT Broker in Case of Connection loss ***/
const char *broker = "test.mosquitto.org";                          //Adresse des Brokers
const char *inTopic = "thkoeln/IoT/bmw/montage/mittelkonsole/list"; //Ein Topic
const char *outTopic = "thkoeln/IoT/bmw/montage/mittelkonsole/order/1234";

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
  doc.clear();
  deserializeJson(doc, payload, length);
  Serial.println(doc[0]["name"].as<char *>());
  len = doc.size();
  Serial.println(len);
  if (hits >= len)
    hits = len - 1;
  lastHit = -1;
  timer = 0;
  delay(500);
}

void setup()
{
  Serial.begin(9600);
  ESP32Encoder::useInternalWeakPullResistors = UP;
  encoder.attachHalfQuad(14, 27);
  encoder.setCount(0);
  esp_sleep_enable_ext0_wakeup(GPIO_NUM_33, 1);
  esp_sleep_enable_ext1_wakeup(WAKEUP_PIN_BITMASK, ESP_EXT1_WAKEUP_ALL_LOW);
  timer = 0;
  lcd.begin(16, 2);
  lcd.setCursor(0, 0);
  lcd.print("Welcome :)");
  setupWifi();
  client.setServer(broker, 1883);
  client.setCallback(callback);

  pinMode(switchPin, INPUT);

  lcd.createChar(0, customChar);
  lcd.createChar(1, topLeftCheck);
  lcd.createChar(2, topRightCheck);
  lcd.createChar(3, bottomLeftCheck);
  lcd.createChar(4, bottomRightCheck);
  paj7620Init();
}

void displaySuccess()
{
  lcd.clear();
  lcd.setCursor(7, 0);
  lcd.write(1);
  lcd.write(2);
  lcd.setCursor(7, 1);
  lcd.write(3);
  lcd.write(4);
  delay(1500);
}

void orderProduct()
{
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Bestelle");
  lcd.setCursor(0, 1);
  lcd.print(doc[hits]["name"].as<char *>());
  lcd.print("?");
  delay(400);
  int i = 0;
  while (1)
  {
    switchState = digitalRead(switchPin);
    if (switchState != prevSwitchState)
    {
      if (switchState == HIGH)
      {
        char buffer[256];
        size_t n = serializeJson(doc[hits], buffer);
        client.publish_P(outTopic, buffer, n);
        bzero(buffer, n);
        lastHit = -1;
        displaySuccess();
        break;
      }
    }
    i++;
    if (i == 8000)
    {
      lastHit = -1;
      break;
    }
    delay(1);
  }
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
    timer = 0;
    delay(10);
  }

  if (data == GES_DOWN_FLAG)
  {
    if (hits - 1 < 0)
      hits = len - 1;
    else
      hits = hits - 1;
    timer = 0;
    delay(10);
  }

  if (encoder.getCount() != lastCount && encoder.getCount() % 2 == 0)
  {
    int currentQuantity = atoi(doc[hits]["quantity"]);
    int step = atoi(doc[hits]["step"]);
    char snum[5];
    if (encoder.getCount() > lastCount)
    {
      currentQuantity += step;
    }
    else
    {
      if (currentQuantity - step > 0)
        currentQuantity -= step;
    }
    itoa(currentQuantity, snum, 10);
    doc[hits]["quantity"] = snum;
    lastCount = encoder.getCount();
    lastHit = -1;
    timer = 0;
  }

  if (hits != lastHit)
  {
    Serial.println(hits);
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print(doc[hits]["name"].as<char *>());
    lcd.setCursor(0, 1);
    String quantity = doc[hits]["quantity"].as<char *>();
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

  switchState = digitalRead(switchPin);
  if (switchState != prevSwitchState)
  {
    if (switchState == HIGH)
    {
      orderProduct();
      delay(10);
    }
  }
  timer++;
  if (timer == 8000)
  {
    lcd.setRGB(0, 0, 0);
    lcd.noDisplay();
    lastHit = -1;
    esp_deep_sleep_start();
  }
  delay(1);
}
