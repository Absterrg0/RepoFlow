'use client';

import React, { useState } from 'react';
import { Bookmark, Trash, LucideIcon, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface CardData {
  id: number;
  name: string;
  description: string;
  url: string;
  techStack: string[];
}

interface SidebarItem {
  icon: LucideIcon;
  name: string;
  content: React.ReactNode;
}

interface SidebarProps {
  className?: string;
  bookmarkedRepos: CardData[];
  onUnbookmark: (id: number) => void;
}

const Card: React.FC<CardData & { onUnbookmark: (id: number) => void }> = ({ name, description, url, techStack, onUnbookmark, id }) => (
  <motion.div
    className="bg-gradient-to-r border from-gray-900 to-zinc-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-700"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-lg font-semibold mb-2 text-gray-100">{name}</h3>
    <p className="text-sm text-gray-300">{description}</p>
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
      View Repository
    </a>
    <div className="mt-2 flex flex-wrap">
      {techStack.map((tech, index) => (
        <span key={index} className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-1">{tech}</span>
      ))}
    </div>
    <button onClick={() => onUnbookmark(id)} className="mt-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded-full p-2"> {/* Updated color here */}
      <Trash size={18} />
    </button>
  </motion.div>
);

const GridSection: React.FC<{ data: CardData[]; onUnbookmark: (id: number) => void }> = ({ data, onUnbookmark }) => {
  return (
    <div className={`grid grid-cols-1 gap-4 p-4`}>
      <AnimatePresence>
        {data.map((item) => (
          <Card key={item.id} {...item} onUnbookmark={onUnbookmark} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default function Sidebar({ className, bookmarkedRepos, onUnbookmark }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [loadCards, setLoadCards] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { icon: Bookmark, name: 'Bookmarks', content: loadCards ? <GridSection data={bookmarkedRepos} onUnbookmark={onUnbookmark} /> : null },
  ];

  const toggleSidebar = (index: number) => {
    if (!isOpen) {
      setIsOpen(true);
      setActiveSection(index);
    } else if (activeSection === index) {
      setIsOpen(false);
      setActiveSection(null);
      setLoadCards(false);
    } else {
      setActiveSection(index);
    }
  };

  const sidebarWidth = bookmarkedRepos.length >= 4 ? 640 : 320;

  return (
    <motion.div
      className={`fixed left-0 min-h-screen bg-gray-900 text-gray-100 shadow-lg ${className}`}
      animate={{ width: isOpen ? sidebarWidth : 64}}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (isOpen) {
          setLoadCards(true);
        }
      }}
    >
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col flex-grow py-4 overflow-y-hidden overflow-x-hidden">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-2"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className={`flex items-center w-full p-4 hover:bg-gray-800 transition-colors duration-200 ${activeSection === index ? "bg-gray-800" : ""}`}
                      onClick={() => toggleSidebar(index)}
                    >
<div className="flex items-center sa">
  <div className="flex items-center pb-4 hover:bg-gray-800 rounded">
    <item.icon size={24} className="min-w-[24px] mr-2" />
  </div>
  <AnimatePresence>
    {isOpen && (
      <motion.span
        className="flex-grow text-left"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
      >
        {item.name}
      </motion.span>
    )}
  </AnimatePresence>
</div>


                      {isOpen && activeSection === index && (
                        <ChevronRight size={18} className="ml-auto" />
                      )}
                    </button>
                  </TooltipTrigger>
                  {!isOpen && (
                    <TooltipContent side="right" sideOffset={10}>
                      <p>{item.name}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <AnimatePresence>
                {isOpen && activeSection === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-900"
                  >
                    {item.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
