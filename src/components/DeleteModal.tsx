import styled from "styled-components";

const ButtonPrimary = styled.button`
  padding: 0.5rem 1rem;
  background-color: var(--grayish-blue);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const ButtonRed = styled(ButtonPrimary)`
  background-color: var(--soft-red);
`;

const ModalDelete = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  display: grid;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 90%;

  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1;
  color: var(--white);
  background-color: var(--white);
  z-index: 100;

  p {
    border-radius: 0.5rem;
    color: var(--grayish-blue);
    margin-block: 1rem;
  }

  button {
    width: 50%;
  }

  div {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (min-width: 450px) {
    width: 72%;
  }

  @media (min-width: 600px) {
    width: 55%;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const Description = styled.p`
  color: var(--dark-blue);
  max-width: 31ch;
`;

const Title = styled.h2`
  color: var(--dark-blue);
  font-weight: 500;
`;

export default function DeleteModal({
  setShowModalDelete,
  handleDelete,
}: {
  setShowModalDelete: React.Dispatch<React.SetStateAction<boolean>>;
  handleDelete: () => void;
}) {
  return (
    <div>
      <ModalDelete>
        <Title>Delete comment</Title>
        <Description>
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone.
        </Description>
        <div>
          <ButtonPrimary onClick={() => setShowModalDelete(false)}>
            NO, CANCEL
          </ButtonPrimary>
          <ButtonRed onClick={handleDelete}>YES, DELETE</ButtonRed>
        </div>
      </ModalDelete>
      <Overlay />
    </div>
  );
}
