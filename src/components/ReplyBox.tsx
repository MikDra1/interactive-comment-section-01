import styled from "styled-components";
import { Comment, Reply as ReplyType, User } from "../../types/interfaces";
import { FormEvent, useState } from "react";

interface ReplyBoxProps {
  currentUser: User | undefined;
  setReplies: React.Dispatch<React.SetStateAction<ReplyType[]>>;
  setShowReplyBox: React.Dispatch<React.SetStateAction<boolean>>;
  replyTo: string;
  replyingTo: "comment" | "reply";
  cardData: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const Container = styled.div<{ replyingTo: "comment" | "reply" }>`
  margin-left: ${(props) => (props.replyingTo === "comment" ? "8vw" : "12vw")};

  @media (min-width: 1000px) {
    margin-left: ${(props) =>
      props.replyingTo === "comment" ? "6rem" : "8rem"};
  }
`;

const StyledForm = styled.form<{ replyingTo: "comment" | "reply" }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  margin-inline: auto;
  background-color: var(--white);
  padding: 1rem;
  border-radius: 0.5rem;
  width: ${(props) => (props.replyingTo === "comment" ? "90%" : "100%")};

  textarea {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--light-gray);
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      cursor: pointer;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: var(--dark-blue);
      color: var(--white);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        opacity: 0.6;
      }
    }
  }
`;

const CurrentUserImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

export default function ReplyBox({
  currentUser,
  setReplies,
  setShowReplyBox,
  replyTo,
  replyingTo,
  cardData,
  setComments,
}: ReplyBoxProps) {
  const [reply, setReply] = useState("");

  function handleReply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (reply === "" || !currentUser) return;

    setShowReplyBox(false);

    setReplies((prevReplies) => {
      const newReply = {
        id: new Date().getTime() + Math.random(),
        content: reply,
        createdAt: new Date().toString(),
        score: 0,
        replyingTo: replyTo,
        wasLiked: false,
        user: {
          image: {
            png: currentUser.image.png,
            webp: currentUser.image.webp,
          },
          username: currentUser.username,
        },
        username: currentUser.username,
      };

      const updatedReplies = [...prevReplies, newReply];

      // Update the comments array in state and localStorage
      setComments((prevComments) => {
        const updatedComments = prevComments.map((comment) => {
          if (comment.id === cardData.id) {
            return { ...comment, replies: updatedReplies }; // Update only this comment's replies
          }
          return comment;
        });

        localStorage.setItem("comments", JSON.stringify(updatedComments)); // Save full updated comments array
        return updatedComments;
      });

      return updatedReplies;
    });
  }

  return (
    <Container replyingTo={replyingTo}>
      <StyledForm onSubmit={(e) => handleReply(e)} replyingTo={replyingTo}>
        <textarea
          placeholder="Add a comment..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <div>
          {currentUser && (
            <CurrentUserImage src={currentUser.image.png} alt="" />
          )}
          <button type="submit">Send</button>
        </div>
      </StyledForm>
    </Container>
  );
}
