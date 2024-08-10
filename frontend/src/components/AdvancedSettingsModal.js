import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css'; // 既存のモーダルスタイルを再利用

const AdvancedSettingsModal = ({
  isOpen,
  onClose,
  apiEndpoint,
  setApiEndpoint,
  apiKey,
  setApiKey,
  variable1,
  setVariable1,
  variable2,
  setVariable2,
  variable3,
  setVariable3,
  variable4,
  setVariable4,
  variable5,
  setVariable5,
  keywordGeneratorUrl,
  setKeywordGeneratorUrl,
  xServerUrl,
  setXServerUrl,
  rakkokeywordUrl,
  setRakkokeywordUrl,
  fetchSettings,
  titlePrompt,
  setTitlePrompt,
  contentPrompt,
  setContentPrompt
}) => {
  const [successMessage, setSuccessMessage] = useState(''); // 成功メッセージの状態を追加
  const [errorMessage, setErrorMessage] = useState(''); // エラーメッセージの状態を追加

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/settings`, {
        api_endpoint: apiEndpoint,
        api_key: apiKey,
        variable1: variable1,
        variable2: variable2,
        variable3: variable3,
        variable4: variable4,
        variable5: variable5,
        keyword_generator_url: keywordGeneratorUrl,
        x_server_url: xServerUrl,
        rakkokeyword_url: rakkokeywordUrl
      });
      console.log('高度な設定が保存されました:', response.data);
      setSuccessMessage('設定が保存されました');

      // 親コンポーネントの状態を更新
      setApiEndpoint(apiEndpoint);
      setApiKey(apiKey);
      setVariable1(variable1);
      setVariable2(variable2);
      setVariable3(variable3);
      setVariable4(variable4);
      setVariable5(variable5);
      setKeywordGeneratorUrl(keywordGeneratorUrl);
      setXServerUrl(xServerUrl);
      setRakkokeywordUrl(rakkokeywordUrl);
      setTitlePrompt(titlePrompt); // 追加
      setContentPrompt(contentPrompt); // 追加

      // ここでfetchSettingsを呼び出す
      console.log('fetchSettingsを呼び出します。');
      await fetchSettings();

      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (error) {
      console.error('高度な設定の保存中にエラーが発生しました:', error);
      setErrorMessage('保存中にエラーが発生しました');
      setTimeout(() => setErrorMessage(''), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h1 style={{ color: 'black', fontWeight: 'bold', fontSize: 'larger' }}>特殊設定</h1>
        <div className="form-group">
          <label>
            キーワード生成URL
            <input
              type="text"
              value={keywordGeneratorUrl}
              onChange={(e) => setKeywordGeneratorUrl(e.target.value || '')}
              placeholder="キーワード生成のURLを入力"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            XサーバーURL
            <input
              type="text"
              value={xServerUrl}
              onChange={(e) => setXServerUrl(e.target.value || '')}
              placeholder="XサーバーのURLを入力"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            ラッコキーワードURL
            <input
              type="text"
              value={rakkokeywordUrl}
              onChange={(e) => setRakkokeywordUrl(e.target.value || '')}
              placeholder="ラッコキーワードのURLを入力"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Dify APIエンドポイント
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value || '')}
              placeholder="APIエンドポイントを入力"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Dify APIキー
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value || '')}
              placeholder="APIキーを入力"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            変数１（variable1）
            <textarea
              value={variable1}
              onChange={(e) => setVariable1(e.target.value || '')}
              placeholder="変数１を入力"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            変数２（variable2）
            <textarea
              value={variable2}
              onChange={(e) => setVariable2(e.target.value || '')}
              placeholder="変数２を入力"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            変数３（variable3）
            <textarea
              value={variable3}
              onChange={(e) => setVariable3(e.target.value || '')}
              placeholder="変数３を入力"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            変数４（variable4）
            <textarea
              value={variable4}
              onChange={(e) => setVariable4(e.target.value || '')}
              placeholder="変数４を入力"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            変数５（variable5）
            <textarea
              value={variable5}
              onChange={(e) => setVariable5(e.target.value || '')}
              placeholder="変数５を入力"
              rows="4"
              className="w-full p-2 border border-gray-300 rounded text-black"
            />
          </label>
        </div>
        <button onClick={handleSave} className="mt-4 p-2 bg-magic-blue text-white rounded hover:bg-magic-green">保存</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default AdvancedSettingsModal;