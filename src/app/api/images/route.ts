import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')
  const perPage = Number(req.nextUrl.searchParams.get('per_page')) || 10
  const pexelsKey = process.env.PEXELS_API_KEY

  if (!query) {
    return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 })
  }

  if (!pexelsKey) {
    // Return empty array, client will automatically fall back to Unsplash high-res static images
    return NextResponse.json({ photos: [] })
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      {
        headers: {
          Authorization: pexelsKey,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Pexels API error' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to query Pexels API proxy' }, { status: 500 })
  }
}
