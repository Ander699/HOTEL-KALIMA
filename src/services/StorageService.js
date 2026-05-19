/**
 * STORAGE SERVICE
 * Centraliza toda la interacción con localStorage.
 */
export const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`[Storage] Error guardando "${key}":`, e);
    }
  };
  export const getFromStorage = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`[Storage] Error leyendo "${key}":`, e);
      return null;
    }
  };
  export const removeFromStorage = (key) => {
    localStorage.removeItem(key);
  };
  export const clearStorage = () => {
    localStorage.clear();
  };