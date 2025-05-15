import { IStatus } from '@/interfaces/status.interface';

interface ISocialConfig {
  name: string;
  url: string;
}

export interface IConfig {
  api: string;
  url: string;
  discount: number;
  title: string;
  description: string;
  keywords: string[];
  address: string;
  phone: string;
  social: ISocialConfig[];
  status: IStatus[];
}