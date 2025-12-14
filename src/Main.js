import React from 'react';
import './main.css';
import mainIllustration from './assets/main.png';
import puppyIcon from './assets/puppy_icon.png';
import paperTexture from './assets/paper_texture.png';

function Main({ isConnected, isConnecting, onConnect, onNavigate }) {
  return (
    <div className="macbook-pro">
      {/* Background */}
      <div className="background"></div>

      <div className="left-note-paper">
        {/* 종이 질감 오버레이 */}
        <div
          className="texture-overlay"
          style={{ backgroundImage: `url(${paperTexture})` }}
        ></div>

        {/* 노트구멍 4개 */}
        <div className="hole-container">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="content-area">
        <div className="title-section">
          <h1 className="main-title-text">
            당신의 가족을 위한
            <br />
            가장 따뜻한 돌봄
          </h1>
          <p className="subtitle-text">우리의 곁에서 오래도록 건강하게</p>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button
            className="start-button"
            onClick={() => onNavigate('environment')}
          >
            시작하기
          </button>

          <div className="bluetooth-wrapper">
            {!isConnected ? (
              <button
                className="bluetooth-connect-btn"
                onClick={onConnect}
                disabled={isConnecting}
              >
                {isConnecting ? '연결 중...' : '센서 연결하기'}
              </button>
            ) : (
              <span className="connected-indicator">✓ 센서 연결됨</span>
            )}
          </div>
        </div>
      </div>

      {/* Central Floating Logo */}
      <div className="central-logo">
        <h2 className="central-logo-text">재롱이</h2>

        <div className="paw-wrapper">
          <img
            src={puppyIcon}
            alt="강아지 발바닥 로고"
            className="central-logo-icon"
          />
        </div>
      </div>

      {/* Illustration */}
      <div className="illustration-container">
        <img
          src={mainIllustration}
          alt="할머니와 강아지"
          className="main-illustration"
        />
      </div>

      {/* Right Menu */}
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

      {/* Bottom Right Logo */}
      <div className="logo">
        <img
          src={puppyIcon}
          alt="강아지 발바닥 로고"
          className="logo-icon"
        />
        <span className="logo-text">재롱이</span>
      </div>
    </div>
  );
}

export default Main;
