import React from 'react';
import './main.css';
import mainIllustration from './assets/main_img.png';

function Main({ isConnected, isConnecting, onConnect, onNavigate }) {
    return (
        <div className="macbook-pro">
            {/* Background */}
            <div className="background"></div>

            {/* Main Content Area */}
            <div className="content-area">
                {/* Title Section */}
                <div className="title-section">
                    <h1 className="main-title-text">
                        당신의 가족을 위한
                        <br />
                        가장 따뜻한 돌봄
                    </h1>
                    <p className="subtitle-text">
                        우리의 곁에서 오래도록 건강하게
                    </p>
                </div>

                {/* 시작하기 버튼 */}
                {/* 1. 두 요소를 감싸는 부모 상자 (나란히 배치를 위해) */}
                <div className="button-group">

                    {/* ▼▼▼ 1. 블루투스 부분을 먼저 적습니다 (왼쪽으로 감) ▼▼▼ */}
                    <div className="bluetooth-wrapper">
                        {!isConnected ? (
                            <button className="bluetooth-connect-btn" onClick={onConnect} disabled={isConnecting}>
                                {isConnecting ? '📡 연결 중...' : '📡 센서 연결하기'}
                            </button>
                        ) : (
                            <span className="connected-indicator">
                                ✓ 센서 연결됨
                            </span>
                        )}
                    </div>

                    {/* ▼▼▼ 2. 시작하기 버튼을 나중에 적습니다 (오른쪽으로 감) ▼▼▼ */}
                    <button className="start-button" onClick={() => onNavigate('environment')}>
                        시작하기
                    </button>

                </div>
            </div>

            {/* Central Logo */}
            <div className="central-logo">
                <h2 className="central-logo-text">재롱이</h2>
                <span className="central-logo-icon">🐾</span>
            </div>

            {/* Illustration (Absolute Positioned) */}
            <div className="illustration-container">
                <img src={mainIllustration} alt="할머니와 강아지" className="main-illustration" />
            </div>

            {/* Right Side Navigation Menu */}
            <div className="menu">
                <button
                    className="menu-button menu-environment"
                    onClick={() => onNavigate('environment')}
                >
                    환경
                </button>
                <button
                    className="menu-button menu-diary"
                    onClick={() => onNavigate('diary')}
                >
                    일기
                </button>
                <button
                    className="menu-button menu-settings"
                    onClick={() => onNavigate('settings')}
                >
                    설정
                </button>
            </div>

            {/* Logo - Bottom Right */}
            <div className="logo">
                <span className="logo-icon">🐾</span>
                <span className="logo-text">재롱이</span>
            </div>
        </div>
    );
}

export default Main;
