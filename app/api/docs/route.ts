import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/docs - Serve Scalar API documentation
export async function GET() {
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>BizDocGen API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body>
    <script
        id="api-reference"
        data-url="/openapi.json">
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
