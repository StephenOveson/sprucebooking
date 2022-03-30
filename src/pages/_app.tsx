import '../styles/global.css'
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
import Header from '../components/Layout';
import { RecoilRoot } from 'recoil';

export default function MyApp({ Component, pageProps }) {
    return (
        <div className="bg-neutral-200 h-100 w-100 min-h-screen font-sans">
            <Header />
            <ApolloProvider client={client}>
                <RecoilRoot>
                    <Component {...pageProps} />
                </RecoilRoot>
            </ApolloProvider>
        </div>
    )
}