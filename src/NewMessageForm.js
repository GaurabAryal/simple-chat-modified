import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const CREATE_MESSAGE = gql`
mutation sendChatMessage($chatroom: String!, $text: String, $author: String!) {
  sendChatMessage(chatroom: $chatroom, text: $text, author: $author){
    ok
  }
}
`;

const NewMessageForm = () => (
  <Mutation mutation={CREATE_MESSAGE}>
    {(createMessage) => {
      const onSubmit = (event) => {
        event.preventDefault();
        const text = event.target.text.value;
        const author = event.target.author.value;
        if (!text) return;
        const chatroom = "kittens";
        createMessage({ variables: { chatroom, text, author } });
        event.target.text.value = '';
      };
      return (
        <form onSubmit={onSubmit}>
          <input name="author" placeholder="Author" />
          :
          <input name="text" placeholder="Text" />
          <button type="submit">Send</button>
        </form>
      );
    }}
  </Mutation>
);

export default NewMessageForm;
