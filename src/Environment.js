import React from 'react';
import './Environment.css';

function Environment({ sensorData, onBack, onNavigate }) {

    // 1. 온도 상태 함수 (아이콘, 텍스트, 위험여부 반환)
    const getTempStatus = (temp) => {
        if (temp >= 28) {
            // 더울 때: 더운 얼굴 아이콘
            return { icon: "🥵", text: "조금 더워요", isBad: true };
        } else if (temp <= 18) {
            // 추울 때: 추운 얼굴 아이콘
            return { icon: "🥶", text: "좀 쌀쌀해요", isBad: true };
        } else {
            // 적정: 해 아이콘
            return { icon: "☀️", text: "포근해요", isBad: false };
        }
    };

    // 2. 미세먼지 상태 함수
    const getDustStatus = (dust) => {
        if (dust >= 80) {
            // 나쁨: 마스크 아이콘
            return { icon: "😷", text: "공기가 탁해요", isBad: true };
        } else if (dust >= 30) {
            // 보통: 그냥 웃는 아이콘
            return { icon: "🙂", text: "그저 그래요", isBad: false };
        } else {
            // 좋음: 나뭇잎 아이콘
            return { icon: "🍃", text: "상쾌해요", isBad: false };
        }
    };

    // 3. 습도 상태 함수
    const getHumidStatus = (humid) => {
        if (humid >= 60) {
            // 습함: 물방울 아이콘
            return { icon: "💧", text: "조금 꿉꿉해요", isBad: true };
        } else if (humid <= 30) {
            // 건조: 선인장 아이콘
            return { icon: "🌵", text: "너무 건조해요", isBad: true };
        } else {
            // 쾌적: 반짝이 아이콘
            return { icon: "🌳", text: "쾌적해요", isBad: false };
        }
    };

    // 4. 물 수위 상태 함수
    const getWaterStatus = (level) => {
        if (level <= 30) {
            // 물 부족: 양동이(채워달라는 의미) 아이콘
            return { icon: "🪣", text: "많이 마셨어요", isBad: true };
        } else if (level >= 70) {
            // 물 많음: 양동이(채워달라는 의미) 아이콘
            return { icon: "🪣", text: "조금 마셨어요", isBad: true };
        } else {
            // 충분: 밥그릇 아이콘
            return { icon: "💧💧", text: "적당해요", isBad: false };
        }
    };

    // 5. 사료 무게 상태 함수
    const getFoodStatus = (amount) => {
        if (amount <= 20) {
            // 사료 부족: 빈 접시 아이콘
            return { icon: "🍽️🍽️", text: "많이 먹었어요", isBad: true };
        } else if (amount >= 70) {
            // 사료 많음: 양동이(채워달라는 의미) 아이콘
            return { icon: "🍽️", text: "조금 먹었어요", isBad: true };
        } else {
            // 충분: 고기 아이콘
            return { icon: "🍖", text: "적당해요", isBad: false };
        }
    };

    // 상태 계산 (데이터가 없을 경우 0으로 처리)
    const tempInfo = getTempStatus(sensorData.temp || 0);
    const dustInfo = getDustStatus(sensorData.dust || 0);
    const humidInfo = getHumidStatus(sensorData.humid || 0);
    const waterInfo = getWaterStatus(sensorData.water || 0);
    const foodInfo = getFoodStatus(sensorData.food || 0);

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


            {/* Sensor cards - Top row */}
            <div className="sensor-row-top">
                {/* Temperature */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-temp">
                        {/* 메인 아이콘이 상태에 따라 변경됨 */}
                        <div className="sensor-icon">{tempInfo.icon}</div>
                        <div className="sensor-value">{sensorData.temp}°C</div>
                        {/* 텍스트에는 이모지가 빠짐 */}
                        <div className={`sensor-status ${tempInfo.isBad ? 'status-alert' : ''}`}>
                            {tempInfo.text}
                        </div>
                    </div>
                </div>

                {/* Dust */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-dust">
                        {/* 메인 아이콘 변경 */}
                        <div className="sensor-icon">{dustInfo.icon}</div>
                        <div className="sensor-value">{sensorData.dust} μg/m³</div>
                        <div className={`sensor-status ${dustInfo.isBad ? 'status-alert' : ''}`}>
                            {dustInfo.text}
                        </div>
                    </div>
                </div>

                {/* Humidity */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-humid">
                        {/* 메인 아이콘 변경. 쾌적할 땐 아이콘 대신 텍스트가 나오게 설정되어 있어서 수정 */}
                        <div className="sensor-icon">{humidInfo.icon === "쾌적해요" ? "✨" : humidInfo.icon}</div>
                        <div className="sensor-value">{sensorData.humid || 0}%</div>
                        <div className={`sensor-status ${humidInfo.isBad ? 'status-alert' : ''}`}>
                            {humidInfo.text}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sensor cards - Bottom row */}
            <div className="sensor-row-bottom">
                {/* Water level */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-water">
                        {/* 메인 아이콘 변경 (🥣 or 🪣) */}
                        <div className="sensor-icon">{waterInfo.icon}</div>
                        <div className="sensor-value">{sensorData.water}%</div>
                        <div className={`sensor-status ${waterInfo.isBad ? 'status-alert' : ''}`}>
                            {waterInfo.text}
                        </div>
                    </div>
                </div>

                {/* Weight/Food */}
                <div className="sensor-card">
                    <div className="sensor-circle sensor-food">
                        {/* 메인 아이콘 변경 (🍖 or 🍽️) */}
                        <div className="sensor-icon">{foodInfo.icon}</div>
                        {/* 여기는 값 표시 없이 상태 텍스트만 크게 표시 */}
                        <div className={`sensor-status-large ${foodInfo.isBad ? 'status-alert' : ''}`}>
                            {foodInfo.text}
                        </div>
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