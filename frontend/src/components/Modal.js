import React from 'react';
import ReactMarkdown from 'react-markdown';
import './Modal.css'; // スタイルを追加するためのCSSファイルを作成

const Modal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <ReactMarkdown>{content}</ReactMarkdown>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
};

export default Modal;