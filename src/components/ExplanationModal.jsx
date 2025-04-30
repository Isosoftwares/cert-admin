import React, { useState } from "react";
import PropTypes from "prop-types";

const ExplanationModal = ({ content, onClose }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    aria-hidden="true"
  >
    <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
      <h2 className="text-xl font-bold underline mb-4">Full Report</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
);

ExplanationModal.propTypes = {
  content: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ExplanationDisplay = ({ content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);

  const maxLength = 200;

  const isContentTruncated = content.length > maxLength;

  const handleReadMore = () => {
    if (isTruncated) {
      setIsModalOpen(true);
    } else {
      setIsTruncated(false);
    }
  };

  const truncateContent = (text) => {
    if (text.length > maxLength) {
      return `${text.slice(0, maxLength)}...`;
    }
    return text;
  };

  const truncatedContent = isTruncated
    ? truncateContent(content.replace(/<\/?[^>]+(>|$)/g, ""))
    : content;

  return (
    <div className="p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Explanation</h1> */}
      <div
        className="text-gray-700 mb-2"
        dangerouslySetInnerHTML={{ __html: truncatedContent }}
      />
      {isContentTruncated && (
        <button
          onClick={handleReadMore}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isTruncated ? "Read More" : "Collapse"}
        </button>
      )}
      {isModalOpen && (
        <ExplanationModal
          content={content}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

ExplanationDisplay.propTypes = {
  content: PropTypes.string.isRequired,
};

export default ExplanationDisplay;
