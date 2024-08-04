import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [titlePrompt, setTitlePrompt] = useState('');
  const [contentPrompt, setContentPrompt] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 設定を取得する
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:3030/settings');
        setTitlePrompt(response.data.title_prompt);
        setContentPrompt(response.data.content_prompt);
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
        content_prompt: contentPrompt
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
            onChange={(e) => setTitlePrompt(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          コンテンツプロンプト:
          <input
            type="text"
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleSave}>保存</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Settings;