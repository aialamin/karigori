import { createContext, useContext, useState, useEffect } from 'react';
import { CATEGORIES, ALL_AREAS } from '../constants.js';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [extraCategories, setExtraCats] = useState([]);
  const [extraAreas,      setExtraAreas] = useState([]);
  const [notice,          setNotice]     = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.ok ? r.json() : { extraCategories: [], extraAreas: [], notice: null })
      .then((d) => {
        setExtraCats(d.extraCategories || []);
        setExtraAreas(d.extraAreas || []);
        setNotice(d.notice || null);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  /* Full merged lists — built-ins + admin additions */
  const allCategories = [...CATEGORIES, ...extraCategories];
  const allAreas      = [...new Set([...ALL_AREAS, ...extraAreas])];

  return (
    <ConfigContext.Provider value={{ allCategories, allAreas, extraCategories, extraAreas, setExtraCats, setExtraAreas, notice, setNotice, loaded }}>
      {children}
    </ConfigContext.Provider>
  );
}

export const useConfig = () => useContext(ConfigContext);
