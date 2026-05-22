import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostHog } from 'posthog-node';

@Injectable()
export class PostHogService implements OnApplicationShutdown {
  private client: PostHog | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('POSTHOG_API_KEY');
    const host = this.configService.get<string>('POSTHOG_HOST') || 'https://us.i.posthog.com';

    if (apiKey) {
      this.client = new PostHog(apiKey, {
        host,
        enableExceptionAutocapture: true,
      });
      console.log('PostHog backend SDK initialized successfully.');
    } else {
      console.warn('POSTHOG_API_KEY is not defined. PostHog tracking is disabled.');
    }
  }

  capture(params: {
    distinctId: string;
    event: string;
    properties?: Record<string, any>;
    groups?: Record<string, string>;
  }) {
    if (!this.client) return;
    try {
      this.client.capture({
        distinctId: params.distinctId,
        event: params.event,
        properties: params.properties,
        groups: params.groups,
      });
    } catch (err) {
      console.error('Error capturing event in PostHog:', err);
    }
  }

  identify(params: {
    distinctId: string;
    properties?: Record<string, any>;
  }) {
    if (!this.client) return;
    try {
      this.client.identify({
        distinctId: params.distinctId,
        properties: params.properties,
      });
    } catch (err) {
      console.error('Error identifying user in PostHog:', err);
    }
  }

  captureException(
    error: unknown,
    distinctId?: string,
    additionalProperties?: Record<string, any>,
  ) {
    if (!this.client) return;
    try {
      this.client.captureException(error, distinctId, additionalProperties);
    } catch (err) {
      console.error('Error capturing exception in PostHog:', err);
    }
  }

  async onApplicationShutdown() {
    if (this.client) {
      console.log('Shutting down PostHog client...');
      await this.client.shutdown();
    }
  }
}
