import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopNav from './TopNav.jsx';

export default function Shell({ children }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeApiId = searchParams.get('api') || 'pan-advance';

  const [sidebarSearch, setSidebarSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSelectService = (apiId) => {
    setSearchParams({ api: apiId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 flex flex-col antialiased font-sans w-full max-w-full overflow-x-hidden relative">
      
      {/* Ambient Top Glow */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.08),rgba(255,255,255,0))] pointer-events-none z-0" />

      {/* Modern Light Navigation Sidebar (w-72) */}
      <Sidebar
        selectedApiId={activeApiId}
        onSelectService={handleSelectService}
        searchQuery={sidebarSearch}
        onSearchChange={setSidebarSearch}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Frame (lg:pl-72 perfectly matches sidebar w-72) */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full lg:pl-72">
        
        {/* Sticky Top Header */}
        <TopNav
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Focused Application Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto min-w-0">
          {children}
        </main>

        {/* Minimal Enterprise Footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 text-xs text-slate-400 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-slate-600">
              Laxmi Niwas Enterprise Verification Platform
            </span>
            <span>
              © {new Date().getFullYear()} Laxmi Niwas. All rights reserved.
            </span>
          </div>
        </footer>

      </div>

    </div>
  );
}
