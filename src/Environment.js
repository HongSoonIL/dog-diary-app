import React from 'react';
import './Environment.css';

import puppyIcon from './assets/puppy_icon.png';
import paperTexture from './assets/paper_texture.png';

function Environment({ sensorData, onBack, onNavigate }) {
  // 1. 온도 상태 함수 (아이콘, 텍스트, 위험여부 반환)
  const getTempStatus = (temp) => {
    if (temp >= 28) return { icon: "🥵", text: "조금 더워요", isBad: true };
    if (temp <= 18) return { icon: "🥶", text: "좀 쌀쌀해요", isBad: true };
    return { icon: "☀️", text: "포근해요", isBad: false };
  };

  // 2. 미세먼지 상태 함수
  const getDustStatus = (dust) => {
    if (dust >= 80) return { icon: "😷", text: "공기가 탁해요", isBad: true };
    if (dust >= 30) return { icon: "🙂", text: "그저 그래요", isBad: false };
    return { icon: "🍃", text: "상쾌해요", isBad: false };
  };

  // 3. 습도 상태 함수
  const getHumidStatus = (humid) => {
    if (humid >= 60) return { icon: "💧", text: "조금 꿉꿉해요", isBad: true };
    if (humid <= 30) return { icon: "🌵", text: "너무 건조해요", isBad: true };
    return { icon: "✨", text: "쾌적해요", isBad: false };
  };

  // 4. 물 수위 상태 함수
  const getWaterStatus = (level) => {
    if (level <= 30) return { icon: "🪣", text: "많이 마셨어요", isBad: true };
    return { icon: "🥣", text: "충분해요", isBad: false };
  };

  // 5. 사료 무게 상태 함수
  const getFoodStatus = (amount) => {
    if (amount <= 20) return { icon: "🍽️", text: "많이 먹었어요", isBad: true };
    return { icon: "🍖", text: "적당해요", isBad: false };
  };

  const tempInfo = getTempStatus(sensorData.temp || 0);
  const dustInfo = getDustStatus(sensorData.dust || 0);
  const humidInfo = getHumidStatus(sensorData.humidity || 0);
  const waterInfo = getWaterStatus(sensorData.water || 0);
  const foodInfo = getFoodStatus(sensorData.food || 0);

  return (
    <div className="environment-screen">
      {/* ===== Main 레이아웃 배경 (Main.js 구조 그대로) ===== */}
      <div className="background"></div>

      <div className="left-note-paper">
        <div
          className="texture-overlay"
          style={{ backgroundImage: `url(${paperTexture})` }}
        ></div>

        <div className="hole-container">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>
      </div>

      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← 뒤로
      </button>

      {/* Title */}
      <div className="env-header">
        <h1 className="env-main-title">오늘의 컨디션 🐶</h1>
        <p className="env-subtitle">반려견의 환경 모니터링</p>
      </div>

      {/* Sensor cards - Top row */}
      <div className="sensor-row-top">
        <div className="sensor-card">
          <div className="sensor-circle sensor-temp">
            <div className="sensor-icon">{tempInfo.icon}</div>
            <div className="sensor-value">{sensorData.temp}°C</div>
            <div className={`sensor-status ${tempInfo.isBad ? 'status-alert' : ''}`}>
              {tempInfo.text}
            </div>
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-circle sensor-dust">
            <div className="sensor-icon">{dustInfo.icon}</div>
            <div className="sensor-value">{sensorData.dust} μg/m³</div>
            <div className={`sensor-status ${dustInfo.isBad ? 'status-alert' : ''}`}>
              {dustInfo.text}
            </div>
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-circle sensor-humid">
            <div className="sensor-icon">{humidInfo.icon}</div>
            <div className="sensor-value">{sensorData.humidity || 0}%</div>
            <div className={`sensor-status ${humidInfo.isBad ? 'status-alert' : ''}`}>
              {humidInfo.text}
            </div>
          </div>
        </div>
      </div>

      {/* Sensor cards - Bottom row */}
      <div className="sensor-row-bottom">
        <div className="sensor-card">
          <div className="sensor-circle sensor-water">
            <div className="sensor-icon">{waterInfo.icon}</div>
            <div className="sensor-value">{sensorData.water}%</div>
            <div className={`sensor-status ${waterInfo.isBad ? 'status-alert' : ''}`}>
              {waterInfo.text}
            </div>
          </div>
        </div>

        <div className="sensor-card">
          <div className="sensor-circle sensor-food">
            <div className="sensor-icon">{foodInfo.icon}</div>
            <div className={`sensor-status-large ${foodInfo.isBad ? 'status-alert' : ''}`}>
              {foodInfo.text}
            </div>
          </div>
        </div>
      </div>

      {/* Right Menu (Main과 동일한 위치/스타일) */}
      <div className="menu">
        <button className="menu-button menu-environment">환경</button>
        <button className="menu-button menu-diary" onClick={() => onNavigate('diary')}>일기</button>
        <button className="menu-button menu-settings" onClick={() => onNavigate('settings')}>설정</button>
      </div>

      {/* Bottom Right Logo (Main과 동일) */}
      <div className="logo">
        <img src={puppyIcon} alt="강아지 발바닥 로고" className="logo-icon" />
        <span className="logo-text">재롱이</span>
      </div>
    </div>
  );
}

export default Environment;
