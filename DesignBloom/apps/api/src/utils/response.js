export function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...headers,
  });

  if (res.req?.method === "HEAD") {
    res.end();
    return;
  }

  res.end(JSON.stringify(payload));
}
