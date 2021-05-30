export interface IPost {
  id: number;
  name: string;
  content: string;
  likes: number;
  photoUrl: string;
  handle: string;
  updatedAt: Date;
  createdAt: Date;
}
