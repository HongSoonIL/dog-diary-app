import React from 'react';
import './Diary.css';

function Diary({ diaryResult, isGenerating, onGenerateDiary, onBack, onNavigate }) {
    return (
        <div className="diary-screen">

            {/* 화면 전체(diary-screen)를 기준으로 위치 선정. */}
            <div className="menu">
                <button className="menu-button menu-environment" onClick={() => onNavigate('environment')}>환경</button>
                <button className="menu-button menu-diary">일기</button>
                <button className="menu-button menu-settings" onClick={() => onNavigate('settings')}>설정</button>
            </div>

            {/* 2. 헤더 영역 */}
            <div className="diary-header">
            </div>
            <div>
                <h1>📔 그림일기</h1>
            </div>

            {/* 3. 콘텐츠 영역 */}
            <div className="diary-content">
                <button className="back-btn" onClick={onBack}>
                    ← 뒤로
                </button>
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
                        {diaryResult.image && (
                            <img src={diaryResult.image} className="diary-image" alt="일기 그림" />
                        )}
                        <div className="diary-paper">{diaryResult.text}</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Diary;