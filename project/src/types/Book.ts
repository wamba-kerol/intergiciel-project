export interface BookType {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  borrowDate?: Date;
  returnDate?: Date;
  borrower?: string;
}
