import React from "react";
import { ExtensionProvider } from "@looker/extension-sdk-react";
import { hot } from "react-hot-loader/root";
import { ComponentsProvider } from "@looker/components";
import ExtensionView from "./pages/ExtensionView";

export const App = hot(() => {
  return (
    <ExtensionProvider>
      <ComponentsProvider>
        <ExtensionView />
      </ComponentsProvider>
    </ExtensionProvider>
  );
});
