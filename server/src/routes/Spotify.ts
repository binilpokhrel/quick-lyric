import { spotifyProps } from '@shared/constants';
import logger from '@shared/Logger';
import { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import querystring from 'querystring';
import randomstring from 'randomstring';
import { URLSearchParams } from 'url';


const router = Router();

const stateKey = 'spotify_auth_state';

/******************************************************************************
 *       Connect Spotify User (Auth Token) - "POST /api/spotify/connect"
 ******************************************************************************/

router.get('/connect', async (req: Request, res: Response) => {
  const state = randomstring.generate(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  const scope = 'user-read-email user-library-read playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: spotifyProps.client_id,
      scope: scope,
      redirect_uri: spotifyProps.redirect_uri,
      state: state
    }));
});

/******************************************************************************
 * Connect Spotify User (Access & Refresh Tokens) - "GET /api/spotify/callback"
 ******************************************************************************/

router.get('/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const state = req.query.state as string;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (!state || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      code: code,
      redirect_uri: spotifyProps.redirect_uri,
      grant_type: 'authorization_code'
    };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(authOptions)) {
      if (value) {
        params.append(key, value);
      }
    };
    const postOptions = {
      method: 'POST',
      body: params,
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotifyProps.client_id + ':' + spotifyProps.client_secret).toString('base64'))
      }
    };

    const response = await fetch('https://accounts.spotify.com/api/token', postOptions);

    if (response.ok) {
      const body = await response.json();
      const access_token = body.access_token;
      const refresh_token = body.refresh_token;

      res.redirect('http://localhost:4200/#' +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token
        }));
    } else {
      const body = await response.text();
      logger.info(body);
      res.redirect('http://localhost:4200/#' +
        querystring.stringify({
          error: 'didnt work',
          status: response.status
        }))
    }
  }
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
