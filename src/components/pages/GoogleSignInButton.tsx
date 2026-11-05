import React from "react";
import { Box, Button } from "@mui/material";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

// Placeholder values such as "YOUR_GOOGLE_CLIENT_ID" count as not configured
const isGoogleSignInConfigured = GOOGLE_CLIENT_ID.endsWith(
  ".apps.googleusercontent.com"
);

let scriptPromise: Promise<void> | null = null;
let initialized = false;
// GIS supports a single callback, so the mounted button registers itself here
let credentialHandler: ((idToken: string) => void) | null = null;

const loadGoogleIdentity = () => {
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        script.remove();
        reject(new Error("Could not load Google Identity Services"));
      };
      document.head.appendChild(script);
    });
  }

  return scriptPromise.then(() => {
    const googleId = window.google?.accounts.id;
    if (!googleId) {
      throw new Error("Google Identity Services is not available");
    }
    if (!initialized) {
      googleId.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => credentialHandler?.(response.credential),
      });
      initialized = true;
    }
    return googleId;
  });
};

export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
}

/**
 * Renders the official Google button, which is required to receive an ID token
 * through the popup flow. Falls back to a disabled button when Google sign-in
 * is not configured or the Google script cannot be loaded.
 */
export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const onCredentialRef = React.useRef(onCredential);
  const [status, setStatus] = React.useState<"loading" | "ready" | "unavailable">(
    isGoogleSignInConfigured ? "loading" : "unavailable"
  );

  React.useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  React.useEffect(() => {
    if (!isGoogleSignInConfigured) return;

    let cancelled = false;
    const handler = (idToken: string) => onCredentialRef.current(idToken);
    credentialHandler = handler;

    loadGoogleIdentity()
      .then((googleId) => {
        const container = containerRef.current;
        if (cancelled || !container) return;
        googleId.renderButton(container, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          logo_alignment: "center",
          locale: "en",
          width: Math.max(200, Math.min(container.offsetWidth, 400)),
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("unavailable");
      });

    return () => {
      cancelled = true;
      if (credentialHandler === handler) credentialHandler = null;
    };
  }, []);

  return (
    <Box>
      {status !== "ready" && (
        <Button
          fullWidth
          variant="outlined"
          disabled
          startIcon={<GoogleIcon />}
          sx={{ textTransform: "none", fontWeight: 600, py: 1.1 }}
        >
          {status === "loading"
            ? "Loading Google sign-in..."
            : "Google sign-in is unavailable"}
        </Button>
      )}
      <Box ref={containerRef} sx={{ display: "flex", justifyContent: "center" }} />
    </Box>
  );
}
