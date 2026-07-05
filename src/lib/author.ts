import { SITE_URL } from '../consts';

export const PRIMARY_AUTHOR = {
  slug: 'howlearn',
  name: '주기헌',
  title: '현직 수학 교사 · 중등 정교사(수학)',
  summary:
    '학습과학 연구와 수학교육 현장 경험을 연결해 HowLearn 콘텐츠를 집필·검토합니다.',
  credentials: [
    '한국교원대학교 수학교육과 졸업',
    '2014년부터 현직 수학 교사',
    '중등학교 1급 정교사(수학)',
    '학생 대상 수학 불안·학습 상담 다수 진행',
    '학부모 대상 가정 학습·부모 태도 상담 다수 진행',
    '진로·진학 상담 경력 보유',
  ],
} as const;

export function getAuthorProfileUrl(slug = PRIMARY_AUTHOR.slug): string {
  return new URL(`/author/${slug}`, SITE_URL).toString();
}

export function resolveAuthorName(author?: string): string {
  const value = (author ?? PRIMARY_AUTHOR.name).trim();
  if (!value || value === 'HowLearn') return PRIMARY_AUTHOR.name;
  return value;
}
