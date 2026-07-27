import { LegalDocumentType } from '../types';

export interface SavedDocument {
  id: string;
  title: string;
  templateType: LegalDocumentType;
  content: string;
  date: string;
}

const STORAGE_KEY = 'nla_generated_documents';

export function getSavedDocuments(): SavedDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load documents from storage:', err);
    return [];
  }
}

export function saveDocument(doc: SavedDocument): void {
  if (typeof window === 'undefined') return;
  try {
    const docs = getSavedDocuments();
    const existingIndex = docs.findIndex(d => d.id === doc.id);
    if (existingIndex >= 0) {
      docs[existingIndex] = doc;
    } else {
      docs.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.error('Failed to save document to storage:', err);
  }
}

export function deleteDocument(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const docs = getSavedDocuments();
    const updated = docs.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete document from storage:', err);
  }
}
