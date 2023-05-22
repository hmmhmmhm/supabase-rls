"use client";

import { useState } from "react";
import { SupabaseContext } from "./SupabaseContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [schemaTypeData, setSchemaTypeData] = useState<string | null>(null);
  return (
    <SupabaseContext.Provider value={{ schemaTypeData, setSchemaTypeData }}>
      {children}
    </SupabaseContext.Provider>
  );
}
