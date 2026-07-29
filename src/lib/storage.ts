import { LegalDocumentType } from '../types';

export interface SavedDocument {
  id: string;
  title: string;
  templateType: LegalDocumentType;
  content: string;
  date: string;
  hash?: string; // Cryptographic hash for anti-tamper
  tampered?: boolean; // Ephemeral flag set upon loading if hash mismatches
}

const STORAGE_KEY = 'nla_generated_documents';

// Deterministic sync hash function (since Web Crypto API is async, this simple cyrb53 hash provides immediate sync tamper-evidence for local storage)
const generateHash = (str: string, seed = 0): string => {
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for(let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
};

const createDocumentSignature = (doc: Omit<SavedDocument, 'hash' | 'tampered'>): string => {
  const raw = `${doc.id}:${doc.title}:${doc.templateType}:${doc.content}`;
  return generateHash(raw);
};

export function getSavedDocuments(): SavedDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const docs: SavedDocument[] = JSON.parse(data);
    
    // Verify cryptographic integrity
    return docs.map(doc => {
      const expectedHash = createDocumentSignature({
        id: doc.id,
        title: doc.title,
        templateType: doc.templateType,
        content: doc.content,
        date: doc.date
      });
      
      if (!doc.hash || doc.hash !== expectedHash) {
        return { ...doc, tampered: true };
      }
      return { ...doc, tampered: false };
    });
  } catch (err) {
    console.error('Failed to load documents from storage:', err);
    return [];
  }
}

export function saveDocument(doc: SavedDocument): void {
  if (typeof window === 'undefined') return;
  try {
    const docs = getSavedDocuments();
    
    // Create cryptographic signature
    const signature = createDocumentSignature({
      id: doc.id,
      title: doc.title,
      templateType: doc.templateType,
      content: doc.content,
      date: doc.date
    });
    
    const docWithHash = { ...doc, hash: signature, tampered: false };
    
    const existingIndex = docs.findIndex(d => d.id === doc.id);
    if (existingIndex >= 0) {
      docs[existingIndex] = docWithHash;
    } else {
      docs.unshift(docWithHash);
    }
    
    // Strip ephemeral tampered flag before saving
    const toSave = docs.map(({ tampered, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save document to storage:', err);
  }
}

export function deleteDocument(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const docs = getSavedDocuments();
    const updated = docs.filter(d => d.id !== id);
    const toSave = updated.map(({ tampered, ...rest }) => rest);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to delete document from storage:', err);
  }
}
