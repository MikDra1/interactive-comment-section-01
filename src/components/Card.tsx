import styled from "styled-components";
import { Comment, User, Reply as ReplyType } from "../../types/interfaces";
import { useState } from "react";
import Reply from "./Reply";
import ReplyBox from "./ReplyBox";
import DeleteModal from "./DeleteModal";
import { useProject } from "../contexts/ProjectProvider";
import {
  handleDelete,
  handleDislike,
  handleEdit,
  handleLike,
  timeAgo,
} from "../helpers/helpers";

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-inline: auto;
  padding: 20px;
  background-color: var(--white);
  margin-top: 2rem;
  border-radius: 0.5rem;

  position: relative;

  @media (min-width: 1000px) {
    flex-direction: row;
    gap: 1rem;
    align-items: start;
  }
`;

const FlexTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FlexBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
`;

const Image = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  background-color: var(--very-light-gray);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  user-select: none;

  @media (min-width: 1000px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Plus = styled.span`
  color: var(--grayish-blue);
  cursor: pointer;
  user-select: none;
`;

const Minus = styled.span`
  color: var(--grayish-blue);
  cursor: pointer;
  user-select: none;
`;

const Score = styled.span`
  color: var(--dark-blue);
  font-weight: 600;
  user-select: none;
`;

const Content = styled.p`
  color: var(--grayish-blue);
  margin-top: 1rem;
`;

const ReplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: var(--dark-blue);
  font-weight: 600;

  transition: all 0.3s;

  &:hover {
    opacity: 0.6;
  }

  @media (min-width: 1000px) {
    margin-left: auto;
    position: absolute;
    right: 1.5rem;
  }
`;

const YourActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (min-width: 1000px) {
    margin-left: auto;
    position: absolute;
    right: 1.5rem;
  }
`;

const DeleteButton = styled(ReplyButton)`
  color: var(--soft-red);
  position: static;
`;

const EditButton = styled(ReplyButton)`
  color: var(--moderate-blue);
  position: static;
`;

const Nickname = styled.div`
  color: var(--grayish-blue);
  font-weight: 600;
`;

const TimeCreated = styled.div`
  color: var(--moderate-blue);
  font-size: 0.9rem;
`;

const AreYou = styled.div`
  background-color: var(--moderate-blue);
  font-weight: 600;
  color: var(--white);
  padding: 0.2rem 0.5rem;
`;

const ReplyContainer = styled.div`
  position: relative;
  width: 90%;
  margin-inline: auto;

  &::after {
    content: "";
    display: block;
    width: 1px;
    height: 100%;
    left: 2%;
    top: 0;
    position: absolute;
    background-color: var(--light-grayish-blue);

    @media (min-width: 1000px) {
      margin-left: 1.25rem;
    }
  }
`;

const EditTextArea = styled.textarea`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--light-gray);
  margin-block: 1rem;
  width: 100%;
  resize: vertical;
`;

const ButtonPrimary = styled.button`
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
`;

const ButtonSecondary = styled(ButtonPrimary)`
  background-color: var(--grayish-blue);
`;

const EditButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
`;

export default function Card({
  cardData,
  currentUser,
  setComments,
}: {
  cardData: Comment;
  currentUser: User | undefined;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) {
  const [count, setCount] = useState(cardData.score);
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
  const [replies, setReplies] = useState<ReplyType[]>(cardData.replies ?? []);
  const isCurrentUser = cardData.user.username === currentUser?.username;
  const [edit, setEdit] = useState<boolean>(false);
  const [textAreaEdit, setTextAreaEdit] = useState<string>(cardData.content);
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);

  const { isMobile } = useProject();

  return (
    <>
      {isMobile ? (
        <StyledCard>
          <FlexTop>
            <Image src={cardData.user.image.png} alt="" />
            <Nickname>{cardData.user.username}</Nickname>
            {isCurrentUser && <AreYou>you</AreYou>}
            <TimeCreated>{timeAgo(cardData.createdAt)}</TimeCreated>
          </FlexTop>

          {edit ? (
            <EditTextArea
              value={textAreaEdit}
              onChange={(e) => setTextAreaEdit(e.target.value)}
            ></EditTextArea>
          ) : (
            <Content>{cardData.content}</Content>
          )}
          {edit ? (
            <EditButtonsContainer>
              <ButtonSecondary onClick={() => setEdit(false)}>
                Cancel
              </ButtonSecondary>
              <ButtonPrimary
                onClick={() =>
                  handleEdit(setEdit, edit, textAreaEdit, cardData, setComments)
                }
              >
                Save
              </ButtonPrimary>
            </EditButtonsContainer>
          ) : (
            <FlexBottom>
              <ScoreContainer>
                <Plus
                  onClick={() =>
                    handleLike(
                      setCount,
                      cardData,
                      setComments,
                      undefined,
                      undefined
                    )
                  }
                >
                  +
                </Plus>
                <Score>{count}</Score>
                <Minus
                  onClick={() =>
                    handleDislike(
                      setCount,
                      cardData,
                      setComments,
                      undefined,
                      undefined
                    )
                  }
                >
                  -
                </Minus>
              </ScoreContainer>
              {isCurrentUser ? (
                <YourActions>
                  <DeleteButton onClick={() => setShowModalDelete(true)}>
                    <img src="./images/icon-delete.svg" alt="" />
                    Delete
                  </DeleteButton>
                  <EditButton onClick={() => setEdit(true)}>
                    <img src="./images/icon-edit.svg" alt="" />
                    Edit
                  </EditButton>
                </YourActions>
              ) : (
                <ReplyButton onClick={() => setShowReplyBox(!showReplyBox)}>
                  <img src="./images/icon-reply.svg" alt="" />
                  Reply
                </ReplyButton>
              )}
            </FlexBottom>
          )}
          {showModalDelete && (
            <DeleteModal
              setShowModalDelete={setShowModalDelete}
              handleDelete={() => handleDelete(cardData, setComments)}
            />
          )}
        </StyledCard>
      ) : (
        <StyledCard>
          <FlexBottom>
            <ScoreContainer>
              <Plus
                onClick={() =>
                  handleLike(
                    setCount,
                    cardData,
                    setComments,
                    undefined,
                    undefined
                  )
                }
              >
                +
              </Plus>
              <Score>{count}</Score>
              <Minus
                onClick={() =>
                  handleDislike(
                    setCount,
                    cardData,
                    setComments,
                    undefined,
                    undefined
                  )
                }
              >
                -
              </Minus>
            </ScoreContainer>
          </FlexBottom>
          <div>
            <FlexTop>
              <Image src={cardData.user.image.png} alt="" />
              <Nickname>{cardData.user.username}</Nickname>
              {isCurrentUser && <AreYou>you</AreYou>}
              <TimeCreated>{timeAgo(cardData.createdAt)}</TimeCreated>
              {isCurrentUser ? (
                <YourActions>
                  <DeleteButton onClick={() => setShowModalDelete(true)}>
                    <img src="./images/icon-delete.svg" alt="" />
                    Delete
                  </DeleteButton>
                  <EditButton onClick={() => setEdit(true)}>
                    <img src="./images/icon-edit.svg" alt="" />
                    Edit
                  </EditButton>
                </YourActions>
              ) : (
                <ReplyButton onClick={() => setShowReplyBox(!showReplyBox)}>
                  <img src="./images/icon-reply.svg" alt="" />
                  Reply
                </ReplyButton>
              )}
            </FlexTop>
            {edit ? (
              <EditTextArea
                cols={60}
                rows={5}
                value={textAreaEdit}
                onChange={(e) => setTextAreaEdit(e.target.value)}
              ></EditTextArea>
            ) : (
              <Content>{cardData.content}</Content>
            )}
            {edit ? (
              <EditButtonsContainer>
                <ButtonSecondary onClick={() => setEdit(false)}>
                  Cancel
                </ButtonSecondary>
                <ButtonPrimary
                  onClick={() =>
                    handleEdit(
                      setEdit,
                      edit,
                      textAreaEdit,
                      cardData,
                      setComments
                    )
                  }
                >
                  Save
                </ButtonPrimary>
              </EditButtonsContainer>
            ) : (
              <></>
            )}
          </div>
          {showModalDelete && (
            <DeleteModal
              setShowModalDelete={setShowModalDelete}
              handleDelete={() => handleDelete(cardData, setComments)}
            />
          )}
        </StyledCard>
      )}
      {showReplyBox && (
        <ReplyBox
          currentUser={currentUser}
          setReplies={setReplies}
          setShowReplyBox={setShowReplyBox}
          replyTo={cardData.user.username}
          replyingTo="comment"
          cardData={cardData}
          setComments={setComments}
        />
      )}
      <ReplyContainer>
        {replies?.length
          ? replies.map((reply) => (
              <Reply
                key={reply.id}
                replyData={reply}
                currentUser={currentUser}
                setReplies={setReplies}
                cardData={cardData}
                setComments={setComments}
              />
            ))
          : ""}
      </ReplyContainer>
    </>
  );
}
