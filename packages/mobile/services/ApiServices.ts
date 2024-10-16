import { RequestOptionsBuilder } from '@/utils/requestOptionsBuilder';
import axios, { AxiosResponse } from 'axios';

const AUTH_API_URL = process.env.EXPO_PUBLIC_AUTH_API_URL!;
const USER_API_URL = process.env.EXPO_PUBLIC_USER_API_URL!;

/**
 * Service class responsible for making API requests.
 * Follows singleton pattern to ensure a single instance is used across the application.
 */
export class ApiService {
  private static instance: ApiService;
  private requestOptionsBuilder: RequestOptionsBuilder;

  /**
   * Private constructor to prevent direct instantiation.
   * @param requestOptionsBuilder - An instance of `RequestOptionsBuilder` to handle building request options.
   */
  private constructor(requestOptionsBuilder: RequestOptionsBuilder) {
    this.requestOptionsBuilder = requestOptionsBuilder;
  }

  /**
   * Retrieves the singleton instance of `ApiService` for the given base URL.
   * @param baseUrl - The base URL for the API requests.
   * @returns The singleton instance of `ApiService`.
   */
  static getInstance(baseUrl: string): ApiService {
    if (!ApiService.instance) {
      const requestOptionsBuilder = RequestOptionsBuilder.getInstance(baseUrl);
      ApiService.instance = new ApiService(requestOptionsBuilder);
    }
    return ApiService.instance;
  }

  /**
   * Makes an API request using the provided URL, HTTP method, data, and headers.
   * @template T - The type of the response data.
   * @param url - The URL for the API request.
   * @param method - The HTTP method (e.g., 'GET', 'POST').
   * @param data - The request body data (optional, default is an empty object).
   * @param headers - The headers to send with the request (optional, default is 'Content-Type: application/json').
   * @returns A promise that resolves to the Axios response with the response data of type `T`.
   * @throws An error if the request fails.
   */
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

/**
 * Singleton instance of `ApiService` for authentication API requests.
 */
export const authApiService = ApiService.getInstance(AUTH_API_URL);

/**
 * Singleton instance of `ApiService` for user-related API requests.
 */
export const userApiService = ApiService.getInstance(USER_API_URL);
