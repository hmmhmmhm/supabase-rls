"use client";

import { SupabaseContext } from "@/context/SupabaseContext";
import { useContext, useEffect, useState } from "react";
import MonacoEditor, { useMonaco } from "@monaco-editor/react";
import initSwc, { transform } from "@swc/wasm-web";
import { toast } from "react-toastify";
import copyToClipboard from "copy-to-clipboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const context = `declare type JWT = {
  aud: string;
  exp: number;
  sub: string;
  email: string;
  app_metadata: {
    provider: string;
  };
  user_metadata: any;
  role: string;
} & Record<string, any>;

declare const createPolicy: <TableName extends keyof Database["public"]["Tables"]>(
  param: (some: {
    row: Database["public"]["Tables"][TableName]["Row"];
    function: Record<keyof Database["public"]["Functions"], Function>;
    auth: {
      uid: () => string;
      jwt: () => JWT;
    };
    plv8: {
      execute<T>(sql: string, ...params: any[]): T;
    };
  }) => boolean
) => boolean;`;

const source = `export default createPolicy<"<YOUR_TABLE_NAME>">((context) => {
  // TODO: Your policy logic
  return true;
});
`;

export default function Editor() {
  const { schemaTypeData } = useContext(SupabaseContext)!;
  const [convertedCode, setConvertedCode] = useState<string | null>(null);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function importAndRunSwcOnMount() {
      await initSwc();
      setInitialized(true);
    }
    importAndRunSwcOnMount();
  }, []);

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme("supabase", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#242933",
        },
      });
      monaco.editor.setTheme("supabase");

      if (schemaTypeData) {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          schemaTypeData
            .replace(/export type/g, "declare type")
            .replace(/export interface/g, "declare interface")
        );

        monaco.languages.typescript.typescriptDefaults.addExtraLib(context);
      }
    }
  }, [monaco, schemaTypeData]);

  const convert = async () => {
    if (!initialized) {
      toast.error("SWC is not initialized yet.");
      return;
    }

    setConvertedCode(null);
    const source = monaco?.editor.getModels()[0].getValue();

    let { code } = await transform(
      `function createPolicy(cb) {
  cb({
    row: globalThis,
    function: globalThis,
    auth: globalThis.auth,
    plv8: globalThis.plv8,
  });
}

${source}`,
      {
        sourceMaps: false,
        jsc: {
          parser: {
            syntax: "typescript",
            tsx: false,
          },
        },
      }
    );

    code = `boolean as $$
${code.trim()}
$$ language plv8;`.replace("export default", "return");

    setConvertedCode(code);
  };

  return (
    <main data-theme="dark">
      <div className="hero min-h-screen bg-base-200 p-8">
        <MonacoEditor
          defaultLanguage="typescript"
          defaultValue={source}
          theme="vs-dark"
          options={{
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            suggest: {
              snippetsPreventQuickSuggestions: false,
            },
            autoIndent: "full",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />

        <label
          htmlFor="sql-code-modal"
          className="btn btn-primary absolute bottom-8 right-8"
          onClick={convert}
        >
          Convert
        </label>

        <input id="sql-code-modal" type="checkbox" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box mockup-code relative text-primary-content">
            <label
              htmlFor="sql-code-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <h3 className="m-4 font-bold">RLS conversion is complete!</h3>

            <button
              className="btn btn-primary ml-4"
              onClick={() => {
                if (convertedCode) {
                  copyToClipboard(convertedCode);
                  toast.success("Copied to clipboard!");
                } else {
                  toast.error("No converted code yet.");
                }
              }}
            >
              Copy to clipboard
            </button>

            <div className="mt-4">
              {!convertedCode && (
                <pre data-prefix="1">
                  <code className="text-primary">Loading...</code>
                </pre>
              )}
              {convertedCode &&
                convertedCode.split("\n").map((value, index) => {
                  return (
                    <pre data-prefix={index + 1} key={index}>
                      <code className="text-primary">{value}</code>
                    </pre>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </main>
  );
}
