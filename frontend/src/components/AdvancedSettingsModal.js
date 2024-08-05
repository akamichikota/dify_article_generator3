import React from 'react';
import axios from 'axios';
import './Modal.css'; // 既存のモーダルスタイルを再利用

const AdvancedSettingsModal = ({ isOpen, onClose, apiEndpoint, setApiEndpoint, apiKey, setApiKey, variable1, setVariable1, variable2, setVariable2, variable3, setVariable3, variable4, setVariable4, variable5, setVariable5 }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3030/settings', {
        api_endpoint: apiEndpoint,
        api_key: apiKey,
        variable1: variable1,
        variable2: variable2,
        variable3: variable3,
        variable4: variable4,
        variable5: variable5
      });
      console.log('高度な設定が保存されました:', response.data);
      onClose();
    } catch (error) {
      console.error('高度な設定の保存中にエラーが発生しました:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>高度な設定</h2>
        <div>
          <label>
            APIエンドポイント:
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value || '')}
              placeholder="APIエンドポイントを入力"
            />
          </label>
        </div>
        <div>
          <label>
            APIキー:
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value || '')}
              placeholder="APIキーを入力"
            />
          </label>
        </div>
        <div>
          <label>
            変数１:
            <textarea
              value={variable1}
              onChange={(e) => setVariable1(e.target.value || '')}
              placeholder="変数１を入力"
              rows="4"
              cols="50"
            />
          </label>
        </div>
        <div>
          <label>
            変数２:
            <textarea
              value={variable2}
              onChange={(e) => setVariable2(e.target.value || '')}
              placeholder="変数２を入力"
              rows="4"
              cols="50"
            />
          </label>
        </div>
        <div>
          <label>
            変数３:
            <textarea
              value={variable3}
              onChange={(e) => setVariable3(e.target.value || '')}
              placeholder="変数３を入力"
              rows="4"
              cols="50"
            />
          </label>
        </div>
        <div>
          <label>
            変数４:
            <textarea
              value={variable4}
              onChange={(e) => setVariable4(e.target.value || '')}
              placeholder="変数４を入力"
              rows="4"
              cols="50"
            />
          </label>
        </div>
        <div>
          <label>
            変数５:
            <textarea
              value={variable5}
              onChange={(e) => setVariable5(e.target.value || '')}
              placeholder="変数５を入力"
              rows="4"
              cols="50"
            />
          </label>
        </div>
        <button onClick={handleSave}>保存</button>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default AdvancedSettingsModal;