'use client';

import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState('Top stories');

  const newsCategories = ['Top stories', 'Trending News', 'Latest News'];

  const newsGrid = [
    { title: "Eum ad dolor et. Autem aut fugiat debitis", author: "Julia Parker", date: "Tue, December 12", img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDUwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjIwMCAxMTBIMzAwVjE3MEgyMDBWMTEwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAxMDAgNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTQ2LjUgMjFINjEuNVYzNS41SDQ2LjVWMjFaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K" },
    { title: "Et repellendus molestiae qui est sed omnis", author: "Mario Douglas", date: "Fri, September 05", img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDUwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjIwMCAxMTBIMzAwVjE3MEgyMDBWMTEwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAxMDAgNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTQ2LjUgMjFINjEuNVYzNS41SDQ2LjVWMjFaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K" },
    { title: "Quia assumenda est et veritati", author: "Lisa Hunter", date: "Tue, July 27", img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDUwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjIwMCAxMTBIMzAwVjE3MEgyMDBWMTEwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAxMDAgNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTQ2LjUgMjFINjEuNVYzNS41SDQ2LjVWMjFaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K" },
    { title: "Pariatur quia facilis similique deleniti", author: "Mario Douglas", date: "Tue, Sep 16", img: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDUwMCAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjIwMCAxMTBIMzAwVjE3MEgyMDBWMTEwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIHZpZXdCb3g9IjAgMCAxMDAgNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNTYiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTQ2LjUgMjFINjEuNVYzNS41SDQ2LjVWMjFaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K" }
  ];

  return (
    <div className="pt-20">
      <section className="bg-[#0092DD] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">News</h1>
          <p className="max-w-2xl mx-auto text-white/80 text-sm leading-relaxed">
            Stay updated with the latest news and events from our school.
          </p>
        </div>
      </section>

      <div className="bg-gray-100 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-medium text-gray-500">
          <span className="text-[#0092DD]">Home</span> <span className="mx-2">/</span> News
        </div>
      </div>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured News */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] mb-16">
             <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2NzUiIHZpZXdCb3g9IjAgMCAxMjAwIDY3NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNjc1IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9IjQ4MCAyNzBINzIwVjQwNUg0ODBWMjcwWiIgZmlsbD0iI0QxRDVEQiIvPgo8c3ZnIHdpZHRoPSIyNDAiIGhlaWdodD0iMTM1IiB2aWV3Qm94PSIwIDAgMjQwIDEzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMzUiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iMTExLjIgNTQuM0gxMjguOFY4MC43SDExMS4yVjU0LjNaIiBmaWxsPSIjRDFENUVCIi8+Cjwvc3ZnPgo8L3N2Zz4K" className="w-full h-full object-cover" alt="Featured News" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                <span className="bg-[#0092DD] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md mb-4 w-fit">Education / 02/15/2024</span>
                <h2 className="text-3xl font-bold text-white mb-4 leading-tight">New Academic Programs Launching This Fall</h2>
                <p className="text-white/70 text-sm mb-4 max-w-xl">Discover our innovative curriculum designed to prepare students for the future.</p>
                <p className="text-white text-xs font-bold">by Jennifer Mitchell</p>
             </div>
          </div>

          {/* News Tabs */}
          <div className="flex gap-4 mb-10 border-b border-gray-100 pb-2">
              {newsCategories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveTab(cat)} 
                  className={`text-xs font-bold uppercase tracking-widest pb-2 transition-all ${activeTab === cat ? 'text-[#0092DD] border-b-2 border-[#0092DD]' : 'text-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
           </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
             {newsGrid.map((item, i) => (
               <div key={i} className="group cursor-pointer">
                  <div className="rounded-2xl overflow-hidden h-48 mb-4 shadow-sm">
                     <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                  </div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">{item.date}</div>
                  <h4 className="font-bold text-gray-900 group-hover:text-[#0092DD] transition-colors mb-2 line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400">by {item.author}</p>
               </div>
             ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-[#0268ab] transition-colors"><ChevronLeft className="h-4 w-4" /></button>
             <button className="w-8 h-8 rounded-full bg-[#0268ab] text-white text-xs font-bold transition-colors">1</button>
             <button className="w-8 h-8 rounded-full text-gray-500 text-xs font-bold hover:bg-gray-100 hover:text-[#0268ab] transition-colors">2</button>
             <button className="w-8 h-8 rounded-full text-gray-500 text-xs font-bold hover:bg-gray-100 hover:text-[#0268ab] transition-colors">3</button>
             <button className="p-2 text-gray-400 hover:text-[#0268ab] transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </section>
    </div>
  );
}


