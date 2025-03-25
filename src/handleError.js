export default function handleError(error) {
  console.warn(error);
  return new Response(JSON.stringify({
    code: 400,
    message: 'An error occurred with the Spotify media player.'
  }))
}