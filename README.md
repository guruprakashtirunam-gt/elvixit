# AI Email Generator — Frontend

Plain HTML/CSS/JavaScript frontend (no build step, no framework).

## Configure the backend URL

Edit `config.js` before deploying:

```js
window.API_BASE_URL = 'https://your-backend.onrender.com';
```

Leave it as `''` for local development against a backend running on the same
origin, or set it to `http://127.0.0.1:5000` if running the backend locally
on a different port.

## Local preview

Just open `index.html` in a browser, or serve the folder with any static
file server, e.g.:

```bash
python -m http.server 8080
```

## Deployment

See the deployment guide provided alongside this project for exact Render
Static Site settings.
