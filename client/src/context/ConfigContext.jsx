import { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, ALL_AREAS } from '../constants.js';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [extraCategories, setExtraCats] = useState([]);
  const [extraAreas,      setExtraAreas] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.ok ? r.json() : { extraCategories: [], extraAreas: [] })
      .then((d) => { setExtraCats(d.extraCategories || []); setExtraAreas(d.extraAreas || []); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  /* Full merged lists — built-ins + admin additions */
  const allCategories = [...CATEGORIES, ...extraCategories];
  const allAreas      = [...new Set([...ALL_AREAS, ...extraAreas])];

  return (
    <ConfigContext.Provider value={{ allCategories, allAreas, extraCategories, extraAreas, setExtraCats, setExtraAreas, loaded }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
