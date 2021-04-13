import axios, { AxiosResponse } from 'axios';
import express from 'express';
import qs from 'qs';
import { addToCache, computeCacheKey, getFromCache, purgeBySurrogateKey } from './cache';

const app = express();

const CACHE_DURATION = 10 * 60;

const port = 3000;

const clientId = 'squidex-website:reader';
const clientSecret = 'yy9x4dcxsnp1s34r2z19t88wedbzxn1tfq7uzmoxf60x';
const squidexUrl = 'https://cloud.squidex.io';

let token: string | null = '';

async function acquireToken() {
    if (token) {
        return token;
    }

    try {
        const response = await axios.post(`${squidexUrl}/identity-server/connect/token`, qs.stringify({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'squidex-api'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        token = `Bearer ${response.data.access_token}`;

        console.log('Bearer Token acquired');
    } catch (ex) {
        token = null;
        
        console.log(`Bearer Token acquired failed with ${ex.response.status}, ${ex.response.status.data}`);
    }

    return token;
}

app.get('/cache/purge/url/:url', async (req, res) => {
    purgeBySurrogateKey(req.params.url);

    res.end();
});

app.get('/cache/purge/key/:key', async (req, res) => {
    purgeBySurrogateKey(req.params.key);
    
    res.end();
});

app.get('/*', async (req, res) => {
    const url = `${squidexUrl}${req.path}?${qs.stringify(req.query)}`;

    const cacheKey = computeCacheKey(url, req.headers);

    let response = await getFromCache<AxiosResponse>(cacheKey);
    let responseFromCache = !!response;

    if (!response) {
        let token = await acquireToken();

        // Return 401: NotAuthorized when the token is invalid.
        if (!token) {
            res.status(401);
            res.end();
            return;
        }

        const headers: { [key: string]: string | string[] | undefined } = {
            Authorization: token
        }

        // Copy custom squidex headers to our request.
        for (const key in req.headers) {
            if (key.startsWith('X-')) {
                headers[key] = req.headers[key];
            }
        }
        try {
            response = await axios.get(url, {
                headers
            });
        } catch (ex) {
            response = ex.response;
        }

        // The token is probably expired, try again.
        if (response && response.status === 401) {
            token = null;
            
            // Return 401: NotAuthorized when the token is invalid.
            if (!token) {
                res.status(401);
                res.end();
                return;
            }

            headers['Authorization'] = token;

            try {
                response = await axios.get(url, {
                    headers
                });
            } catch (ex) {
                response = ex.response;
            }
        }

        if (response && response.status === 200) {
            const { data, headers } = response;

            const cacheEntry = {
                data,
                headers,
                status: 200
            };
   
            const surrogateKeys = [url];

            const keys = response.headers['surrogate-key'];

            if (keys) {
                if (typeof keys === 'string') {
                    for (const key of keys.split(' ')) {
                        surrogateKeys.push(key);
                    }
                } else if (keys) {
                    for (const key of keys) {
                        surrogateKeys.push(key);
                    }
                }
            }

            addToCache(cacheKey, cacheEntry, surrogateKeys, CACHE_DURATION);
        }
    }

    if (!response) {
        res.status(404).end();
        return;
    }

    for (const key in response.headers) {
        if (key !== 'surrogate-key') {
            res.header(key, response.headers[key]);
        }
    }

    if (responseFromCache) {
        res.header('cache-status', 'hit');
    } else {
        res.header('cache-status', 'miss');
    }

    res.status(response.status).send(response.data).end();
});

app.listen(port, () => {
    console.log(`proxy app listening at http://localhost:${port}`)
});
