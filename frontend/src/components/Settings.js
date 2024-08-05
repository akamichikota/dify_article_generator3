import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdvancedSettingsModal from './AdvancedSettingsModal';

const Settings = () => {
  const [titlePrompt, setTitlePrompt] = useState(''); // 初期値を空文字列に設定
  const [contentPrompt, setContentPrompt] = useState(''); // 初期値を空文字列に設定
  const [apiEndpoint, setApiEndpoint] = useState(''); // 初期値を空文字列に設定
  const [apiKey, setApiKey] = useState(''); // 初期値を空文字列に設定
  const [variable1, setVariable1] = useState(''); // 初期値を空文字列に設定
  const [variable2, setVariable2] = useState(''); // 初期値を空文字列に設定
  const [variable3, setVariable3] = useState(''); // 初期値を空文字列に設定
  const [variable4, setVariable4] = useState(''); // 初期値を空文字列に設定
  const [variable5, setVariable5] = useState(''); // 初期値を空文字列に設定
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 設定を取得する
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:3030/settings');
        setTitlePrompt(response.data.title_prompt || ''); // 空白の場合は空文字列に設定
        setContentPrompt(response.data.content_prompt || ''); // 空白の場合は空文字列に設定
        setApiEndpoint(response.data.api_endpoint || ''); // 空白の場合は空文字列に設定
        setApiKey(response.data.api_key || ''); // 空白の場合は空文字列に設定
        setVariable1(response.data.variable1 || ''); // 空白の場合は空文字列に設定
        setVariable2(response.data.variable2 || ''); // 空白の場合は空文字列に設定
        setVariable3(response.data.variable3 || ''); // 空白の場合は空文字列に設定
        setVariable4(response.data.variable4 || ''); // 空白の場合は空文字列に設定
        setVariable5(response.data.variable5 || ''); // 空白の場合は空文字列に設定
      } catch (error) {
        console.error('設定の取得中にエラーが発生しました:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      console.log('Saving settings:', {
        title_prompt: titlePrompt,
        content_prompt: contentPrompt,
        api_endpoint: apiEndpoint,
        api_key: apiKey,
        variable1: variable1,
        variable2: variable2,
        variable3: variable3,
        variable4: variable4,
        variable5: variable5
      });
      const response = await axios.post('http://localhost:3030/settings', {
        title_prompt: titlePrompt,
        content_prompt: contentPrompt,
        api_endpoint: apiEndpoint,
        api_key: apiKey,
        variable1: variable1,
        variable2: variable2,
        variable3: variable3,
        variable4: variable4,
        variable5: variable5
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
          <textarea
            value={titlePrompt}
            onChange={(e) => setTitlePrompt(e.target.value || '')} // 空白の場合は空文字列に設定
            placeholder="どんなタイトルにしたいかを入力"
            rows="4" // 必要に応じて行数を調整
            cols="50" // 必要に応じて列数を調整
          />
        </label>
      </div>
      <div>
        <label>
          コンテンツプロンプト:
          <textarea
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value || '')} // 空白の場合は空文字列に設定
            placeholder="考慮してほしいことを入力"
            rows="4" // 必要に応じて行数を調整
            cols="50" // 必要に応じて列数を調整
          />
        </label>
      </div>
      <button onClick={handleSave}>保存</button>
      <button onClick={() => setIsModalOpen(true)}>高度な設定</button>
      {message && <p>{message}</p>}
      <AdvancedSettingsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        apiEndpoint={apiEndpoint}
        setApiEndpoint={setApiEndpoint}
        apiKey={apiKey}
        setApiKey={setApiKey}
        variable1={variable1}
        setVariable1={setVariable1}
        variable2={variable2}
        setVariable2={setVariable2}
        variable3={variable3}
        setVariable3={setVariable3}
        variable4={variable4}
        setVariable4={setVariable4}
        variable5={variable5}
        setVariable5={setVariable5}
      />
    </div>
  );
};

export default Settings;