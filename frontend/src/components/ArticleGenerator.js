import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Modal from './Modal';

const ArticleGenerator = () => {
  const [keywordsText, setKeywordsText] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleChange = (event) => {
    setKeywordsText(event.target.value);
  };

  const generateArticles = async () => {
    setLoading(true);
    setError(null);
    setArticles([]);
    const keywords = keywordsText.split('\n').filter(keyword => keyword.trim() !== '');

    try {
      const eventSource = new EventSource(`http://localhost:3030/generate-articles?query=${encodeURIComponent(keywords.join(', '))}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setArticles(prevArticles => [...prevArticles, { title: data.title, content: data.answer }]);
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
    <div>
      <textarea
        value={keywordsText}
        onChange={handleChange}
        placeholder="キーワードを入力"
        rows="10"
        cols="30"
      />
      <br />
      <button onClick={generateArticles} disabled={loading}>
        {loading ? '生成中...' : '記事生成'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>生成された記事</h2>
      <div>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div 
              key={index} 
              style={{ 
                marginBottom: '5px', 
                backgroundColor: 'rgba(144, 238, 144, 0.3)', // うっすら緑っぽく
                padding: '1px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={() => openModal(article)} // タイトルをクリックでモーダルを開く
            >
              <p>{article.title}</p>
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