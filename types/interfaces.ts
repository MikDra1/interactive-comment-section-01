export interface User {
  image: {
    png: string;
    webp: string;
  };
  username: string;
}

export interface Reply {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  replyingTo: string;
  wasLiked: boolean;
  user: User;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: User;
  wasLiked: boolean;
  replies: Reply[];
}

export interface CommentData {
  currentUser: User;
  comments: Comment[];
}
