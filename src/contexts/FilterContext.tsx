// src/contexts/FilterContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface FilterContextType {
  isFilterVisible: boolean;
  toggleFilterVisibility: () => void;
  setFilterVisibility: (isVisible: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const toggleFilterVisibility = () => {
    setIsFilterVisible(prev => !prev);
  };

  const setFilterVisibility = (isVisible: boolean) => {
    setIsFilterVisible(isVisible);
  };

  return (
    <FilterContext.Provider value={{ isFilterVisible, toggleFilterVisibility, setFilterVisibility }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
