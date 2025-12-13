import React from 'react';
import './Diary.css';

function Diary({ diaryResult, isGenerating, onGenerateDiary, onBack }) {
    return (
        <div className="diary-screen">
            <div className="diary-header">
                <button className="back-btn" onClick={onBack}>
                    ← 뒤로
                </button>
                <h1>📔 그림일기</h1>
            </div>

            <div className="diary-content">
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
