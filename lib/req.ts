import axios from 'axios';

const ReturnError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error('❌ Axios error:', error.response?.data || error.message);
    return new Response(JSON.stringify({ error: error.response?.data?.message || error.message }), {
      status: error.response?.status || 500,
    });
  } else if (error instanceof Error) {
    console.error('❌ Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } else {
    console.error('❌ Unknown error:', error);
    return new Response(JSON.stringify({ error: 'Unknown error occurred' }), { status: 500 });
  }
};

export async function POST_METHOD(url: string, body: unknown, token?: string) {
  try {
    const { data } = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });

    if (data && data.success && data.data) {
      return data.data;
    }

    return data;
  } catch (error: unknown) {
    return ReturnError(error);
  }
}

export async function GET_METHOD(url: string, token?: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: true,
    });
    if (data && data.success && data.data) {
      return data.data;
    }
    return data;
  } catch (error: unknown) {
    return ReturnError(error);
  }
}

export async function DELETE_METHOD(url: string, token?: string) {
  try {
    const { data } = await axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: true,
    });
    if (data && data.success && data.data) {
      return data.data;
    }
    return data;
  } catch (error: unknown) {
    return ReturnError(error);
  }
}
