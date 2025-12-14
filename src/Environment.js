import React from 'react';
import './Environment.css';

function Environment({ sensorData, onBack, onNavigate }) {
    return (
        <div className="environment-screen">
            {/* Back button */}
            <button className="back-btn" onClick={onBack}>
                ← 뒤로
            </button>

            {/* Title */}
            <div className="env-header">
                <h1 className="env-main-title">오늘의 컨디션 🐶</h1>
                <p className="env-subtitle">반려견의 환경 모니터링</p>
            </div>

            {/* Sensor cards - Top row (3 cards) */}
            <div className="sensor-row-top">
                {/* Temperature */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-temp">
                        <div className="sensor-icon">☀️</div>
                        <div className="sensor-value">{sensorData.temp}°C</div>
                        <div className="sensor-status">포근해요</div>
                    </div>
                </div>

                {/* Dust */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-dust">
                        <div className="sensor-icon">🍃</div>
                        <div className="sensor-value">{sensorData.dust} μg/m³</div>
                        <div className="sensor-status">상쾌해요</div>
                    </div>
                </div>

                {/* Humidity (drinking) */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-humid">
                        <div className="sensor-icon">💧</div>
                        <div className="sensor-status-large">충분히<br />마셨어요</div>
                    </div>
                </div>
            </div>

            {/* Sensor cards - Bottom row (2 cards) */}
            <div className="sensor-row-bottom">
                {/* Water level */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-water">
                        <div className="sensor-icon">💧</div>
                        <div className="sensor-value">{sensorData.water}%</div>
                        <div className="sensor-status">건조해요</div>
                    </div>
                </div>

                {/* Weight/Food */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-food">
                        <div className="sensor-icon">🍽️</div>
                        <div className="sensor-status-large">적당히<br />먹었어요</div>
                    </div>
                </div>
            </div>

            {/* Right side menu buttons */}
            <div className="menu">
                <button className="menu-button menu-environment">환경</button>
                <button className="menu-button menu-diary" onClick={() => onNavigate('diary')}>일기</button>
                <button className="menu-button menu-settings" onClick={() => onNavigate('settings')}>설정</button>
            </div>

            {/* Logo */}
            <div className="logo">
                <span className="logo-icon">🐾</span>
                <span className="logo-text">재롱이</span>
            </div>
        </div>
    );
}

export default Environment;
