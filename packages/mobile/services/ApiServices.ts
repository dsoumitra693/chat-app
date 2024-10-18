import { RequestOptionsBuilder } from '@/utils/requestOptionsBuilder';
import axios from 'axios';

const AUTH_API_URL = process.env.EXPO_PUBLIC_AUTH_API_URL!;
const USER_API_URL = process.env.EXPO_PUBLIC_USER_API_URL!;

interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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
   * Creates a new instance of `ApiService` for the given base URL.
   * @param baseUrl - The base URL for the API requests.
   * @returns A new instance of `ApiService` that can be used independently.
   */
  static createInstance(baseUrl: string): ApiService {
    const requestOptionsBuilder = RequestOptionsBuilder.getInstance(baseUrl);
    return new ApiService(requestOptionsBuilder);
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
  ): Promise<APIResponse<T>> {
    try {
      const requestOptions = this.requestOptionsBuilder.buildRequestOptions(
        url,
        method,
        data,
        headers
      );
      const response = await axios.request<T>(requestOptions);
      return response.data as APIResponse<T>;
    } catch (error: any) {
      console.error('Error:', error, url);
      throw new Error(error);
    }
  }
}

// Create separate instances of `ApiService` for authentication and user-related API requests
export const authApiService = ApiService.createInstance(AUTH_API_URL);
export const userApiService = ApiService.createInstance(USER_API_URL);

