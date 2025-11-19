
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CharacterResponse } from "../services/api";

export interface CollectedCharacter extends CharacterResponse {
  id: string;
  createdAt: string;
  parts: string[];
}

interface CollectionContextValue {
  collection: CollectedCharacter[];
  addCharacter: (character: CharacterResponse, parts: string[]) => void;
}

const CollectionContext = createContext<CollectionContextValue | undefined>(undefined);

export const useCollection = () => {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used within CollectionProvider");
  return ctx;
};

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [collection, setCollection] = useState<CollectedCharacter[]>([]);

  const addCharacter = (character: CharacterResponse, parts: string[]) => {
    const newItem: CollectedCharacter = {
      ...character,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      parts,
    };
    setCollection((prev) => [newItem, ...prev]);
  };

  return (
    <CollectionContext.Provider value={{ collection, addCharacter }}>
      {children}
    </CollectionContext.Provider>
  );
};
