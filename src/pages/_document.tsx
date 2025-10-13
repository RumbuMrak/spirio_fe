import Document, { Html, Head, Main, NextScript } from 'next/document';
import { appName } from '../services/utils';
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content={appName} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content={appName} />
          <link rel="shortcut icon" href="/favicon.ico" />
          {}
        <meta name="description" content="SPIRIO vás propojuje se zkušenými duchovními průvodci a kartářkami online. Nabízíme výklad karet, tarotové i cikánské karty, astrologii, Reiki, meditace a další techniky pro osobní rozvoj a vnitřní rovnováhu." />
        <meta name="keywords" content="SPIRIO, kartářka online, výklad karet online, tarotové karty, výklad karet, osobní výklad karet, tarotové karty výklad, cikánské karty, cikánské karty výklad, duchovní průvodce, astrologie, numerologie, Reiki, energetické léčení, meditace, dechová cvičení, šamanismus, akašické záznamy, human design, kyvadlo, runy, EFT, barevná terapie, automatické psaní, automatická kresba, spirituální koučink" />
        <meta name="title" content="Výklad karet online | Spirio – Tarot, astrologie, numerologie"></meta>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={appName} />
          <meta property="og:image" content="/images/favicon/apple-touch-icon.png" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() { window.dataLayer.push(arguments); }
                gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 2000
              });
              `,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
