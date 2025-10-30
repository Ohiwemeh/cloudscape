import React from 'react';

const LookBook = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
      <div className="max-w-4xl w-full bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-900/90 border border-gray-800 rounded-xl p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-light tracking-wider mb-4">LOOKBOOK</h1>
            <p className="text-gray-300 mb-6 max-w-xl">
              We're working on something beautiful. Our lookbook will showcase hand-selected outfits,
              styling tips, and exclusive editorials — coming soon.
            </p>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <button className="px-8 py-3 bg-white text-black tracking-widest font-medium hover:scale-105 transition-transform duration-300">
                NOTIFY ME
              </button>

              <button className="px-6 py-3 border border-gray-600 text-gray-200 hover:border-white hover:text-white transition-colors duration-300">
                EXPLORE COLLECTIONS
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-500 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"></div>
              <div className="aspect-[3/4] bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-500 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"></div>
              <div className="aspect-[3/4] bg-gradient-to-tr from-green-400 via-teal-500 to-cyan-500 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"></div>
              <div className="aspect-[3/4] bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-700 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500"></div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500 text-sm">Feature coming soon — stay tuned ✨</div>
      </div>
    </div>
  );
};

export default LookBook;
