import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <title>Vibe</title>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="react-portal-modal-container"></div>
      </body>
    </Html>
  );
}
