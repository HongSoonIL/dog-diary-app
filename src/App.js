import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Icons } from './Icons';
import { GoogleGenerativeAI } from '@google/generative-ai';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sensorData, setSensorData] = useState({ temp: '--', humid: '--', dust: '--', water: '--', weight: '--' });

  // 데이터 수집용
  const [currentInterval, setCurrentInterval] = useState([]);

  // 일기 생성 관련
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [diaryResult, setDiaryResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const textDecoder = new TextDecoder('utf-8');
  const lineBuffer = useRef('');

  const BLE_SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
  const BLE_CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);
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
    if (!apiKey) return alert('API 키를 먼저 입력해주세요.');
    if (currentInterval.length === 0) return alert('데이터가 충분하지 않습니다. 센서를 연결하고 잠시 기다려주세요.');

    setIsGenerating(true);
    try {
      // 평균값 계산
      const avg = (key) => (currentInterval.reduce((sum, item) => sum + parseFloat(item[key]), 0) / currentInterval.length).toFixed(1);

      const summary = {
        temp: avg('temp'),
        humid: avg('humid'),
        dust: avg('dust'),
        water: avg('water'),
        weight: avg('weight')
      };

      const prompt = `
                당신은 귀여운 강아지입니다. 오늘 하루를 일기로 써주세요.
                환경 데이터: 온도 ${summary.temp}도, 습도 ${summary.humid}%, 미세먼지 ${summary.dust}, 수위 ${summary.water}%, 몸무게 ${summary.weight}g.
                미세먼지가 높으면(30이상) 산책 못가서 슬픔, 온도가 높으면(28도이상) 더움 등을 표현해주세요.
                말투는 귀엽게, 200자 이내로.
            `;

      // 1. 텍스트 생성 (SDK 사용)
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const diaryText = response.text();

      // 2. 이미지 생성 (CORS 문제로 SVG placeholder 사용)
      // 브라우저에서는 Imagen API를 직접 호출할 수 없습니다
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

      const imgUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgImage)))}`;

      setDiaryResult({ text: diaryText, image: imgUrl, date: new Date().toLocaleDateString('ko-KR') });

    } catch (e) {
      console.error('Diary generation error:', e);
      alert('생성 실패: ' + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="card">
        <h1 className="header-title"><Icons.Activity /> 강아지 그림일기</h1>
        <p>실시간 모니터링 & AI 일기 생성 시스템</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className={`btn ${isConnected ? 'btn-success' : 'btn-primary'}`} onClick={connectBluetooth} disabled={isConnected || isConnecting}>
            {isConnecting ? '연결 중...' : isConnected ? '연결됨 (HM-10)' : '블루투스 연결'}
          </button>
          {isConnected && <Icons.Wifi color="#10b981" />}
        </div>
      </div>

      {/* API Key Input */}
      <div className="card">
        <button className="btn" style={{ background: '#eee', color: '#333' }} onClick={() => setShowApiInput(!showApiInput)}>🔑 API 키 설정</button>
        {showApiInput && (
          <div className="input-group">
            <input className="input-field" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Gemini API Key" />
            <button className="btn btn-success" onClick={() => { localStorage.setItem('gemini_api_key', apiKey); setShowApiInput(false); alert('저장됨'); }}>저장</button>
          </div>
        )}
      </div>

      {/* Sensor Dashboard */}
      <div className="card">
        <h2>📊 실시간 데이터</h2>
        <div className="sensor-grid">
          <div className="sensor-item"><Icons.Thermometer /><div className="sensor-value">{sensorData.temp}</div><div className="sensor-unit">°C 온도</div></div>
          <div className="sensor-item"><Icons.Droplets /><div className="sensor-value">{sensorData.humid}</div><div className="sensor-unit">% 습도</div></div>
          <div className="sensor-item"><Icons.Wind /><div className="sensor-value">{sensorData.dust}</div><div className="sensor-unit">mg/m³ 먼지</div></div>
          <div className="sensor-item"><Icons.Droplets /><div className="sensor-value">{sensorData.water}</div><div className="sensor-unit">% 수위</div></div>
          <div className="sensor-item"><Icons.Scale /><div className="sensor-value">{sensorData.weight}</div><div className="sensor-unit">g 무게</div></div>
        </div>
      </div>

      {/* Diary Section */}
      <div className="card">
        <h2>🎨 그림일기</h2>
        <button className="btn btn-primary" onClick={generateDiary} disabled={isGenerating}>
          {isGenerating ? 'AI가 일기 쓰는 중...' : '일기 생성하기'}
        </button>

        {diaryResult && (
          <div style={{ marginTop: '20px' }}>
            <h3>📅 {diaryResult.date}</h3>
            {diaryResult.image && <img src={diaryResult.image} className="diary-image" alt="일기 그림" />}
            <div className="diary-paper">{diaryResult.text}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
