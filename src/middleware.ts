import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import langConfig from '../i18n.json';
const PUBLIC_FILE = /\.(.*)$/;
export function middleware(request: NextRequest) {
  const user = request.cookies.get('user-id');
  const queries = request.nextUrl.search.replace('?', '').split('&');
  const localeToChange = queries.filter((query) => query.includes('locale='))[0]?.split('=')[1];
  if (request.nextUrl.pathname.startsWith('/_next') || request.nextUrl.pathname.includes('/api/') || PUBLIC_FILE.test(request.nextUrl.pathname)) {
    return;
  }
  if (queries.indexOf('hide-coming-soon=1') > -1) {
    const response = NextResponse.next();
    response.cookies.set('hide-coming-soon', '1');
    return response;
  }
  if (process.env.NEXT_PUBLIC_COMING_SOON === '1' && !request.cookies.get('hide-coming-soon')) {
    if (request.nextUrl.pathname !== '/coming-soon') {
      return NextResponse.redirect(new URL('/coming-soon', request.url));
    }
  }
  if (langConfig?.locales && localeToChange && langConfig?.locales.indexOf(localeToChange) > -1 && localeToChange !== request.nextUrl.locale) {
    return NextResponse.redirect(new URL(`/${localeToChange}${request.nextUrl.pathname}${request.nextUrl.search}`, request.url));
  }
  if (
    !user &&
    (request.nextUrl.pathname.startsWith('/user') || request.nextUrl.pathname.startsWith('/guide') || request.nextUrl.pathname.startsWith('/call'))
  ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
