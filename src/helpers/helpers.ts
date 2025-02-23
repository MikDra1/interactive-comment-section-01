import React from "react";
import { User, Comment, Reply } from "../../types/interfaces";
import { formatDistanceToNow } from "date-fns";

export function newCommentHandleSubmit(
  e: React.FormEvent<HTMLFormElement>,
  content: string,
  currentUser: User,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>
) {
  e.preventDefault();
  if (content === "") return;

  setComments((prevComments) => {
    const updatedComments = [
      ...prevComments,
      {
        id: new Date().getTime() + Math.random(),
        user: currentUser,
        content: content,
        score: 0,
        replies: [],
        createdAt: new Date().toString(),
        wasLiked: false,
      },
    ];

    localStorage.setItem("comments", JSON.stringify(updatedComments));

    return updatedComments;
  });
}

export function handleEdit(
  setEdit: React.Dispatch<React.SetStateAction<boolean>>,
  edit: boolean,
  textAreaEdit: string,
  cardData: Comment,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  replyData?: Reply,
  setReplies?: React.Dispatch<React.SetStateAction<Reply[]>>
) {
  if (replyData && setReplies) {
    setEdit(!edit);
    replyData.content = textAreaEdit;

    setReplies((prevReplies) => {
      const updatedReplies = prevReplies.map((reply) => {
        if (reply.id === replyData.id) {
          return { ...reply, content: textAreaEdit }; // Update only this reply's content
        }
        return reply;
      });

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

  if (!replyData && !setReplies) {
    setEdit(!edit);
    cardData.content = textAreaEdit;

    setComments((prevComments) => {
      const newComments = prevComments.map((comment) => {
        if (comment.id === cardData.id) {
          return cardData;
        }
        return comment;
      });
      localStorage.setItem("comments", JSON.stringify(newComments));
      return newComments;
    });
  }
}

export function handleDelete(
  cardData: Comment,
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>,
  setReplies?: React.Dispatch<React.SetStateAction<Reply[]>>,
  replyData?: Reply
) {
  if (replyData && setReplies) {
    setReplies((prevReplies) => {
      const newReplies = prevReplies.filter(
        (reply) => reply.id !== replyData.id
      );

      setComments((prevComments) => {
        const updatedComments = prevComments.map((comment) => {
          if (comment.id === cardData.id) {
            return { ...comment, replies: newReplies }; // Update only this comment's replies
          }
          return comment;
        });

        localStorage.setItem("comments", JSON.stringify(updatedComments)); // Save full updated comments array
        return updatedComments;
      });

      return newReplies;
    });
  }

  if (!replyData && !setReplies) {
    setComments((prevComments) => {
      const newComments = prevComments.filter(
        (comment) => comment.id !== cardData.id
      );
      localStorage.setItem("comments", JSON.stringify(newComments));
      return newComments;
    });
  }
}

export function handleLike(
  setCount: React.Dispatch<React.SetStateAction<number>>,
  cardData?: Comment,
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>,
  setReplies?: React.Dispatch<React.SetStateAction<Reply[]>>,
  replyData?: Reply
) {

  if (cardData && setComments) {
    if (cardData.wasLiked) return; // If the comment was not liked, return early
    setCount(cardData.score + 1); // Decrease the score

    // Update the cardData object
    cardData.wasLiked = true;

    // Update the comments array in state and localStorage
    setComments((prevComments) => {
      const updatedComments = prevComments.map((comment) => {
        if (comment.id === cardData.id) {
          return {
            ...comment,
            score: cardData.score + 1, // Decrease the score
            wasLiked: true, // Set wasLiked to false
          };
        }
        return comment;
      });

      // Save the full updated comments array to localStorage
      localStorage.setItem("comments", JSON.stringify(updatedComments));
      return updatedComments;
    });
  }

  if (replyData && setReplies) {
    if (replyData.wasLiked) return; // If the reply was not liked, return early
    setCount(replyData.score + 1); // Decrease the score
    replyData.wasLiked = true; // Update replyData object

    setReplies((prevReplies) => {
      const updatedReplies = prevReplies.map((reply) => {
        if (reply.id === replyData.id) {
          return {
            ...reply,
            score: replyData.score + 1,
            wasLiked: true,
          };
        }
        return reply;
      });

      // Update the replies in localStorage
      const storedComments = JSON.parse(
        localStorage.getItem("comments") || "[]"
      );

      const updatedComments = storedComments.map((comment: Comment) => {
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply: Reply) =>
              reply.id === replyData.id
                ? { ...reply, score: replyData.score + 1, wasLiked: true }
                : reply
            ),
          };
        }
        return comment;
      });

      localStorage.setItem("comments", JSON.stringify(updatedComments));
      return updatedReplies;
    });
  }
}

export function handleDislike(
  setCount: React.Dispatch<React.SetStateAction<number>>,
  cardData?: Comment,
  setComments?: React.Dispatch<React.SetStateAction<Comment[]>>,
  setReplies?: React.Dispatch<React.SetStateAction<Reply[]>>,
  replyData?: Reply
) {
  if (cardData && setComments) {
    if (!cardData.wasLiked) return; // If the comment was not liked, return early
    setCount(cardData.score - 1); // Decrease the score

    // Update the cardData object
    cardData.wasLiked = false;

    // Update the comments array in state and localStorage
    setComments((prevComments) => {
      const updatedComments = prevComments.map((comment) => {
        if (comment.id === cardData.id) {
          return {
            ...comment,
            score: cardData.score - 1, // Decrease the score
            wasLiked: false, // Set wasLiked to false
          };
        }
        return comment;
      });

      // Save the full updated comments array to localStorage
      localStorage.setItem("comments", JSON.stringify(updatedComments));
      return updatedComments;
    });
  }

  if (replyData && setReplies) {
    if (!replyData.wasLiked) return; // If the reply was not liked, return early
    setCount(replyData.score - 1); // Decrease the score
    replyData.wasLiked = false; // Update replyData object

    setReplies((prevReplies) => {
      const updatedReplies = prevReplies.map((reply) => {
        if (reply.id === replyData.id) {
          return {
            ...reply,
            score: replyData.score - 1,
            wasLiked: false,
          };
        }
        return reply;
      });

      // Update the replies in localStorage
      const storedComments = JSON.parse(
        localStorage.getItem("comments") || "[]"
      );

      const updatedComments = storedComments.map((comment: Comment) => {
        if (comment.replies) {
          return {
            ...comment,
            replies: comment.replies.map((reply: Reply) =>
              reply.id === replyData.id
                ? { ...reply, score: replyData.score - 1, wasLiked: false }
                : reply
            ),
          };
        }
        return comment;
      });

      localStorage.setItem("comments", JSON.stringify(updatedComments));
      return updatedReplies;
    });
  }
}

export function timeAgo(dateString: string): string {
  console.log(dateString)
  const date = new Date(dateString)
  return formatDistanceToNow(date, { addSuffix: true });
}
