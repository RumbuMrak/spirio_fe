const nextTranslate = require('next-translate-plugin');

/** @type {import('next').NextConfig} */
module.exports = nextTranslate({
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.(js|ts)x?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uw.hfgl2.com',
        port: '',
        pathname: '/**',
      },
      ...(process.env.NEXT_PUBLIC_BACKEND_URL
        ? [
            {
              protocol: 'https',
              hostname: process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '') ?? 'localhost',
              port: '',
              pathname: '/**',
            },
          ]
        : []),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Route translations - Czech to English file mappings
      {
        source: '/domov',
        destination: '/',
      },
      {
        source: '/pruvodci',
        destination: '/discover',
      },
      {
        source: '/pruvodci/:slug',
        destination: '/discover/:slug',
      },
      {
        source: '/pruvodci/horoskop/:slug',
        destination: '/discover/horoscope/:slug',
      },
      {
        source: '/jak-to-funguje',
        destination: '/how-it-works',
      },
      {
        source: '/balicky',
        destination: '/packages-overview',
      },
      {
        source: '/techniky/:technique',
        destination: '/:technique',
      },
      {
        source: '/pristupovy-pruvodce',
        destination: '/access-wizard',
      },
      {
        source: '/hovor/:id',
        destination: '/call/:id',
      },
      {
        source: '/hovor/konec',
        destination: '/call/end',
      },
      {
        source: '/chat/:id',
        destination: '/chat/:id',
      },
      {
        source: '/chat/konec',
        destination: '/chat/end',
      },
      {
        source: '/prenos/:id',
        destination: '/livestream/:id',
      },
      {
        source: '/prenos/hostitel/:id',
        destination: '/livestream/host/:id',
      },
      {
        source: '/prenos/konec',
        destination: '/livestream/end',
      },
      {
        source: '/pruvodce',
        destination: '/guide',
      },
      {
        source: '/pruvodce/kalendar',
        destination: '/guide/calendar',
      },
      {
        source: '/pruvodce/placena-videa',
        destination: '/guide/paid-videos',
      },
      {
        source: '/uzivatel/kalendar',
        destination: '/user/calendar',
      },
      {
        source: '/uzivatel/zmena-hesla',
        destination: '/user/change-password',
      },
      {
        source: '/uzivatel/predplatne',
        destination: '/user/subscriptions',
      },
      {
        source: '/uzivatel/doporuceni',
        destination: '/user/referral-link',
      },
      {
        source: '/uzivatel/profil',
        destination: '/user/profile',
      },
      {
        source: '/uzivatel/pozvanka',
        destination: '/user/invitation',
      },
      {
        source: '/uzivatel/vydavatel',
        destination: '/user/publisher',
      },
      {
        source: '/uzivatel/zajmy',
        destination: '/user/interest',
      },
      {
        source: '/uzivatel/zpetna-vazba',
        destination: '/user/feedback',
      },
      {
        source: '/uzivatel/notifikace',
        destination: '/user/notifications',
      },
      {
        source: '/prihlaseni',
        destination: '/login',
      },
      {
        source: '/registrace',
        destination: '/registration',
      },
      {
        source: '/registrace-pruvodce',
        destination: '/registration-guide',
      },
      {
        source: '/zapomenute-heslo',
        destination: '/forgotten-password',
      },
      {
        source: '/inicializace-hesla',
        destination: '/password-init',
      },
      {
        source: '/overeni-emailu',
        destination: '/verify-email',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/obnoveni-hesla',
        destination: '/password-reset',
        permanent: true,
      },
    ];
  },
  i18n: {
    locales: ['cs'],
    defaultLocale: 'cs',
    localeDetection: false,
  },
});
