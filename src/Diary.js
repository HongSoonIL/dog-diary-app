import React from 'react';
import './Diary.css';

import diaryIllustration from './assets/diary.svg';
import puppyIcon from './assets/puppy_icon.png';
import paperTexture from './assets/paper_texture.png';

function Diary({
  diaryResult,
  isGenerating,
  onGenerateDiary,
  onBack,
  onNavigate,
}) {
  return (
    <div className="diary-screen">
      {/* Background */}
      <div className="background" />

      {/* 종이 배경 */}
      <div className="left-note-paper">
        <div
          className="texture-overlay"
          style={{ backgroundImage: `url(${paperTexture})` }}
        />
        <div className="hole-container">
          <div className="hole" />
          <div className="hole" />
          <div className="hole" />
          <div className="hole" />
        </div>
      </div>
      <button className="back-btn" onClick={onBack}>
              뒤로가기
            </button>

      {/* ===== 메인 레이아웃 ===== */}
      <div className="diary-layout">
        {/* ===== 왼쪽: 텍스트 영역 ===== */}
        <div className="diary-text-area">
          <h1 className="diary-title">📔 그림일기</h1>

          {/* 버튼들 */}
          <div className="diary-button-group">
            <button
              className="generate-btn"
              onClick={onGenerateDiary}
              disabled={isGenerating}
            >
              {isGenerating ? '일기 생성 중...' : '일기 생성하기'}
            </button>

            
          </div>

          {/* 텍스트 결과 */}
          {diaryResult && (
            <div className="diary-paper">
              {diaryResult.text}
            </div>
          )}
        </div>

        {/* ===== 오른쪽: 이미지 영역 ===== */}
        <div className="diary-image-area">
          <img
            src={diaryResult?.image || diaryIllustration}
            alt="그림일기 이미지"
          />
        </div>
      </div>

      {/* ===== 오른쪽 메뉴 ===== */}
      <div className="menu">
        <button
          className="menu-button menu-environment"
          onClick={() => onNavigate('environment')}
        >
          환경
        </button>
        <button className="menu-button menu-diary">
          일기
        </button>
        <button
          className="menu-button menu-settings"
          onClick={() => onNavigate('settings')}
        >
          설정
        </button>
      </div>

      {/* ===== 하단 로고 ===== */}
      <div className="logo">
        <img
          src={puppyIcon}
          alt="강아지 로고"
          className="logo-icon"
        />
        <span className="logo-text">재롱이</span>
      </div>
    </div>
  );
}

export default Diary;
