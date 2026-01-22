import React from 'react';

/**
 * Highlights search terms within a text.
 * @param {string} text - The original text to display.
 * @param {string} highlight - The search term to highlight.
 * @param {string} className - Optional styling class.
 */
export default function HighlightText({ text, highlight, className = "" }) {
  if (!highlight || !text) {
    return <span className={className}>{text}</span>;
  }

  // Escape special characters for regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const regex = new RegExp(`(${escapeRegExp(highlight)})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span 
            key={index} 
            className="bg-accent/20 text-accent font-bold px-0.5 rounded-[2px]"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}
