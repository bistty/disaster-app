export interface Disaster {
  id: string;
  data: DisasterData;
}
export interface DisasterData {
  title: string;
  category: {
    categoryId: string;
    category: string;
  };
  disasterImgPath: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  uid: string;
  createdAt: any;
}
