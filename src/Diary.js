import React from 'react';
import './Diary.css';
import diaryIllustration from './assets/diary.svg';
import puppyIcon from './assets/puppy_icon.png';
import paperTexture from './assets/paper_texture.png';

function Diary({ diaryResult, isGenerating, onGenerateDiary, onBack, onNavigate }) {
  return (
    <div className="diary-screen">
      {/* Background */}
      <div className="background"></div>

      {/* Main과 동일한 종이 배경 + 질감 + 구멍 4개 */}
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

      {/* 콘텐츠(위에서 시작하도록 배치) */}
      <div className="diary-content-area">
        <button className="back-btn" onClick={onBack}>
          ← 뒤로
        </button>

        <h1 className="diary-title">📔 그림일기</h1>

        <button
          className="generate-btn"
          onClick={onGenerateDiary}
          disabled={isGenerating}
        >
          {isGenerating ? 'AI가 일기 쓰는 중...' : '일기 생성하기'}
        </button>

        {diaryResult && (
          <div className="diary-result">
            <h3>📅 {diaryResult.date}</h3>

            {diaryResult.dataSource && (
              <div
                className={`diary-source ${
                  diaryResult.dataSource === '실시간 센서' ? 'live' : 'fallback'
                }`}
              >
                {diaryResult.dataSource === '실시간 센서' ? '📡' : '📋'}{' '}
                {diaryResult.dataSource} 사용
              </div>
            )}

            {diaryResult.image && (
              <img src={diaryResult.image} className="diary-image" alt="일기 그림" />
            )}

            <div className="diary-paper">{diaryResult.text}</div>
          </div>
        )}
      </div>

      {/* Illustration */}
      <div className="diary-illustration-container">
        <img src={diaryIllustration} alt="그림일기" className="diary-illustration" />
      </div>

      {/* Right Menu */}
      <div className="menu">
        <button className="menu-button menu-environment" onClick={() => onNavigate('environment')}>
          환경
        </button>
        <button className="menu-button menu-diary">
          일기
        </button>
        <button className="menu-button menu-settings" onClick={() => onNavigate('settings')}>
          설정
        </button>
      </div>

      {/* Bottom Logo (png 사용) */}
      <div className="logo">
        <img src={puppyIcon} alt="강아지 발바닥 로고" className="logo-icon" />
        <span className="logo-text">재롱이</span>
      </div>
    </div>
  );
}

export default Diary;
