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
  const [keywordGeneratorUrl, setKeywordGeneratorUrl] = useState(''); // 追加: キーワード生成URLの状態
  const [xServerUrl, setXServerUrl] = useState(''); // 追加: XサーバーURLの状態
  const [rakkokeywordUrl, setRakkokeywordUrl] = useState(''); // 追加: ラッコキーワードURLの状態

  useEffect(() => {
    // 設定を取得する
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
        setTitlePrompt(response.data.title_prompt || ''); // 空白の場合は空文字列に設定
        setContentPrompt(response.data.content_prompt || ''); // 空白の場合は空文字列に設定
        setApiEndpoint(response.data.api_endpoint || ''); // 空白の場合は空文字列に設定
        setApiKey(response.data.api_key || ''); // 空白の場合は空文字列に設定
        setVariable1(response.data.variable1 || ''); // 空白の場合は空文字列に設定
        setVariable2(response.data.variable2 || ''); // 空白の場合は空文字列に設定
        setVariable3(response.data.variable3 || ''); // 空白の場合は空文字列に設定
        setVariable4(response.data.variable4 || ''); // 空白の場合は空文字列に設定
        setVariable5(response.data.variable5 || ''); // 空白の場合は空文字列に設定
        setKeywordGeneratorUrl(response.data.keyword_generator_url || ''); // 追加: キーワード生成URLを設定
        setXServerUrl(response.data.x_server_url || ''); // 追加: XサーバーURLを設定
        setRakkokeywordUrl(response.data.rakkokeyword_url || ''); // 追加: ラッコキーワードURLを設定
      } catch (error) {
        console.error('設定の取得中にエラーが発生しました:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/settings`, {
        title_prompt: titlePrompt,
        content_prompt: contentPrompt,
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

      // 設定が保存された後にURLを更新
      setKeywordGeneratorUrl(keywordGeneratorUrl);
      setXServerUrl(xServerUrl);
      setRakkokeywordUrl(rakkokeywordUrl);

      setMessage('設定が保存されました');
      setTimeout(() => setMessage(''), 2000);
    } catch (error) {
      console.error('設定の保存中にエラーが発生しました:', error);
      setMessage('設定の保存中にエラーが発生しました');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block">
          タイトル生成プロンプト
          <textarea
            value={titlePrompt}
            onChange={(e) => setTitlePrompt(e.target.value || '')}
            placeholder="どんなタイトルにしたいかを入力"
            rows="4"
            cols="50"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="mb-4">
        <label className="block">
          記事生成プロンプト
          <textarea
            value={contentPrompt}
            onChange={(e) => setContentPrompt(e.target.value || '')}
            placeholder="記事生成において考慮してほしいことを入力"
            rows="4"
            cols="50"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="flex justify-between">
        <span className="p-2 bg-transparent border-none text-transparent" style={{ cursor: 'default' }}>　　　　</span>
        <button onClick={handleSave} className="px-4 py-2 bg-magic-blue text-white rounded hover:bg-magic-green">保存</button>
        <button onClick={() => setIsModalOpen(true)} className="p-2 bg-gray-500 text-white rounded hover:bg-gray-700">特殊設定</button>
      </div>
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
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
        keywordGeneratorUrl={keywordGeneratorUrl}
        setKeywordGeneratorUrl={setKeywordGeneratorUrl}
        xServerUrl={xServerUrl}
        setXServerUrl={setXServerUrl}
        rakkokeywordUrl={rakkokeywordUrl}
        setRakkokeywordUrl={setRakkokeywordUrl}
      />
    </div>
  );
};

export default Settings;