import React, { useState } from 'react';
import Markdown from './markdown'; // Import the custom Markdown wrapper

const FaqItems = ({ faqItems }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg max-w-2xl">
      {faqItems.map((faq, index) => (
        <div key={faq.id} className="mb-4">
          <div
            className="flex items-center justify-between cursor-pointer font-bold font-manrope bg-white p-4 rounded-lg hover:bg-gray-200 transition-colors"
            role="button"
            onClick={() => toggleFAQ(index)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFAQ(index)}
            tabIndex={0}
            aria-expanded={activeIndex === index}
          >
            <span className="mr-2">{activeIndex === index ? '▼' : '▶'}</span>
            <h3 className="flex-grow">{faq.question}</h3>
          </div>
          {activeIndex === index && (
            <div className="bg-white p-4 mt-2 rounded-lg">
              <Markdown>{faq.answer}</Markdown> {/* Use custom Markdown component */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FaqItems;