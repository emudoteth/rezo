// Privy will be wired in once NEXT_PUBLIC_PRIVY_APP_ID is set in Vercel env vars
// import { PrivyProvider } from '@privy-io/react-auth';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
