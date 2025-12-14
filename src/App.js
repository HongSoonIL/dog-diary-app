import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Main from './Main';
import Environment from './Environment';
import Diary from './Diary';
import Settings from './Settings';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { selectImagePrompt } from './utils/imagePrompts';
import { generateDogImage } from './services/imageGenerationService';

function App() {
  const [currentScreen, setCurrentScreen] = useState('main'); // 'main', 'environment', 'diary', 'settings'
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sensorData, setSensorData] = useState({ temp: '--', humid: '--', dust: '--', water: '--', weight: '--' });

  // 데이터 수집용
  const [currentInterval, setCurrentInterval] = useState([]);

  // 일기 생성 관련
  const [diaryResult, setDiaryResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 강아지 설정 정보
  const [petInfo, setPetInfo] = useState(null);

  const textDecoder = new TextDecoder('utf-8');
  const lineBuffer = useRef('');

  const BLE_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
  const BLE_CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

  // localStorage에서 강아지 설정 정보 로드
  useEffect(() => {
    const savedData = localStorage.getItem('petSettingsData');
    if (savedData) {
      setPetInfo(JSON.parse(savedData));
    }
  }, []);

  // 블루투스 연결 함수
  const connectBluetooth = async () => {
    try {
      setIsConnecting(true);
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [BLE_SERVICE_UUID] }]
      });

      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setSensorData({ temp: '--', humid: '--', dust: '--', water: '--', weight: '--' });
        alert('연결이 끊어졌습니다.');
        setCurrentScreen('main'); // 연결이 끊어지면 메인으로 복귀
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(BLE_SERVICE_UUID);
      const characteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleData);

      setIsConnected(true);
      setIsConnecting(false);
    } catch (error) {
      console.error(error);
      alert('연결 실패: ' + error);
      setIsConnecting(false);
    }
  };

  // 데이터 처리 함수
  const handleData = (event) => {
    let value = textDecoder.decode(event.target.value);
    lineBuffer.current += value;
    let lines = lineBuffer.current.split('\n');
    lineBuffer.current = lines.pop();

    for (const line of lines) {
      let str = line.trim();
      if (str) {
        const parts = str.split(' ');
        // 온도(1), 습도(3), 미세먼지(5), 수위(7), 무게(9)
        if (parts.length === 10) {
          const newData = {
            temp: parts[1],
            humid: parts[3],
            dust: parts[5],
            water: parts[7],
            weight: parts[9]
          };
          setSensorData(newData);
          // 데이터 축적 (일기 생성용)
          setCurrentInterval(prev => [...prev, { ...newData, timestamp: Date.now() }]);
        }
      }
    }
  };

  // 일기 생성 함수
  const generateDiary = async () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) return alert('API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');

    setIsGenerating(true);
    try {
      // 📊 환경 데이터 소스 결정
      let summary;
      let dataSource;

      if (currentInterval.length === 0) {
        // 🔌 블루투스 미연결 → 더미 데이터 사용 (테스트/시연 모드)
        console.log('📋 블루투스 미연결 - 더미 데이터로 일기 생성');
        dataSource = '더미 데이터';
        summary = {
          temp: '22.5',
          humid: '45',
          dust: '25',
          water: '70',
          weight: '450'
        };
      } else {
        // ✅ 블루투스 연결됨 → 실시간 센서 데이터 사용
        console.log(`📡 블루투스 연결됨 - 실시간 센서 데이터로 일기 생성 (${currentInterval.length}개 데이터 수집됨)`);
        dataSource = '실시간 센서';
        const avg = (key) => (currentInterval.reduce((sum, item) => sum + parseFloat(item[key]), 0) / currentInterval.length).toFixed(1);
        summary = {
          temp: avg('temp'),
          humid: avg('humid'),
          dust: avg('dust'),
          water: avg('water'),
          weight: avg('weight')
        };
      }

      // 강아지 정보 추가
      const petInfoText = petInfo ? `
[내 정보]
- 이름: ${petInfo.name || '강아지'}
- 품종: ${petInfo.breed || '알 수 없음'}
- 평균 밥 섭취량: ${petInfo.foodAmount || '정보 없음'}
- 평균 물 음수량: ${petInfo.waterAmount || '정보 없음'}
` : '';

      const prompt = `
당신은 귀여운 강아지입니다. 오늘 하루를 일기 형식으로 작성해주세요.
${petInfoText}
[오늘의 실내 환경 데이터]
- 온도: ${summary.temp}°C
- 습도: ${summary.humid}%  
- 미세먼지(실내): ${summary.dust}㎍/㎥
- 물통 수위: ${summary.water}% (물을 얼마나 마셨는지)
- 밥그릇 무게 변화: ${summary.weight}g (사료를 얼마나 먹었는지)

[환경 평가 기준]
🌡️ 온도
- 18도 미만: 춥다, 따뜻한 곳을 찾는다
- 18-23도: 쾌적하다, 활동하기 좋다
- 23-28도: 좀 따뜻하다, 시원한 곳을 찾는다
- 28도 이상: 덥다, 힘들다

💧 습도
- 30% 미만: 건조하다
- 30-60%: 쾌적하다
- 60% 이상: 습하다, 불쾌하다

🌫️ 미세먼지(실내)
- 15 이하: 매우 좋음, 산책 가고 싶다
- 16-35: 좋음, 쾌적하다
- 36-75: 보통, 조금 답답하다
- 76 이상: 나쁨, 숨쉬기 힘들다

💧 물 섭취 (정확한 수치가 아니므로 표현적으로)
- 수위가 많이 줄었다면: 목이 말라서 물을 많이 마셨다
- 수위가 조금 줄었다면: 적당히 마셨다
- 수위 변화가 적다면: 물을 별로 안 마셨다

🍖 사료 섭취 (정확한 수치가 아니므로 표현적으로)
- 무게가 많이 줄었다면: 밥을 맛있게 많이 먹었다
- 무게가 조금 줄었다면: 적당히 먹었다
- 무게 변화가 적다면: 입맛이 없었다

${petInfo && petInfo.breed ? `내 품종(${petInfo.breed})의 특성을 반영해서 일기를 작성해주세요.` : ''}
${petInfo && (petInfo.foodAmount || petInfo.waterAmount) ?
          `평균적으로 밥은 ${petInfo.foodAmount || '?'}, 물은 ${petInfo.waterAmount || '?'} 정도 먹고 마시는데, 오늘은 어땠는지 비교해서 언급해주세요.` : ''}

위 환경 데이터와 평가 기준을 바탕으로, 강아지의 입장에서 하루를 회고하는 일기를 작성해주세요.
말투는 귀엽게, 200자 이내로 작성해주세요.
            `;

      // 1. 텍스트 생성 (SDK 사용)
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const diaryText = response.text();

      // 2. AI 이미지 생성 (Pollinations.ai - 무료)
      let imgUrl;
      try {
        // 환경 데이터로 적절한 프롬프트 선택
        const imagePrompt = selectImagePrompt({
          temperature: parseFloat(summary.temp),
          humidity: parseFloat(summary.humid),
          dust: parseFloat(summary.dust)
        });

        console.log('🎨 AI 이미지 생성 시작...');
        imgUrl = await generateDogImage(imagePrompt);
        console.log('✅ AI 이미지 생성 완료!');

      } catch (imageError) {
        console.warn('AI 이미지 생성 실패, SVG fallback 사용:', imageError);

        // Fallback: SVG 이미지 사용
        const feeling = parseFloat(summary.temp) > 28 ? '더운 날, 시원한 곳을 찾아요' : '기분 좋은 날이에요';
        const emoji = parseFloat(summary.temp) > 28 ? '🌡️' : '😊';

        const svgImage = `
        <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:0.2" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:0.2" />
            </linearGradient>
          </defs>
          <rect width="500" height="500" fill="url(#bg)" />
          <text x="250" y="200" font-size="100" text-anchor="middle">${emoji}</text>
          <text x="250" y="250" font-size="120" text-anchor="middle">🐕</text>
          <text x="250" y="310" font-size="22" text-anchor="middle" fill="#333" font-family="Arial, sans-serif">
            ${feeling}
          </text>
          <rect x="100" y="330" width="300" height="2" fill="#ddd"/>
          <text x="250" y="365" font-size="16" text-anchor="middle" fill="#666">
            온도: ${summary.temp}°C | 습도: ${summary.humid}%
          </text>
          <text x="250" y="395" font-size="16" text-anchor="middle" fill="#666">
            미세먼지: ${summary.dust} | 무게: ${summary.weight}g
          </text>
        </svg>
      `;

        imgUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgImage)))}`;
      }

      setDiaryResult({
        text: diaryText,
        image: imgUrl,
        date: new Date().toLocaleDateString('ko-KR'),
        dataSource: dataSource  // 데이터 소스 정보 표시
      });

    } catch (e) {
      console.error('Diary generation error:', e);
      alert('생성 실패: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // 화면 전환 핸들러
  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('main');
  };

  return (
    <div className="app">
      {currentScreen === 'main' && (
        <Main
          isConnected={isConnected}
          isConnecting={isConnecting}
          onConnect={connectBluetooth}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'environment' && (
        <Environment
          sensorData={sensorData}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'diary' && (
        <Diary
          diaryResult={diaryResult}
          isGenerating={isGenerating}
          onGenerateDiary={generateDiary}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      )}

      {currentScreen === 'settings' && (
        <Settings
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
