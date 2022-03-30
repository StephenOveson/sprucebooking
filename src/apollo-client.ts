import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "https://6pbn3u.sse.codesandbox.io/",
    cache: new InMemoryCache(),
});

export default client;