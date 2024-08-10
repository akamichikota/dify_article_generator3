import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ArticleGenerator from './components/ArticleGenerator';
import Settings from './components/Settings';
import axios from 'axios';

function App() {
  const [keywordGeneratorUrl, setKeywordGeneratorUrl] = useState('https://chatgpt.com/g/g-VnqYVwsJ6-kiwatosheng-cheng');
  const [xServerUrl, setXServerUrl] = useState('https://www.xserver.ne.jp');
  const [rakkokeywordUrl, setRakkokeywordUrl] = useState('https://rakkokeyword.com');
  const [wordpressUrl, setWordpressUrl] = useState(''); // Added: WordPress site URL state

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
      setKeywordGeneratorUrl(response.data.keyword_generator_url || 'https://chatgpt.com/g/g-VnqYVwsJ6-kiwatosheng-cheng');
      setXServerUrl(response.data.x_server_url || 'https://www.xserver.ne.jp');
      setRakkokeywordUrl(response.data.rakkokeyword_url || 'https://rakkokeyword.com');
      setWordpressUrl(response.data.siteurl || ''); // Added: Get WordPress site URL
    } catch (error) {
      console.error('設定の取得中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="App bg-dark-bg text-white min-h-screen flex">
      <aside className="w-1/4 bg-gray-800 p-6">
        <h1 className="text-3xl font-roboto mb-6">Auto Generator</h1>
        <nav className="mt-4">
          <h2 className="text-lg font-bold mb-2">メニュー</h2>
          <Link to="/" className="block text-lg mx-2 my-1 hover:text-magic-green">記事生成</Link>
          <Link to="/settings" className="block text-lg mx-2 my-1 hover:text-magic-green">設定</Link>
          <h2 className="text-lg font-bold mt-6 mb-2">外部リンク</h2>
          <a href={rakkokeywordUrl} target="_blank" rel="noopener noreferrer" className="block text-lg mx-2 my-1 hover:text-magic-green">ラッコキーワード</a>
          <a href={xServerUrl} target="_blank" rel="noopener noreferrer" className="block text-lg mx-2 my-1 hover:text-magic-green">Xサーバー</a>
          <a href={wordpressUrl} target="_blank" rel="noopener noreferrer" className="block text-lg mx-2 my-1 hover:text-magic-green">WordPressサイト</a> {/* Added: WordPress site link */}
          <a href={keywordGeneratorUrl} target="_blank" rel="noopener noreferrer" className="block text-lg mx-2 my-1 hover:text-magic-green">キーワード生成</a>
        </nav>
      </aside>
      <main className="container mx-auto p-6 w-3/4">
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