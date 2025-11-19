
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CharacterResponse, CollectionItem, SlotsResponse } from "../services/api";
import { getCollectionSlots, saveCollectionItem } from "../services/api";

export interface CollectedCharacter extends CharacterResponse {
  id: string;
  createdAt: string;
  parts: string[];
}

interface CollectionContextValue {
  collection: CollectedCharacter[];
  slots: SlotsResponse | null;
  refreshSlots: (deviceId: string) => Promise<void>;
  addCharacter: (character: CharacterResponse, parts: string[], deviceId: string) => Promise<void>;
}

const CollectionContext = createContext<CollectionContextValue | undefined>(undefined);

export const useCollection = () => {
  const ctx = useContext(CollectionContext);
  if (!ctx) throw new Error("useCollection must be used within CollectionProvider");
  return ctx;
};

export const CollectionProvider = ({ children }: { children: ReactNode }) => {
  const [collection, setCollection] = useState<CollectedCharacter[]>([]);
  const [slots, setSlots] = useState<SlotsResponse | null>(null);

  const refreshSlots = async (deviceId: string) => {
    const data = await getCollectionSlots(deviceId);
    setSlots(data);
  };

  const addCharacter = async (character: CharacterResponse, parts: string[], deviceId: string) => {
    const { item, slots: newSlots } = await saveCollectionItem(deviceId, character, parts);
    const newItem: CollectedCharacter = { ...item, parts: item.parts ?? parts };
    setCollection((prev) => [newItem, ...prev]);
    setSlots(newSlots);
  };

  return (
    <CollectionContext.Provider value={{ collection, slots, refreshSlots, addCharacter }}>
      {children}
    </CollectionContext.Provider>
  );
};
