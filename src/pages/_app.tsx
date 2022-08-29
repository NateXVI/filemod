import { MantineProvider } from '@mantine/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import 'styles/global.css';
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width-device-width"
				/>
			</Head>
			<MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
				<Component {...pageProps} />
			</MantineProvider>
		</>
	);
}
