import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ArticleGenerator from './components/ArticleGenerator';
import Settings from './components/Settings';
import axios from 'axios';

function App() {
  const [keywordGeneratorUrl, setKeywordGeneratorUrl] = useState('https://chatgpt.com/g/g-VnqYVwsJ6-kiwatosheng-cheng');
  const [xServerUrl, setXServerUrl] = useState('https://www.xserver.ne.jp');
  const [rakkokeywordUrl, setRakkokeywordUrl] = useState('https://rakkokeyword.com');

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
      setKeywordGeneratorUrl(response.data.keyword_generator_url || 'https://chatgpt.com/g/g-VnqYVwsJ6-kiwatosheng-cheng');
      setXServerUrl(response.data.x_server_url || 'https://www.xserver.ne.jp');
      setRakkokeywordUrl(response.data.rakkokeyword_url || 'https://rakkokeyword.com');
    } catch (error) {
      console.error('設定の取得中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="App bg-dark-bg text-white min-h-screen">
      <header className="App-header bg-magic-blue p-4 flex justify-between items-center">
        <h1 className="text-4xl font-roboto">Article Generator</h1>
        <nav className="mt-4">
          <Link to="/" className="text-lg mx-2 hover:text-magic-green">記事生成</Link>
          <Link to="/settings" className="text-lg mx-2 hover:text-magic-green">プロンプト設定</Link>
          <a href={rakkokeywordUrl} target="_blank" rel="noopener noreferrer" className="text-lg mx-2 hover:text-magic-green">ラッコキーワード</a>
          <a href={xServerUrl} target="_blank" rel="noopener noreferrer" className="text-lg mx-2 hover:text-magic-green">Xサーバー</a>
          <a href={keywordGeneratorUrl} target="_blank" rel="noopener noreferrer" className="text-lg mx-2 hover:text-magic-green">キーワード生成</a>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ArticleGenerator />} />
          <Route path="/settings" element={<Settings 
            setKeywordGeneratorUrl={setKeywordGeneratorUrl}
            setXServerUrl={setXServerUrl}
            setRakkokeywordUrl={setRakkokeywordUrl}
            fetchSettings={fetchSettings}
          />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;