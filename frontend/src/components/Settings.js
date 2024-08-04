import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [titlePrompt, setTitlePrompt] = useState(''); // 初期値を空文字列に設定
  const [contentPrompt, setContentPrompt] = useState(''); // 初期値を空文字列に設定
  const [apiEndpoint, setApiEndpoint] = useState(''); // 初期値を空文字列に設定
  const [apiKey, setApiKey] = useState(''); // 初期値を空文字列に設定
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 設定を取得する
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:3030/settings');
        setTitlePrompt(response.data.title_prompt || ''); // 空白の場合は空文字列に設定
        setContentPrompt(response.data.content_prompt || ''); // 空白の場合は空文字列に設定
        setApiEndpoint(response.data.api_endpoint || ''); // 空白の場合は空文字列に設定
        setApiKey(response.data.api_key || ''); // 空白の場合は空文字列に設定
      } catch (error) {
        console.error('設定の取得中にエラーが発生しました:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3030/settings', {
        title_prompt: titlePrompt,
        content_prompt: contentPrompt,
        api_endpoint: apiEndpoint,
        api_key: apiKey
      });
      setMessage('設定が保存されました。');
    } catch (error) {
      console.error('設定の保存中にエラーが発生しました:', error);
      setMessage('設定の保存中にエラーが発生しました。');
    }
  };

  return (
    <div>
      <h2>設定ページ</h2>
      <div>
        <label>
          タイトルプロンプト:
          <input
            type="text"
            value={titlePrompt}
            onChange={(e) => setTitlePrompt(e.target.value || '')} // 空白の場合は空文字列に設定
            placeholder="どんなタイトルにしたいかを入力"
          />
        </label>
      </div>
      <div>
        <label>
          コンテンツプロンプト:
          <input
            type="text"
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value || '')} // 空白の場合は空文字列に設定
            placeholder="考慮してほしいことを入力"
          />
        </label>
      </div>
      <div>
        <label>
          APIエンドポイント:
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value || '')} // 空白の場合は空文字列に設定
            placeholder="APIエンドポイントを入力"
          />
        </label>
      </div>
      <div>
        <label>
          APIキー:
          <input
            type="password" // パスワードフィールドに変更
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value || '')} // 空白の場合は空文字列に設定
            placeholder="APIキーを入力"
          />
        </label>
      </div>
      <button onClick={handleSave}>保存</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Settings;