import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext({
  selectedTab: '',
  setSelectedTab: () => {},
});

export const Tabs = ({ defaultValue, children, className = '' }) => {
  const [selectedTab, setSelectedTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-2 overflow-x-auto pb-2 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, onClick, className = '' }) => {
  const { selectedTab, setSelectedTab } = useContext(TabsContext);
  
  const handleClick = () => {
    setSelectedTab(value);
    if (onClick) onClick();
  };

  const isActive = selectedTab === value;
  
  return (
    <button
      className={`px-4 py-2 rounded-md flex items-center transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = '' }) => {
  const { selectedTab } = useContext(TabsContext);
  
  if (value !== selectedTab) return null;
  
  return (
    <div className={`animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};