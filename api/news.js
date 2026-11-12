export default async function handler(req, res) {
  const { query = '경제 주요뉴스', display = 5 } = req.query;
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Vercel 환경변수에 네이버 API 키가 등록되지 않았습니다.' });
  }

  try {
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}&sort=sim`;
    const response = await fetch(apiUrl, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });
    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: '네이버 뉴스 조회 실패' });
  }
}
