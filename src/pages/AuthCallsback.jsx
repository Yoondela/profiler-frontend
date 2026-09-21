import { useAuth0 } from '@auth0/auth0-react';
import { SigningInLoader } from '@/components/loader/sign-in-loader';

export default function AuthCallback() {
  const { error } = useAuth0();

  if (error) return <p>Oops! {error.message}</p>;
  return <SigningInLoader />;
}
