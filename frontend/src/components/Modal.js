import React from 'react';
import ReactMarkdown from 'react-markdown';
import './Modal.css'; // スタイルを追加するためのCSSファイルを作成

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // モーダルの外側がクリックされた場合に閉じる
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h1 className="text-2xl font-bold mb-4 text-black">{title}</h1>
        <ReactMarkdown className="prose text-black">{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Modal;