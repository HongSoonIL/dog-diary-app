import React from 'react';
import './Environment.css';
import { Icons } from './Icons';

function Environment({ sensorData, onBack }) {
    return (
        <div className="environment-screen">
            <div className="env-header">
                <button className="back-btn" onClick={onBack}>
                    ← 뒤로
                </button>
                <h1>🌡️ 환경 모니터링</h1>
            </div>

            <div className="sensor-dashboard">
                <div className="sensor-card">
                    <Icons.Thermometer />
                    <div className="sensor-value">{sensorData.temp}</div>
                    <div className="sensor-label">°C 온도</div>
                </div>

                <div className="sensor-card">
                    <Icons.Droplets />
                    <div className="sensor-value">{sensorData.humid}</div>
                    <div className="sensor-label">% 습도</div>
                </div>

                <div className="sensor-card">
                    <Icons.Wind />
                    <div className="sensor-value">{sensorData.dust}</div>
                    <div className="sensor-label">㎍/㎥ 먼지</div>
                </div>

                <div className="sensor-card">
                    <Icons.Droplets />
                    <div className="sensor-value">{sensorData.water}</div>
                    <div className="sensor-label">% 수위</div>
                </div>

                <div className="sensor-card">
                    <Icons.Scale />
                    <div className="sensor-value">{sensorData.weight}</div>
                    <div className="sensor-label">g 무게</div>
                </div>
            </div>
        </div>
    );
}

export default Environment;
