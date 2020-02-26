import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {Mutation} from 'react-apollo';

const query = gql`
query read {
  history(chatroom:"kittens"){
    author
    text
  }
}
`;

const subscription = gql`
subscription{
  onNewChatMessage(chatroom:"kittens"){
    author
    text
  }
}
`;

const CREATE_MESSAGE = gql`
mutation sendChatMessage($chatroom: String!, $text: String) {
  sendChatMessage(chatroom: $chatoom, text: $text){
    ok
  }
}
`;


const MessageItem = ({ message }) => (
  <li style={{ borderTop: '1px solid lightgray' }}>
  {console.log("====message starts here====")}
  {console.log(message)}
  {console.log("====message ends here====")}
    <p>
      {message.author}: {' '}
      {message.text}
    </p>
  </li>
);

// const MessageListView = class extends React.PureComponent {
//   render() {
//     const { data } = this.props;
//     return (
//       <ul style={{ listStyleType: 'none', padding: 0 }}>
//       {data.history.map(message => <MessageItem message={message} />)}
//       </ul>
//     );
//   }
// };
//
// const _sub = subscribeToMore => {
//   subscribeToMore({
//     document: subscription,
//     updateQuery: (prev, { subscriptionData }) => {
//       console.log(subscriptionData.data);
//       if (!subscriptionData.data) return prev;
//       const { mutation, node } = subscriptionData.data.onNewChatMessage;
//       // if (mutation !== 'CREATED') return prev;
//       console.log("subscripted");
//       return Object.assign({}, prev, {
//         history: [node, ...prev.history].slice(0, 20),
//       });
//     },
//   });
// }
//
//
// const MessageList = () => (
//   <Query query={query}>
//     {({ loading, error, data, subscribeToMore }) => {
//       if (loading) return <p>Loading...</p>;
//       if (error) return <p>Error: {error.message}</p>;
//       _sub(subscribeToMore)
//       return <MessageListView data={data}/>;
//     }}
//   </Query>
// );


const MessageListView = class extends React.PureComponent {
  componentDidMount() {
    this.props.subscribeToMore();
  }
  render() {
    const { data } = this.props;
    {console.log("~~~~~~~~~~~I am in messagelist view======")}
    {console.log(data.history)}
    {console.log("~~~~~~~~~~I am end in messagelist view======")}
    return (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
      {data.history.map(message => <MessageItem message={message} />)}
      </ul>
    );
  }
};

const MessageList = () => (
  <Query query={query}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error.message}</p>;
      console.log("=============messagelist data=============")
      console.log(data)
      console.log("=============end messagelist data=============")
      const more = () => subscribeToMore({
        document: subscription,
        updateQuery: (prev, { subscriptionData }) => {
          console.log("~~~~im subs prev data:")
          console.log(prev)
          console.log("~~~~im subs prev data end")
          if (!subscriptionData.data) return prev;
          const node = subscriptionData.data.onNewChatMessage;
          console.log("========im subs data node ======")
          console.log(node)
          console.log("==========im subs data end=============")
          // if (mutation !== 'CREATED') return prev;
          return Object.assign({}, prev, {
            history: [node, ...prev.history].slice(0, 20),
          });
        },
      });
      return <MessageListView data={data} subscribeToMore={more}/>;
    }}
  </Query>
);


export default MessageList;
