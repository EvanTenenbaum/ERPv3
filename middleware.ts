import { withAuth } from 'next-auth/middleware';

export default withAuth({});

export const config = {
  matcher: [
    // Exclude all API routes from auth middleware to allow server-side APIs without session
    '/((?!api/|login|_next/|static/|.*\\.(?:png|jpg|jpeg|svg|ico|css|js)).*)',
  ],
};
