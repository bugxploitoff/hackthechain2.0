// pages/_app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    setReady(true);
  }, []);


  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY || ""}>
      {ready ? (
            <Component {...pageProps} />
      ) : null}
    </GoogleReCaptchaProvider>
  );
}
