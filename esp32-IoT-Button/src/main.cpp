#include <Arduino.h>
#include <Wire.h>
#include "rgb_lcd.h"
#include "paj7620.h"

rgb_lcd lcd;
const int switchPin = 33;
static int hits = 0;
int switchState = 0;
int prevSwitchState = 0;

void setup()
{
  lcd.begin(16, 2);
  pinMode(switchPin, OUTPUT);
  Serial.begin(9600);
  lcd.setCursor(0, 0);
  lcd.print("Swipe 2 Navigate");
  paj7620Init();
  lcd.setCursor(0, 1);
  lcd.print("Test");
  // turn on the cursor:
  lcd.blink();
}

void loop()
{
  uint8_t data = 0; // Read Bank_0_Reg_0x43/0x44 for gesture result.

  paj7620ReadReg(0x43, 1, &data); // When different gestures be detected, the variable 'data' will be set to different values by paj7620ReadReg(0x43, 1, &data).

  if (data == GES_UP_FLAG)
  { // When up gesture be detected,the variable 'data' will be set to GES_UP_FLAG.
    digitalWrite(switchPin, HIGH);
    hits = hits + 1;
    delay(10); // turn the LED on (HIGH is the voltage level)
  }

  if (data == GES_DOWN_FLAG)
  {                               // When down gesture be detected,the variable 'data' will be set to GES_DOWN_FLAG.
    digitalWrite(switchPin, LOW); // turn the LED off by making the voltage LOW
    hits = hits - 1;
    delay(10);
  }

  Serial.print("hits:");
  Serial.println(hits);
  if (hits == 1)
  {
    Serial.println("Page 1");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Page 1");
  }
  else if (hits == 2)
  {
    Serial.println("Page 2");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Page 2");
  }
  else

      if (hits == 3)
  {
    Serial.println("Page 3");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Page 3");
  }
  else

      if (hits >= 4 || hits < 0)
  {
    hits = 1;
    Serial.println("couter is reset");
    Serial.println("Page 1");
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Page 1");
  }
  delay(500);
}
