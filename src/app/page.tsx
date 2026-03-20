import { redirect } from 'next/navigation';

// The root "/" page on the ADMIN site redirects to the dashboard.
// On the PUBLIC site, the middleware handles redirecting "/" → "/flights"
// before this page is ever rendered.
export default function RootPage() {
  redirect('/dashboard');
}