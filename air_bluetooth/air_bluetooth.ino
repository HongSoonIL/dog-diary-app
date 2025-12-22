#include <SoftwareSerial.h>
#include "DHT.h"
#include "HX711.h"

// --- 핀 번호 설정 ---
// 1. 온습도 센서(DHT11) 설정
#define DHTPIN 2       // DHT11 데이터 핀
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// 2. 미세먼지 센서(GP2Y10) 설정
const int dustLedPin = 10;     // 미세먼지 센서 LED 제어 핀
const int dustMeasurePin = A0; // 미세먼지 센서 측정 핀

// 3. 수위 센서 핀
const int waterPin = A1;

// --- 수위 센서 보정 (Calibration) ---
// 실제 측정값 기반 설정
const int WATER_DRY_VALUE = 0;     // 공기 중: 0
const int WATER_WET_VALUE = 360;   // 완전히 잠김: 350~361 (실측값)
// 참고: 절반 잠김 시 약 330~340

// 4. 로드셀 (HX711)
const int LOADCELL_DOUT_PIN = A2;
const int LOADCELL_SCK_PIN = A3;
HX711 scale;
float calibration_factor = 420.0; // 무게 정확도 보정값 (값이 틀리면 이 숫자를 조절하세요)
const bool SENSOR_REVERSE = false; // 무게가 거꾸로(마이너스) 측정되면 이 값을 true로 바꾸세요.
const float ZERO_THRESHOLD = 2.0; // 이 값(그램)보다 작은 무게(노이즈)는 무조건 0으로 표시합니다.

// 5. 블루투스 모듈(HM-10)을 위한 가상 시리얼 포트
SoftwareSerial btSerial(8, 9);

// --- 전역 변수 설정 ---
float dustDensity = 0.0;
const int DUST_SAMPLE_COUNT = 5;  // 미세먼지 평균 계산용
float lastWeight = 0.0;

void setup() {
  Serial.begin(9600);
  btSerial.begin(9600);
  
  // 센서 초기화
  dht.begin();
  pinMode(dustLedPin, OUTPUT);
  
  // 로드셀 초기화
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  // 방향 반전 옵션 적용
  if (SENSOR_REVERSE) {
    scale.set_scale(-calibration_factor); // 마이너스 부호 적용
  } else {
    scale.set_scale(calibration_factor);
  }
  scale.tare(); // 영점 조절 (부팅 시 무게를 0으로 설정)

  Serial.println("=== 아두이노 환경 모니터링 시스템 ===");
  Serial.println("센서 보정 가이드:");
  Serial.println("1. 수위센서를 공기 중에 놔두고 'Raw Water' 값 확인");
  Serial.println("2. 그 값을 WATER_DRY_VALUE에 입력");
  Serial.println("3. 수위센서를 물에 완전히 담그고 'Raw Water' 값 확인");
  Serial.println("4. 그 값을 WATER_WET_VALUE에 입력");
  Serial.println("=====================================\n");
  
  delay(2000);
}

void loop() {
  // --- 1. 온습도 값 측정 ---
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // DHT 센서 읽기 실패 체크
  if (isnan(h) || isnan(t)) {
    Serial.println("DHT 센서 읽기 실패!");
    h = 0;
    t = 0;
  }

  // --- 2. 미세먼지 값 측정 (GP2Y10 전용) ---
  float dustSum = 0;
  for (int i = 0; i < DUST_SAMPLE_COUNT; i++) {
    digitalWrite(dustLedPin, LOW);  // LED 켜기
    delayMicroseconds(280);
    
    int voMeasured = analogRead(dustMeasurePin);
    
    delayMicroseconds(40);
    digitalWrite(dustLedPin, HIGH); // LED 끄기
    delayMicroseconds(9680);
    
    // 전압 계산 (0-5V 범위)
    float voVoltage = voMeasured * (5.0 / 1024.0);
    
    // GP2Y10 공식 수정: Raw 값이 3~11이면 약 0.015~0.054V
    // 아날로그 값을 직접 사용하여 농도 계산
    // 일반적으로 깨끗한 공기에서 아날로그 값은 매우 낮음
    float density = voMeasured * 0.17 - 0.1;  
    
    if (density < 0) {
      density = 0;
    }
    
    dustSum += density;
    delay(10);  // 각 측정 사이 짧은 대기
  }
  
  // 평균값 계산
  dustDensity = dustSum / DUST_SAMPLE_COUNT;

  // --- 3. 수위 값 측정 및 보정 ---
  int waterValue = analogRead(waterPin);
  
  // 비선형 보정 (절반일 때 50%로 표시)
  int waterPercent;
  if (waterValue <= 0) {
    waterPercent = 0;
  } else if (waterValue <= 335) {
    // 0~335 구간을 0~50%로 매핑 (하단부)
    waterPercent = map(waterValue, 0, 335, 0, 50);
  } else {
    // 335~360 구간을 50~100%로 매핑 (상단부)
    waterPercent = map(waterValue, 335, 360, 50, 100);
  }
  
  // 0-100% 범위로 제한
  waterPercent = constrain(waterPercent, 0, 100);

  // 4. 무게 측정 보정 로직
  if (scale.is_ready()) {
    float reading = scale.get_units(5); 
    //  절대값(abs) 적용: +/- 구분 없이 무조건 양수로 변환
    reading = abs(reading);
    // (A) 노이즈 제거: 설정한 값(2g)보다 작으면 0으로 처리
    if (reading < ZERO_THRESHOLD) {
      reading = 0.0;
    }
    lastWeight = reading;
  } else {
    Serial.println("HX711 센서 준비 안됨");
  }
  
  // --- 5. 데이터 전송 ---
  String dataString = "";
  dataString += "온도: ";
  dataString += String(t, 1);  // 소수점 1자리
  dataString += " 습도: ";
  dataString += String(h, 1);
  dataString += " 미세먼지: ";
  dataString += String(dustDensity, 2);  // 소수점 2자리
  dataString += " 수위: ";
  dataString += String(waterPercent);
  dataString += " 무게: ";
  dataString += String(lastWeight, 1);
  
  // 블루투스 전송
  btSerial.println(dataString);
  
  // 시리얼 모니터 출력 (디버깅용)
  Serial.print(dataString);
  Serial.print(" | Raw Water: ");
  Serial.print(waterValue);
  Serial.print(" | Raw Dust: ");
  Serial.println(analogRead(dustMeasurePin));
  Serial.print(" | Raw Weight: "); // [확인] 여기가 무게 원본값입니다
  Serial.println(lastWeight);

  delay(1000); // 1초마다 업데이트
}