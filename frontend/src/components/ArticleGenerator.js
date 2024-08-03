import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ArticleGenerator = () => {
  const [keywordsText, setKeywordsText] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
        // タイトルと本文をまとめて表示
        setArticles(prevArticles => [...prevArticles, { title: data.title, content: data.answer }]);
      };

      eventSource.onerror = (err) => {
        console.error('EventSource failed:', err);
        setError('An error occurred while generating articles.');
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
      console.error('Error:', error);
      setError('An error occurred while generating articles.');
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={keywordsText}
        onChange={handleChange}
        placeholder="Enter keywords, one per line"
        rows="10"
        cols="30"
      />
      <br />
      <button onClick={generateArticles} disabled={loading}>
        {loading ? '生成中...' : '記事生成'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>記事内容</h2>
      <div>
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h3>{article.title}</h3>
              <ReactMarkdown>{article.content}</ReactMarkdown>
            </div>
          ))
        ) : (
          null
        )}
      </div>
    </div>
  );
};

export default ArticleGenerator;