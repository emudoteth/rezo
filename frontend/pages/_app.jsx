import { PrivyProvider } from '@privy-io/react-auth';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || 'placeholder'}
      config={{
        loginMethods:         ['email', 'wallet'],
        appearance:           { theme: 'dark', accentColor: '#6366f1' },
        defaultChain:         { id: 8453, name: 'Base' },
        supportedChains:      [{ id: 8453, name: 'Base' }],
        embeddedWallets:      { createOnLogin: 'users-without-wallets' },
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}
