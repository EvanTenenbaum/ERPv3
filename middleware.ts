import { withAuth } from 'next-auth/middleware';

export default withAuth({});

export const config = {
  matcher: [
    '/((?!api/auth|login|_next/|static/|.*\\.(?:png|jpg|jpeg|svg|ico|css|js)).*)',
  ],
};

