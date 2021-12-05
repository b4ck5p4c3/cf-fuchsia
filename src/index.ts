import router from './router'
import safeCompare from './utils/safe-compare'

addEventListener('fetch', (event) =>
  event.respondWith(
    (async () => {
      // Check is API secret set
      if (typeof API_BEARER !== 'string')
        return new Response(
          JSON.stringify({
            status: 500,
            message: 'Execution disabled due to insecure configuration',
          }),
          { status: 500, headers: { 'Content-type': 'application/json' } },
        )

      // Extract and check a correctness of Authorization header
      const authorization = event.request.headers.get('Authorization')
      if (authorization === null)
        return new Response(
          JSON.stringify({
            status: 401,
            message: 'Authorization token is required',
          }),
          { status: 401, headers: { 'Content-type': 'application/json' } },
        )

      // Ensure that authorization token structure is correct
      const [authSchema, authToken] = authorization.split(' ')
      if (authSchema.toLowerCase() !== 'bearer' || typeof authToken !== 'string')
        return new Response(
          JSON.stringify({
            status: 401,
            message: 'Incorrect authorization token',
          }),
          { status: 401, headers: { 'Content-type': 'application/json' } },
        )

      // Validate request's API token
      if (!safeCompare(API_BEARER, authToken))
        return new Response(
          JSON.stringify({
            status: 403,
            message: 'Invalid authorization token',
          }),
          { status: 403, headers: { 'Content-type': 'application/json' } },
        )

      // If authentication is valid, pass the request into instance-wide router
      return router.handle(event.request)
    })(),
  ),
)
