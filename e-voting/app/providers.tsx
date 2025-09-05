"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { ElectionProvider } from "@/lib/election-context";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <AuthProvider>
        <ElectionProvider>
          <Provider store={store}>{children}</Provider>
        </ElectionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
