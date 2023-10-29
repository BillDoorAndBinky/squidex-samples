import { SquidexClient, SquidexError } from '@squidex/squidex';
import { ContentDto } from '@squidex/squidex/api';
import * as React from 'react';

const client = new SquidexClient({
  clientId: 'acme-sample:default',
  clientSecret: 'upuxhqgubhnhxlu77voejbbxxcueakxokzmjf9xax94x',
  appName: 'acme-sample'
});

export const useSquidexClient = () => {
  return client;
};

type ContentResult<T> = { isLoading: boolean, error?: any, result?: T | null };
type ContentItem<T> = Omit<ContentDto, 'data'> & { data: T };
type Transform<T> = (input: any) => T;

export const useSquidexContentById = <T>(schemaName: string, id: string, options?: { unpublished?: boolean }) => {
  const client = useSquidexClient();
  const [result, setResult] = React.useState<ContentResult<ContentItem<T>>>({ isLoading: false });

  React.useEffect(() => {
    async function load() {
      try {
        const content = await client.contents.getContent(schemaName, id, { unpublished: options?.unpublished });

        setResult(value => ({ ...value, result: (content as any) as ContentItem<T> }));
      } catch (error: any) {
        if (error instanceof SquidexError) {
          if (error.statusCode === 400) {
            setResult(value => ({ ...value, result: null }));
          }
        }

        setResult(value => ({ ...value, error }));
      } finally {
        setResult(value => ({ ...value, isLoading: false }));
      }
    }

    load();
  }, [client, schemaName, id, options?.unpublished]);

  return result;
};

export const useSquidexContentByFilter = <T>(schemaName: string, filter: string, options?: { unpublished?: boolean }) => {
  const client = useSquidexClient();
  const [result, setResult] = React.useState<ContentResult<ContentItem<T>>>({ isLoading: false });

  React.useEffect(() => {
    async function load() {
      try {
        const contents = await client.contents.getContents(schemaName, { filter, unpublished: options?.unpublished });
        const content = contents.items[0];

        setResult(value => ({ ...value, result: (content as any) as ContentItem<T> }));
      } catch (error: any) {
        setResult(value => ({ ...value, error }));
      } finally {
        setResult(value => ({ ...value, isLoading: false }));
      }
    }

    load();
  }, [client, schemaName, filter, options?.unpublished]);

  return result;
};

export const useSquidexContentsByGraphQL = <T>(body: any, options?: { unpublished?: boolean, transform?: Transform<T> }) => {
  const client = useSquidexClient();
  const [result, setResult] = React.useState<ContentResult<T>>({ isLoading: false });

  React.useEffect(() => {
    async function load() {
      try {
        const contents = await client.contents.postGraphQl({ body, unpublished: options?.unpublished });

        setResult(value => ({ ...value, result: options?.transform?.(contents) || contents as T }));
      } catch (error: any) {
        setResult(value => ({ ...value, error }));
      } finally {
        setResult(value => ({ ...value, isLoading: false }));
      }
    }

    load();
  }, [client, body, options]);

  return result;
};