import { redirect } from 'next/navigation';

// Development Mode: Go straight to dashboard
// TODO: Change back to '/login' when authentication is re-enabled
export default function HomePage() {
  redirect('/dashboard');
}
