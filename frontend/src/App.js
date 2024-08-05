import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import ArticleGenerator from './components/ArticleGenerator';
import Settings from './components/Settings';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Article Generator</h1>
        <nav>
          <Link to="/">ホーム</Link>
          <Link to="/settings">設定</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<ArticleGenerator />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;