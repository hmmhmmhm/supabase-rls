"use client";

import { createContext } from "react";

export type SupabaseContextType = {
  schemaTypeData: string | null;
  setSchemaTypeData: (data: string | null) => void;
};

export const SupabaseContext = createContext<SupabaseContextType | null>(null);
