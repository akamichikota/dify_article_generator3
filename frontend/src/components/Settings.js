import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = ({ fetchSettings }) => {
  const [titlePrompt, setTitlePrompt] = useState(''); // 初期値を空文字列に設定
  const [contentPrompt, setContentPrompt] = useState(''); // 初期値を空文字列に設定
  const [apiEndpoint, setApiEndpoint] = useState(''); // 初期値を空文字列に設定
  const [apiKey, setApiKey] = useState(''); // 初期値を空文字列に設定
  const [wordpressUsername, setWordpressUsername] = useState(''); // WordPressユーザー名
  const [applicationPassword, setApplicationPassword] = useState(''); // アプリケーションパスワード
  const [siteUrl, setSiteUrl] = useState(''); // サイトURL
  const [variable1, setVariable1] = useState(''); // 初期値を空文字列に設定
  const [variable2, setVariable2] = useState(''); // 初期値を空文字列に設定
  const [message, setMessage] = useState('');
  const [keywordGeneratorUrl, setKeywordGeneratorUrl] = useState(''); // : キーワード生成URLの状態
  const [xServerUrl, setXServerUrl] = useState(''); // 追加: XサーバーURLの状態
  const [rakkokeywordUrl, setRakkokeywordUrl] = useState(''); // 追加: ラッコキーワードURLの状態

  useEffect(() => {
    // ローカルストレージから設定を取得
    const storedSettings = {
      title_prompt: localStorage.getItem('title_prompt') || '',
      content_prompt: localStorage.getItem('content_prompt') || '',
      api_endpoint: localStorage.getItem('api_endpoint') || '',
      api_key: localStorage.getItem('api_key') || '',
      wordpress_username: localStorage.getItem('wordpress_username') || '',
      application_password: localStorage.getItem('application_password') || '',
      siteurl: localStorage.getItem('siteurl') || '',
      variable1: localStorage.getItem('variable1') || '',
      variable2: localStorage.getItem('variable2') || '',
      keyword_generator_url: localStorage.getItem('keyword_generator_url') || '',
      x_server_url: localStorage.getItem('x_server_url') || '',
      rakkokeyword_url: localStorage.getItem('rakkokeyword_url') || '',
    };

    setTitlePrompt(storedSettings.title_prompt);
    setContentPrompt(storedSettings.content_prompt);
    setApiEndpoint(storedSettings.api_endpoint);
    setApiKey(storedSettings.api_key);
    setWordpressUsername(storedSettings.wordpress_username);
    setApplicationPassword(storedSettings.application_password);
    setSiteUrl(storedSettings.siteurl);
    setVariable1(storedSettings.variable1);
    setVariable2(storedSettings.variable2);
    setKeywordGeneratorUrl(storedSettings.keyword_generator_url);
    setXServerUrl(storedSettings.x_server_url);
    setRakkokeywordUrl(storedSettings.rakkokeyword_url);
  }, []);

  const handleSave = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/settings`, {
        title_prompt: titlePrompt,
        content_prompt: contentPrompt,
        api_endpoint: apiEndpoint,
        api_key: apiKey,
        wordpress_username: wordpressUsername, // WordPressユーザー名を送信
        application_password: applicationPassword, // アプリケーションパスワードを送信
        siteurl: siteUrl, // サイトURLを送信
        variable1: variable1,
        variable2: variable2,
        keyword_generator_url: keywordGeneratorUrl,
        x_server_url: xServerUrl,
        rakkokeyword_url: rakkokeywordUrl
      });

      // 設定をローカルストレージに保存
      localStorage.setItem('title_prompt', titlePrompt);
      localStorage.setItem('content_prompt', contentPrompt);
      localStorage.setItem('api_endpoint', apiEndpoint);
      localStorage.setItem('api_key', apiKey);
      localStorage.setItem('wordpress_username', wordpressUsername);
      localStorage.setItem('application_password', applicationPassword);
      localStorage.setItem('siteurl', siteUrl);
      localStorage.setItem('variable1', variable1);
      localStorage.setItem('variable2', variable2);
      localStorage.setItem('keyword_generator_url', keywordGeneratorUrl);
      localStorage.setItem('x_server_url', xServerUrl);
      localStorage.setItem('rakkokeyword_url', rakkokeywordUrl);

      // 設定が保存された後に最新の設定を取得
      console.log('設定が保存されました。fetchSettingsを呼び出します。');
      await fetchSettings(); // これを追加

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
      <p className="text-left text-2xl mb-4 mt-4">基本設定</p>
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
      <div className="form-group">
        <label>
          WordPressユーザー名
          <textarea
            value={wordpressUsername}
            onChange={(e) => setWordpressUsername(e.target.value || '')}
            placeholder="WordPressユーザー名を入力"
            rows="1"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          WordPressアプリケーションパスワード
          <textarea
            value={applicationPassword}
            onChange={(e) => setApplicationPassword(e.target.value || '')}
            placeholder="WordPressのアプリケーションパスワードを入力"
            rows="1"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          WordPressサイトURL
          <textarea
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value || '')}
            placeholder="WordPressサイトURLを入力"
            rows="1"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="flex justify-center">
        <button onClick={handleSave} className="px-4 py-2 bg-magic-blue text-white rounded hover:bg-magic-green">保存</button>
      </div>
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
      
      <p className="text-left text-2xl mb-4 mt-4">高度な設定</p>
      <div className="form-group">
        <label>
          Dify APIエンドポイント
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value || '')}
            placeholder="DifyのAPIエンドポイントを入力"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Dify APIキー
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value || '')}
            placeholder="DifyのAPIキーを入力"
            className="w-full p-2 border border-gray-300 rounded text-black"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          変数１
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
          変数２
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
      <div className="flex justify-center">
        <button onClick={handleSave} className="px-4 py-2 bg-magic-blue text-white rounded hover:bg-magic-green">保存</button>
      </div>
      {message && <p className="mt-4 text-green-500 text-center">{message}</p>}
    </div>
  );
};

export default Settings;