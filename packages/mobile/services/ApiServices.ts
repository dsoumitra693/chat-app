import { RequestOptionsBuilder } from '@/utils/requestOptionsBuilder';
import axios, { AxiosResponse } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_AUTH_API_URL!;

export class ApiService {
  private static instance: ApiService;
  private requestOptionsBuilder: RequestOptionsBuilder;

  private constructor(requestOptionsBuilder: RequestOptionsBuilder) {
    this.requestOptionsBuilder = requestOptionsBuilder;
  }

  static getInstance(baseUrl: string): ApiService {
    if (!ApiService.instance) {
      const requestOptionsBuilder = RequestOptionsBuilder.getInstance(baseUrl);
      ApiService.instance = new ApiService(requestOptionsBuilder);
    }
    return ApiService.instance;
  }

  async request<T>(
    url: string,
    method: string,
    data: Record<string, string> = {},
    headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
  ): Promise<AxiosResponse<T>> {
    try {
      const requestOptions = this.requestOptionsBuilder.buildRequestOptions(
        url,
        method,
        data,
        headers
      );
      const response = await axios.request<T>(requestOptions);
      return response;
    } catch (error: any) {
      console.error('Error:', error);
      throw new Error(error);
    }
  }
}

export const apiService = ApiService.getInstance(BASE_URL);
