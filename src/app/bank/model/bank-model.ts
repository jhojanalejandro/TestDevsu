export interface Product{
  id: string;
  logo: string;
  name: string
  description: string;
  date_release: Date;
  date_revision: Date;
}
export interface IResponse{
  sucesss: boolean;
  data: any;
  message: string
}
