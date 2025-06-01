import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";

// Global error handler for console-related errors
const originalConsoleError = console.error;
console.error = (...args) => {
  try {
    // Safely convert arguments to strings
    const safeArgs = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          return JSON.stringify(arg);
        } catch {
          return '[Object]';
        }
      }
      return String(arg);
    });
    originalConsoleError.apply(console, safeArgs);
  } catch (error) {
    // Fallback if there's still an error
    originalConsoleError.call(console, 'Console error occurred:', error);
  }
};

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);
