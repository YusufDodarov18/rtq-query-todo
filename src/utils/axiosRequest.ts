import axios from "axios";

export const axiosRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});
