import React, { useState, useEffect, useRef } from 'react';
import './Settings.css';
import defaultProfileImg from './assets/profile.png';
import paperTexture from './assets/paper_texture.png';
import puppyIcon from './assets/puppy_icon.png';


function Settings({ onBack, onNavigate }) {
    const fileInputRef = useRef(null);
    const [petInfo, setPetInfo] = useState({
        name: '', age: '', gender: '', dDay: '',
        breed: '', foodAmount: '', waterAmount: '', allergy: '',
        profileImage: null
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('petSettingsData');
        if (savedData) {
            setPetInfo(JSON.parse(savedData));
            setIsSaved(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPetInfo(prev => ({ ...prev, profileImage: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        if (!isSaved) fileInputRef.current.click();
    };

    const handleSave = () => {
        if (!petInfo.name) { alert('이름은 필수입니다!'); return; }
        localStorage.setItem('petSettingsData', JSON.stringify(petInfo));
        setIsSaved(true);
    };

    const handleReset = () => {
        if (window.confirm('초기화 하시겠습니까?')) {
            localStorage.removeItem('petSettingsData');
            setPetInfo({
                name: '', age: '', gender: '', dDay: '',
                breed: '', foodAmount: '', waterAmount: '', allergy: '',
                profileImage: null
            });
            setIsSaved(false);
        }
    };

    const handleEdit = () => { setIsSaved(false); };

    return (


        <div className="settings-screen">
            {/* ✅ [추가] 메인과 동일한 종이 배경 레이어 */}
            <div className="settings-paper-bg">
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


            {/* 뒤로가기 버튼 */}
            <button className="back-btn" onClick={onBack}>
                ← 뒤로
            </button>

            {/* [수정됨] 오른쪽 사이드 메뉴 (세로형) */}
            <div className="menu">
                <button className="menu-button menu-environment" onClick={() => onNavigate('environment')}>환경</button>
                <button className="menu-button menu-diary" onClick={() => onNavigate('diary')}>일기</button>
                <button className="menu-button menu-settings">설정</button>
            </div>
            {/* Bottom Right Logo (Main과 동일) */}
            <div className="logo">
                <img src={puppyIcon} alt="강아지 발바닥 로고" className="logo-icon" />
                <span className="logo-text">재롱이</span>
            </div>


            {/* 메인 컨텐츠 */}
            <div className="settings-content">
                <div className="settings-card">
                    <div className="settings-header-section">
                        <div className={`settings-img-wrapper ${!isSaved ? 'editable' : ''}`} onClick={handleImageClick}>
                            <img src={petInfo.profileImage || defaultProfileImg} alt="프로필" />
                            {!isSaved && <div className="img-overlay">📷 변경</div>}
                        </div>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />

                        <div className="settings-summary">
                            {isSaved ? (
                                <>
                                    <h1>{petInfo.name}</h1>
                                    <p className="sub-text">({petInfo.age || '-'} / {petInfo.gender || '-'})</p>
                                    <p className="d-day-text">D+{petInfo.dDay}</p>
                                    <div className="btn-group">
                                        <button className="edit-btn secondary" onClick={handleEdit}>✎ 수정</button>
                                        <button className="edit-btn danger" onClick={handleReset}>↻ 초기화</button>
                                    </div>
                                </>
                            ) : (
                                <div className="input-group-header">
                                    <input type="text" name="name" placeholder="이름" value={petInfo.name} onChange={handleChange} className="input-large" />
                                    <div className="input-row">
                                        <input type="text" name="age" placeholder="나이" value={petInfo.age} onChange={handleChange} className="input-small" />
                                        <input type="text" name="gender" placeholder="성별" value={petInfo.gender} onChange={handleChange} className="input-small" />
                                    </div>
                                    <input type="number" name="dDay" placeholder="함께한 날짜" value={petInfo.dDay} onChange={handleChange} className="input-medium" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="info-grid">
                        <div className="info-group">
                            <label>종</label>
                            {isSaved ? <div className="info-value">{petInfo.breed || '-'}</div> :
                                <input type="text" name="breed" className="info-input" placeholder="예: 시고르자브종" value={petInfo.breed} onChange={handleChange} />}
                        </div>
                        <div className="info-group">
                            <label>평균 밥 섭취량</label>
                            {isSaved ? <div className="info-value">{petInfo.foodAmount || '-'}</div> :
                                <input type="text" name="foodAmount" className="info-input" placeholder="예: 500g" value={petInfo.foodAmount} onChange={handleChange} />}
                        </div>
                        <div className="info-group">
                            <label>평균 물 음수량</label>
                            {isSaved ? <div className="info-value">{petInfo.waterAmount || '-'}</div> :
                                <input type="text" name="waterAmount" className="info-input" placeholder="예: 1.2L" value={petInfo.waterAmount} onChange={handleChange} />}
                        </div>
                        <div className="info-group">
                            <label>알러지</label>
                            {isSaved ? <div className="info-value">{petInfo.allergy || '-'}</div> :
                                <input type="text" name="allergy" className="info-input" placeholder="예: 고양이털, 토마토" value={petInfo.allergy} onChange={handleChange} />}
                        </div>
                    </div>

                    {!isSaved && (
                        <div className="save-section">
                            <button className="save-btn-large" onClick={handleSave}>💾 저장하기</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;