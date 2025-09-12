import './globals.css';
import { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {
  title: 'Project Tracking',
  description: 'Track projects and tasks efficiently',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
