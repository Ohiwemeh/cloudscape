import React from 'react';

const ComingSoon = ({ title = 'Feature coming soon', message, ctaText = 'Notify me', imageCols = 4 }) => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl w-full bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-900/90 border border-gray-800 rounded-xl p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4">{title}</h1>
            <p className="text-gray-300 mb-6 max-w-xl">
              {message || 'We\'re preparing this feature. Expect a beautiful experience coming soon.'}
            </p>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <button className="px-8 py-3 bg-white text-black tracking-widest font-medium hover:scale-105 transition-transform duration-300">
                {ctaText}
              </button>

              <button className="px-6 py-3 border border-gray-600 text-gray-200 hover:border-white hover:text-white transition-colors duration-300">
                Explore other sections
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className={`grid grid-cols-2 gap-3`}> 
              {Array.from({ length: imageCols }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-500 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">Feature coming soon — stay tuned ✨</div>
      </div>
    </div>
  );
};

export default ComingSoon;
