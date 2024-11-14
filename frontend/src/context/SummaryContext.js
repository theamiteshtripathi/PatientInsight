import React, { createContext, useState, useContext } from 'react';

const SummaryContext = createContext(null);

export function SummaryProvider({ children }) {
  const [summaries, setSummaries] = useState([]);

  const addSummary = (summary) => {
    setSummaries([...summaries, summary]);
  };

  const updateSummary = (id, updatedSummary) => {
    setSummaries(summaries.map(s => 
      s.id === id ? { ...s, ...updatedSummary } : s
    ));
  };

  return (
    <SummaryContext.Provider value={{ summaries, addSummary, updateSummary }}>
      {children}
    </SummaryContext.Provider>
  );
}

export const useSummary = () => useContext(SummaryContext);
