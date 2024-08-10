import React, { useState, useEffect } from 'react';
import Modal from './Modal';

const ArticleGenerator = () => {
  const [keywordsText, setKeywordsText] = useState('');
  const [repeatCount, setRepeatCount] = useState(() => {
    const savedCount = localStorage.getItem('repeatCount');
    return savedCount ? parseInt(savedCount, 10) : 1; // デフォルトは1
  });
  const [articles, setArticles] = useState(() => {
    const savedArticles = localStorage.getItem('articles');
    return savedArticles ? JSON.parse(savedArticles) : []; // デフォルトは空配列
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [format, setFormat] = useState(() => {
    return localStorage.getItem('format') || 'demo'; // デフォルトは'demo'
  });

  // コンポーネントがマウントされたときに環境変数をログに出力
  useEffect(() => {
    console.log('API URL:', process.env.REACT_APP_API_URL); // 環境変数の確認
  }, []);

  useEffect(() => {
    console.log('Current Format:', format); // 追加: formatの現在の値をログに出力
    localStorage.setItem('repeatCount', repeatCount);
    localStorage.setItem('format', format);
    localStorage.setItem('articles', JSON.stringify(articles)); // 記事をlocalStorageに保存
  }, [repeatCount, format, articles]);

  const handleChange = (event) => {
    setKeywordsText(event.target.value);
  };

  const handleRepeatCountChange = (event) => {
    setRepeatCount(event.target.value);
  };

  const handleFormatChange = (event) => {
    const selectedFormat = event.target.value;
    console.log('Selected Format:', selectedFormat); // デバッグ用

    // 英語のフォーマットを取得
    const formatMap = {
      'demo': 'demo',
      'publish': 'publish', // 変更: 'public'から'publish'に変更
      'draft': 'draft'
    };

    // 英語のフォーマットを設定
    setFormat(formatMap[selectedFormat] || 'demo'); // デフォルトは'demo'
    console.log('Updated Format:', formatMap[selectedFormat] || 'demo'); // デバッグ用
  };

  const generateArticles = async () => {
    if (!keywordsText.trim()) {
      setError('キーワードを入力してください。');
      return;
    }

    setLoading(true);
    setError(null);
    setArticles([]); // 既存の記事を消去
    const keywords = keywordsText.split('\n').filter(keyword => keyword.trim() !== '');

    const repeatedKeywords = [];
    for (let i = 0; i < repeatCount; i++) {
      repeatedKeywords.push(...keywords);
    }

    // ここで英語のフォーマットを使用
    const apiUrl = `${process.env.REACT_APP_API_URL}/generate-articles?query=${encodeURIComponent(repeatedKeywords.join(', '))}&format=${format}`;
    console.log('API URL:', apiUrl); // 追加: API URLをログに出力

    try {
      const eventSource = new EventSource(apiUrl);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setArticles(prevArticles => {
          const updatedArticles = [...prevArticles, { title: data.title, content: data.answer }];
          localStorage.setItem('articles', JSON.stringify(updatedArticles)); // 記事をlocalStorageに保存
          return updatedArticles;
        });
      };

      eventSource.onerror = (err) => {
        console.error('EventSourceに失敗しました:', err);
        setError('記事生成中にエラーが発生しました。');
        setLoading(false);
        eventSource.close();
      };

      eventSource.onopen = () => {
        setLoading(false);
      };

      eventSource.addEventListener('end', () => {
        eventSource.close();
      });

    } catch (error) {
      console.error('エラー:', error);
      setError('記事生成中にエラーが発生しました。');
      setLoading(false);
    }
  };

  const openModal = (article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  return (
    <div className="p-4">
      <p className="text-left text-2xl mb-4 mt-10">記事生成</p>
      キーワード入力
      <textarea
        value={keywordsText}
        onChange={handleChange}
        rows="10"
        cols="30"
        className="w-full p-2 border border-gray-300 rounded text-black"
      />
      <br />
      <label className="block mt-4">
        <div className="flex items-center justify-end">
          <span>繰り返し回数</span>
          <input
            type="number"
            value={repeatCount}
            onChange={handleRepeatCountChange}
            min="1"
            className="ml-2 p-1 border border-gray-300 rounded text-black w-20"
          />
          <span className="ml-4">生成形式</span>
          <select value={format} onChange={handleFormatChange} className="ml-2 p-1 border border-gray-300 rounded text-black">
            <option value="demo">デモ</option>
            <option value="publish">公開</option>
            <option value="draft">下書き</option>
          </select>
        </div>
      </label>
      <br />
      <div className="flex justify-center">
        <button onClick={generateArticles} disabled={loading} className={`mt-4 p-2 rounded text-white ${loading ? 'bg-magic-green' : 'bg-magic-blue hover:bg-magic-green'}`}>
          {loading ? '生成中...' : '記事生成'}
        </button>
      </div>
      
      {/* エラーメッセージを中央に表示 */}
      {error && (
        <div className="flex justify-center mt-4">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      <div className="mt-4">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div 
              key={index} 
              className="mb-2 p-2 bg-green-100 rounded cursor-pointer text-black flex items-center"
              onClick={() => openModal(article)}
            >
              <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <p className="flex-grow">{article.title}</p>
            </div>
          ))
        ) : (
          null
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={selectedArticle?.title} 
        content={selectedArticle?.content} 
      />
    </div>
  );
};

export default ArticleGenerator;