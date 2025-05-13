import { GET_METHOD } from '@/lib/req';
import { API_URL } from '@/lib/utils';

export default function LogoutPage() {
  GET_METHOD(`${API_URL}/api/logout`).then(() => {
  }).catch(() => {
  });
}