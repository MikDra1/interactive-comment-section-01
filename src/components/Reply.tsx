import styled from "styled-components";
import { Comment, Reply as ReplyType, User } from "../../types/interfaces";
import { useState } from "react";
import DeleteModal from "./DeleteModal";
import ReplyBox from "./ReplyBox";
import { useProject } from "../contexts/ProjectProvider";
import {
  handleDelete,
  handleDislike,
  handleEdit,
  handleLike,
  timeAgo,
} from "../helpers/helpers";

const Container = styled.div``;

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8vw;
  position: relative;

  padding: 20px;
  background-color: var(--white);
  margin-top: 2rem;
  border-radius: 0.5rem;

  @media (min-width: 1000px) {
    flex-direction: row;
    gap: 1rem;
    align-items: start;
    margin-left: 6rem;
  }
`;

const FlexTop = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
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

  & span {
    color: var(--moderate-blue);
    font-weight: 600;
  }
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
  color: var(--grayish-blue);
  font-size: 0.9rem;
`;

const AreYou = styled.div`
  background-color: var(--moderate-blue);
  font-weight: 600;
  color: var(--white);
  padding: 0.2rem 0.5rem;
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

const EditTextArea = styled.textarea`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--light-gray);
  margin-block: 1rem;
  width: 100%;
  resize: vertical;
`;

export default function Reply({
  replyData,
  currentUser,
  setReplies,
  cardData,
  setComments,
}: {
  replyData: ReplyType;
  currentUser: User | undefined;
  setReplies: React.Dispatch<React.SetStateAction<ReplyType[]>>;
  cardData: Comment;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}) {
  const [count, setCount] = useState(replyData.score);
  const isCurrentUser = replyData.user.username === currentUser?.username;
  const [edit, setEdit] = useState<boolean>(false);
  const [textAreaEdit, setTextAreaEdit] = useState<string>(
    `${replyData.content}`
  );
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showReplyBox, setShowReplyBox] = useState<boolean>(false);

  const { isMobile } = useProject();


  return (
    <Container>
      {isMobile ? (
        <StyledCard>
          <FlexTop>
            <Image src={replyData.user.image.png} alt="" />
            <Nickname>{replyData.user.username}</Nickname>
            {isCurrentUser && <AreYou>you</AreYou>}
            <TimeCreated>{timeAgo(replyData.createdAt)}</TimeCreated>
          </FlexTop>
          {edit ? (
            <EditTextArea
              value={textAreaEdit}
              onChange={(e) => setTextAreaEdit(e.target.value)}
            ></EditTextArea>
          ) : (
            <Content>
              <span>@{replyData.replyingTo}</span> {replyData.content}
            </Content>
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
                    setComments,
                    replyData,
                    setReplies
                  )
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
                      undefined,
                      undefined,
                      setReplies,
                      replyData
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
                      undefined,
                      undefined,
                      setReplies,
                      replyData
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
              handleDelete={() =>
                handleDelete(cardData, setComments, setReplies, replyData)
              }
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
                    undefined,
                    undefined,
                    setReplies,
                    replyData
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
                    undefined,
                    undefined,
                    setReplies,
                    replyData
                  )
                }
              >
                -
              </Minus>
            </ScoreContainer>
          </FlexBottom>
          <div>
            <FlexTop>
              <Image src={replyData.user.image.png} alt="" />
              <Nickname>{replyData.user.username}</Nickname>
              {isCurrentUser && <AreYou>you</AreYou>}
              <TimeCreated>{timeAgo(replyData.createdAt)}</TimeCreated>
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
              <Content>
                <span>@{replyData.replyingTo}</span> {replyData.content}
              </Content>
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
                      setComments,
                      replyData,
                      setReplies
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
              handleDelete={() =>
                handleDelete(cardData, setComments, setReplies, replyData)
              }
            />
          )}
        </StyledCard>
      )}
      {showReplyBox && (
        <ReplyBox
          currentUser={currentUser}
          setReplies={setReplies}
          setShowReplyBox={setShowReplyBox}
          replyTo={replyData.user.username}
          replyingTo="reply"
          cardData={cardData}
          setComments={setComments}
        />
      )}
    </Container>
  );
}
