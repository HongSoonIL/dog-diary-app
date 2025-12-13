import React from 'react';
import './Settings.css';

function Settings({ onBack }) {
    const [dogInfo, setDogInfo] = useState({
        name: '',
        age: '',
        breed: '',
        weight: ''
    });

    const handleChange = (e) => {
        setDogInfo({
            ...dogInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        // TODO: 강아지 정보 저장 로직
        alert('강아지 정보가 저장되었습니다!');
    };

    return (
        <div className="settings-screen">
            <div className="settings-header">
                <button className="back-btn" onClick={onBack}>
                    ← 뒤로
                </button>
                <h1>⚙️ 설정</h1>
            </div>

            <div className="settings-content">
                <div className="settings-card">
                    <h2>🐕 강아지 정보</h2>

                    <div className="form-group">
                        <label>이름</label>
                        <input
                            type="text"
                            name="name"
                            value={dogInfo.name}
                            onChange={handleChange}
                            placeholder="강아지 이름을 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>나이</label>
                        <input
                            type="number"
                            name="age"
                            value={dogInfo.age}
                            onChange={handleChange}
                            placeholder="나이 (년)"
                        />
                    </div>

                    <div className="form-group">
                        <label>품종</label>
                        <input
                            type="text"
                            name="breed"
                            value={dogInfo.breed}
                            onChange={handleChange}
                            placeholder="품종을 입력하세요"
                        />
                    </div>

                    <div className="form-group">
                        <label>몸무게</label>
                        <input
                            type="number"
                            name="weight"
                            value={dogInfo.weight}
                            onChange={handleChange}
                            placeholder="몸무게 (kg)"
                        />
                    </div>

                    <button className="save-btn" onClick={handleSave}>
                        💾 저장하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
