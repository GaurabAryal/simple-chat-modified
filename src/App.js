import React from 'react';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';

import NewMessageForm from './NewMessageForm';
import MessageList from './MessageList';

const httpLink = new HttpLink({
  uri: 'http://localhost:8080/graphql/',
});
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:8080/graphql/',
  options: {
    reconnect: true
  },
});
const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);
const cache = new InMemoryCache();
const client = new ApolloClient({ link, cache });

const App = () => (
  <ApolloProvider client={client}>
    <div>
      <h1>Simple Chat</h1>
      <NewMessageForm />
      <MessageList />
    </div>
  </ApolloProvider>
);

export default App;
