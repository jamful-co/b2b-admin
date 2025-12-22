export function createPageUrl(pageName: string) {
  return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

/**
 * 서브도메인에서 로고 URL을 가져오는 함수
 * @returns 서브도메인에 해당하는 로고 이미지 URL
 */
export function getLogoUrlFromSubdomain(): string {
  const hostname = window.location.hostname;
  // localhost의 경우: bytedance.localhost -> bytedance
  // 일반 도메인의 경우: bytedance.example.com -> bytedance
  const parts = hostname.split('.');

  // 서브도메인이 있는 경우 (예: bytedance.localhost 또는 bytedance.example.com)
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    const subdomain = parts[0];
    return `https://images.jamfulapp.com/${subdomain}.png`;
  }

  return `https://images.jamfulapp.com/jamful.png`;
}
