import { SquidexError } from '@squidex/squidex';
import { ContentDto } from '@squidex/squidex/api';
import React, { useState, useEffect } from 'react';
import { getSquidexClient } from './client';

type ContentResult<T> = { isLoading: boolean, error?: any, result?: T | null };
type ContentItem<T> = Omit<ContentDto, 'data'> & { data: T };
type Transform<T> = (input: any) => T;

export const useSquidexContentById = <T>(schemaName: string, id: string, options?: { unpublished?: boolean }) => {
  const client = getSquidexClient();
  const [result, setResult] = useState<ContentResult<ContentItem<T>>>({ isLoading: false });
  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  useEffect(() => {
    async function load() {
      try {
        const content = await client.contents.getContent(schemaName, id, { unpublished: optionsRef.current?.unpublished });

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
  }, [client, schemaName, id]);

  return result;
};

export const useSquidexContentByFilter = <T>(schemaName: string, filter: string, options?: { unpublished?: boolean }) => {
  const client = getSquidexClient();
  const [result, setResult] = React.useState<ContentResult<ContentItem<T>>>({ isLoading: false });
  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  useEffect(() => {
    async function load() {
      try {
        const contents = await client.contents.getContents(schemaName, { filter, unpublished: optionsRef.current?.unpublished });
        const content = contents.items[0];

        setResult(value => ({ ...value, result: (content as any) as ContentItem<T> }));
      } catch (error: any) {
        setResult(value => ({ ...value, error }));
      } finally {
        setResult(value => ({ ...value, isLoading: false }));
      }
    }

    load();
  }, [client, schemaName, filter]);

  return result;
};

export const useSquidexContentsByGraphQL = <T>(query: string, options?: { unpublished?: boolean, transform?: Transform<T> }) => {
  const client = getSquidexClient();
  const [result, setResult] = React.useState<ContentResult<T>>({ isLoading: false });
  const optionsRef = React.useRef(options);

  optionsRef.current = options;

  useEffect(() => {
    async function load() {
      try {
        const contents = await client.contents.getGraphQl({ query, unpublished: optionsRef.current?.unpublished });

        if ((contents as any).error) {
          setResult(value => ({ ...value, error: (contents as any).error }));
          return;
        }

        setResult(value => ({ ...value, result: optionsRef.current?.transform?.(contents) || contents as T }));
      } catch (error: any) {
        setResult(value => ({ ...value, error }));
      } finally {
        setResult(value => ({ ...value, isLoading: false }));
      }
    }

    load();
  }, [client, query]);

  return result;
};