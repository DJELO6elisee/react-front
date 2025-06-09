// src/utils/url.js
export const isURL = (string) => {
  if (typeof string !== 'string') return false;
  try {
    const url = new URL(string);
    // Vérifier si le protocole est http ou https pour des liens web typiques
    // et qu'il y a un hostname.
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname;
  } catch (_) {
    // Si new URL() échoue, ce n'est pas une URL valide
    return false;
  }
};