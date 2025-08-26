import { GoogleAuth, JWT } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

/**
 * Google Service Account Configuration
 */
export interface ServiceAccountConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

/**
 * Google Service Account Authentication Service
 * 
 * This service handles authentication using Google Service Account credentials
 * for accessing VEO 3 and other Google Cloud services.
 */
export class GoogleServiceAccountAuth {
  private auth: GoogleAuth;
  private jwtClient: JWT | null = null;
  private config: ServiceAccountConfig;
  private scopes: string[];

  constructor(serviceAccountPath: string, scopes?: string[]) {
    this.scopes = scopes || [
      'https://www.googleapis.com/auth/generative-language',
      'https://www.googleapis.com/auth/cloud-platform'
    ];

    // Load service account configuration
    this.config = this.loadServiceAccountConfig(serviceAccountPath);
    
    // Initialize Google Auth
    this.auth = new GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: this.scopes
    });

    console.log(`✅ Google Service Account initialized for project: ${this.config.project_id}`);
  }

  private loadServiceAccountConfig(filePath: string): ServiceAccountConfig {
    try {
      const fullPath = path.resolve(filePath);
      const configData = fs.readFileSync(fullPath, 'utf8');
      const config = JSON.parse(configData) as ServiceAccountConfig;
      
      if (!config.type || config.type !== 'service_account') {
        throw new Error('Invalid service account file: missing or incorrect type');
      }
      
      if (!config.private_key || !config.client_email) {
        throw new Error('Invalid service account file: missing required fields');
      }

      return config;
    } catch (error) {
      throw new Error(`Failed to load service account config: ${error.message}`);
    }
  }

  /**
   * Get JWT client for authentication
   */
  private async getJWTClient(): Promise<JWT> {
    if (!this.jwtClient) {
      this.jwtClient = new JWT({
        email: this.config.client_email,
        key: this.config.private_key,
        scopes: this.scopes
      });
    }
    return this.jwtClient;
  }

  /**
   * Get valid access token
   */
  async getAccessToken(): Promise<string> {
    try {
      const client = await this.auth.getClient();
      const accessToken = await client.getAccessToken();
      
      if (!accessToken.token) {
        throw new Error('Failed to obtain access token');
      }

      return accessToken.token;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Make authenticated API request
   */
  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const accessToken = await this.getAccessToken();
    
    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    return fetch(url, {
      ...options,
      headers
    });
  }

  /**
   * Get project ID
   */
  getProjectId(): string {
    return this.config.project_id;
  }

  /**
   * Get client email
   */
  getClientEmail(): string {
    return this.config.client_email;
  }

  /**
   * Check if authentication is valid
   */
  async isValid(): Promise<boolean> {
    try {
      await this.getAccessToken();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get authentication info
   */
  getAuthInfo(): { projectId: string; clientEmail: string; scopes: string[] } {
    return {
      projectId: this.config.project_id,
      clientEmail: this.config.client_email,
      scopes: this.scopes
    };
  }

  /**
   * Create service from file path
   */
  static fromFile(filePath: string, scopes?: string[]): GoogleServiceAccountAuth {
    return new GoogleServiceAccountAuth(filePath, scopes);
  }

  /**
   * Create service from environment variable pointing to file
   */
  static fromEnvironment(envVar: string = 'GOOGLE_SERVICE_ACCOUNT_PATH', scopes?: string[]): GoogleServiceAccountAuth {
    const filePath = process.env[envVar];
    if (!filePath) {
      throw new Error(`Environment variable ${envVar} not set`);
    }
    return new GoogleServiceAccountAuth(filePath, scopes);
  }

  /**
   * Auto-detect service account file in common locations
   */
  static autoDetect(scopes?: string[]): GoogleServiceAccountAuth {
    const commonPaths = [
      './service-account.json',
      './credentials.json',
      './lively-galaxy-7950344e0de7.json', // Your specific file
      process.env.GOOGLE_APPLICATION_CREDENTIALS,
      process.env.GOOGLE_SERVICE_ACCOUNT_PATH
    ].filter(Boolean);

    for (const filePath of commonPaths) {
      try {
        if (fs.existsSync(filePath!)) {
          console.log(`🔍 Found service account file: ${filePath}`);
          return new GoogleServiceAccountAuth(filePath!, scopes);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to load ${filePath}: ${error.message}`);
      }
    }

    throw new Error('No valid service account file found. Please set GOOGLE_APPLICATION_CREDENTIALS or place service account file in project root.');
  }
}

/**
 * Convenience function to create auth service
 */
export function createGoogleAuth(options?: {
  filePath?: string;
  scopes?: string[];
  autoDetect?: boolean;
}): GoogleServiceAccountAuth {
  const { filePath, scopes, autoDetect = true } = options || {};

  if (filePath) {
    return GoogleServiceAccountAuth.fromFile(filePath, scopes);
  }

  if (autoDetect) {
    return GoogleServiceAccountAuth.autoDetect(scopes);
  }

  return GoogleServiceAccountAuth.fromEnvironment('GOOGLE_APPLICATION_CREDENTIALS', scopes);
}

