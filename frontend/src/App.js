import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ArticleGenerator from './components/ArticleGenerator';
import Settings from './components/Settings';

function App() {
  return (
    <div className="App bg-dark-bg text-white min-h-screen">
      <header className="App-header bg-magic-blue p-4 flex justify-between items-center">
        <h1 className="text-4xl font-roboto">Article Generator</h1>
        <nav className="mt-4">
          <Link to="/" className="text-lg mx-2 hover:text-magic-green">記事生成</Link>
          <a href="https://rakkokeyword.com/" target="_blank" rel="noopener noreferrer" className="text-lg mx-2 hover:text-magic-green">キーワード検索</a>
          <Link to="/settings" className="text-lg mx-2 hover:text-magic-green">設定</Link>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<ArticleGenerator />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;