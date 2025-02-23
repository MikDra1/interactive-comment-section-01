import { useEffect, useState } from "react";
import Card from "./components/Card";
import { Comment, User } from "../types/interfaces";
import styled from "styled-components";
import NewComment from "./components/NewComment";
import { ProjectProvider } from "./contexts/ProjectProvider";

const Container = styled.div`
  padding-bottom: 3rem;
  max-width: 50rem;
  margin-inline: auto;
`;

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (
      localStorage.getItem("currentUser") &&
      localStorage.getItem("comments")
    ) {
      setCurrentUser(JSON.parse(localStorage.getItem("currentUser")!));
      setComments(JSON.parse(localStorage.getItem("comments")!));
    } else {
      fetch("./data.json")
        .then((response) => response.json())
        .then((json) => {
          setCurrentUser(json.currentUser);
          setComments(json.comments);
          localStorage.setItem("currentUser", JSON.stringify(json.currentUser));
          localStorage.setItem("comments", JSON.stringify(json.comments));
        });
    }
  }, []);

  return (
    <ProjectProvider>
      <Container>
        {comments.map((comment: Comment) => (
          <Card
            key={comment.id}
            cardData={comment}
            currentUser={currentUser}
            setComments={setComments}
          />
        ))}
        {currentUser && (
          <NewComment currentUser={currentUser} setComments={setComments} />
        )}
      </Container>
    </ProjectProvider>
  );
}
