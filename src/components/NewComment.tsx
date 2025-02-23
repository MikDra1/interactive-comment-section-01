import styled from "styled-components";
import { Comment, User } from "../../types/interfaces";
import { useState } from "react";
import { useProject } from "../contexts/ProjectProvider";
import { newCommentHandleSubmit } from "../helpers/helpers";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  width: 90%;
  margin-inline: auto;
  background-color: var(--white);
  padding: 1rem;
  border-radius: 0.5rem;

  textarea {
    padding: 1rem;
    border-radius: 0.5rem;
    border: 1px solid var(--light-gray);
    flex: 1;
  }

  div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
      cursor: pointer;
    }
  }

  @media (min-width: 1000px) {
    display: flex;
    flex-direction: row;
  }
`;

const NewCommentButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--dark-blue);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  @media (min-width: 1000px) {
    height: fit-content;
    padding: 0.75rem 1.25rem;
  }
`;

const CurrentUserImage = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;

  @media (min-width: 1000px) {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export default function NewComment({
  currentUser,
  setComments,
}: {
  currentUser: User;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) {
  const [content, setContent] = useState("");
  const { isMobile } = useProject();

  return (
    <>
      {isMobile ? (
        <StyledForm
          onSubmit={(e) =>
            newCommentHandleSubmit(e, content, currentUser, setComments)
          }
        >
          <textarea
            placeholder="Add a comment..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <div>
            <CurrentUserImage src={currentUser.image.png} alt="" />
            <NewCommentButton type="submit">Send</NewCommentButton>
          </div>
        </StyledForm>
      ) : (
        <StyledForm
          onSubmit={(e) =>
            newCommentHandleSubmit(e, content, currentUser, setComments)
          }
        >
          <CurrentUserImage src={currentUser.image.png} alt="" />

          <textarea
            placeholder="Add a comment..."
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
          <NewCommentButton type="submit">Send</NewCommentButton>
        </StyledForm>
      )}
    </>
  );
}
