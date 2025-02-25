import axios from 'axios';

axios.interceptors.request.use(
  (config) => {
    const { origin } = new URL(config.url as string);

    const allowedOrigins: string[] = [
      import.meta.env.VITE_BASE_ENDPOINT as string,
    ];
    const token: string | null = localStorage.getItem('access-token');

    if (allowedOrigins.includes(origin)) {
      config.headers.authorization = token;
    }
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  }
);

interface FetchProductListParams {
  pageParam?: number;
}
export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  createdAt: Date;
}

export interface FetchProductListResponse {
  data: Product[];
}

export const fetchProductList = async ({
  pageParam = 1,
}: FetchProductListParams): Promise<Product[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_ENDPOINT}/product?page=${pageParam}`
  );

  return data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_ENDPOINT}/product/${id}`
  );

  return data;
};

export const postProduct = async (input: any): Promise<unknown> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_ENDPOINT}/product/`,
    input
  );

  return data;
};

export const fetchRegister = async (input: any): Promise<any> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_ENDPOINT}/auth/register`,
    input
  );

  return data;
};

export const fetchLogin = async (input: any): Promise<any> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_ENDPOINT}/auth/login`,
    input
  );

  return data;
};

export const fetchMe = async (): Promise<any> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_ENDPOINT}/auth/me`
  );

  return data;
};

export const fetchLogout = async (): Promise<any> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_ENDPOINT}/auth/logout`,
    {
      refresh_token: localStorage.getItem('refresh-token'),
    }
  );

  return data;
};

export const postOrder = async (input: any): Promise<any> => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_ENDPOINT}/order`,
    input
  );

  return data;
};

export const fetchOrders = async (): Promise<any> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BASE_ENDPOINT}/order`
  );

  return data;
};

export const deleteProduct = async (product_id: string): Promise<any> => {
  const { data } = await axios.delete(
    `${import.meta.env.VITE_BASE_ENDPOINT}/product/${product_id}`
  );

  return data;
};

export const updateProduct = async (
  input: Partial<Product>,
  product_id: string
): Promise<unknown> => {
  const { data } = await axios.put(
    `${import.meta.env.VITE_BASE_ENDPOINT}/product/${product_id}`,
    input
  );

  return data;
};
