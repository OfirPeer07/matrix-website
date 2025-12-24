import React, { useState } from 'react';

export default function TailwindDemo() {
  const [activeTab, setActiveTab] = useState('cards');

  return (
    <div className="min-h-screen matrix-bg p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="matrix-title text-4xl mb-4">Tailwind CSS + Matrix Theme</h1>
        <p className="matrix-subtitle">Experience the power of utility-first CSS with Matrix aesthetics</p>
      </div>

      {/* Navigation Tabs */}
      <div className="matrix-nav rounded-lg mb-8">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'cards', label: 'Matrix Cards' },
            { id: 'buttons', label: 'Matrix Buttons' },
            { id: 'forms', label: 'Matrix Forms' },
            { id: 'layouts', label: 'Matrix Layouts' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`matrix-nav-link ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      {activeTab === 'cards' && (
        <div className="matrix-grid-3">
          <div className="matrix-card">
            <h3 className="matrix-title text-xl mb-3">Matrix Card 1</h3>
            <p className="matrix-text">This card demonstrates the matrix-card utility class with hover effects and Matrix green borders.</p>
            <div className="mt-4">
              <span className="matrix-status matrix-status-online">Online</span>
            </div>
          </div>
          
          <div className="matrix-card">
            <h3 className="matrix-title text-xl mb-3">Matrix Card 2</h3>
            <p className="matrix-text">Hover over this card to see the scale and glow effects in action.</p>
            <div className="mt-4">
              <span className="matrix-status matrix-status-warning">Warning</span>
            </div>
          </div>
          
          <div className="matrix-card">
            <h3 className="matrix-title text-xl mb-3">Matrix Card 3</h3>
            <p className="matrix-text">Each card has smooth transitions and Matrix-themed styling.</p>
            <div className="mt-4">
              <span className="matrix-status matrix-status-offline">Offline</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'buttons' && (
        <div className="space-y-6">
          <div className="matrix-grid-2">
            <div className="space-y-4">
              <button className="matrix-button w-full">Primary Matrix Button</button>
              <button className="matrix-button w-full opacity-80">Secondary Matrix Button</button>
              <button className="matrix-button w-full opacity-60">Tertiary Matrix Button</button>
            </div>
            <div className="space-y-4">
              <button className="bg-matrix-accent text-white font-matrix font-bold py-2 px-4 rounded hover:bg-matrix-accent/80 transition-all duration-200">
                Custom Accent Button
              </button>
              <button className="bg-transparent border border-matrix-green text-matrix-green font-matrix font-bold py-2 px-4 rounded hover:bg-matrix-green hover:text-matrix-dark transition-all duration-200">
                Outline Button
              </button>
              <button className="bg-matrix-blue text-white font-matrix font-bold py-2 px-4 rounded hover:bg-matrix-blue/80 transition-all duration-200">
                Blue Matrix Button
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'forms' && (
        <div className="matrix-grid-2">
          <div className="space-y-4">
            <div>
              <label className="block matrix-text mb-2">Username</label>
              <input type="text" className="matrix-input w-full" placeholder="Enter your username" />
            </div>
            <div>
              <label className="block matrix-text mb-2">Email</label>
              <input type="email" className="matrix-input w-full" placeholder="Enter your email" />
            </div>
            <div>
              <label className="block matrix-text mb-2">Message</label>
              <textarea className="matrix-input w-full h-24 resize-none" placeholder="Enter your message"></textarea>
            </div>
            <button className="matrix-button">Submit Form</button>
          </div>
          
          <div className="space-y-4">
            <div className="matrix-card">
              <h4 className="matrix-title text-lg mb-3">Form Preview</h4>
              <p className="matrix-text text-sm">This shows how forms look with Matrix styling. All inputs have focus states with green glows.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'layouts' && (
        <div className="space-y-8">
          <div className="matrix-grid-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="matrix-card">
                <h4 className="matrix-title text-lg mb-2">Item {i + 1}</h4>
                <p className="matrix-text text-sm">Grid layout with responsive columns</p>
              </div>
            ))}
          </div>
          
          <div className="matrix-grid-2">
            <div className="matrix-card">
              <h4 className="matrix-title text-lg mb-3">Left Column</h4>
              <p className="matrix-text">This demonstrates the matrix-grid-2 utility class for two-column layouts.</p>
            </div>
            <div className="matrix-card">
              <h4 className="matrix-title text-lg mb-3">Right Column</h4>
              <p className="matrix-text">Responsive grid that stacks on mobile and shows side-by-side on larger screens.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-16">
        <p className="matrix-text opacity-70">
          Built with Tailwind CSS + Custom Matrix Theme
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <div className="w-3 h-3 bg-matrix-green rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-matrix-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-matrix-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
