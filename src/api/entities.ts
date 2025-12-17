import { apiClient } from './client';

// Type definitions
export interface Stat {
  id: string;
  type: string;
  label: string;
  value: string;
  change?: number;
  percentage?: number;
  dashboard_type?: string;
  badge?: {
    text: string;
    showArrow?: boolean;
    arrowDirection?: 'up' | 'down';
    color?: string;
  };
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  author_name: string;
  date: string;
}

export interface JamGroup {
  id: string;
  name: string;
  amount: number;
  recharge_date: string; // '1', '15', 'end', or specific day number
  status: 'active' | 'inactive';
}

/** 임직원 상태 enum */
export enum EmployeeStatus {
  /** 승인 대기: 유저가 가입했지만 아직 어드민 승인 대기 중 */
  PENDING = 'PENDING',
  /** 승인 거절: 어드민이 가입을 거절함 */
  REJECTED = 'REJECTED',
  /** 재직중: 현재 재직 중인 임직원 */
  ACTIVE = 'ACTIVE',
  /** 퇴사 예정: 퇴사일이 설정되어 있지만 아직 재직 중 */
  LEAVING = 'LEAVING',
  /** 퇴사: 퇴사 처리 완료 */
  LEFT = 'LEFT',
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  employee_code: string;
  group_name: string;
  employment_status: EmployeeStatus | 'active' | 'resigning' | 'inactive'; // 하위 호환성을 위해 유지
  join_date: string;
  resignation_date?: string;
  jam_balance: number;
  jam_capacity: number;
}

export interface SettlementHistory {
  id: string;
  usage_month: string;
  total_amount: number;
  employee_count: number;
}

// Mock data
const mockStats: Stat[] = [
  {
    id: '1',
    type: 'total_members',
    label: '총 가입 회원',
    value: '188명',
    change: -10,
    dashboard_type: 'subscription',
  },
  {
    id: '2',
    type: 'subscribers',
    label: '구독중인 임직원',
    value: '64명',
    percentage: 35,
    dashboard_type: 'subscription',
  },
  {
    id: '3',
    type: 'payment_date',
    label: '월 지급일',
    value: '입직원별로 상이',
    dashboard_type: 'subscription',
  },
  {
    id: '4',
    type: 'total_participants',
    label: '월 지급일',
    value: '입직원별로 상이',
    dashboard_type: 'recharge',
  },
  {
    id: '5',
    type: 'total_charged_jam',
    label: '총 참여 인원',
    value: '150명',
    dashboard_type: 'recharge',
  },
  {
    id: '6',
    type: 'payment_date',
    label: '총 충전 잼',
    value: '150,000',
    dashboard_type: 'recharge',
  },
];

const mockReviews: Review[] = [
  {
    id: '1',
    rating: 2,
    content: '더 넓고 깨끗한 수영장이 있었더라면 좋겠습니다.',
    author_name: '이마리스프로젝트',
    date: '2025-11-04T04:00:00Z',
  },
  {
    id: '2',
    rating: 5,
    content: '정말 맛이좋게 즐기고... 너무 힐링했어요...............',
    author_name: '나인테일 마사지 도우미',
    date: '2025-11-04T04:00:00Z',
  },
  {
    id: '3',
    rating: 5,
    content: '좋아여',
    author_name: '하이웨스 강남구청역점',
    date: '2025-11-04T04:00:00Z',
  },
  {
    id: '4',
    rating: 5,
    content:
      '광장히 친절하시어 계느끼겠다. 신체 움직임 제대로 에어도 바로 바로 이해가 되게가 교육 전달 차이가 너무 명확히 보입니다!',
    author_name: '마디필라테스',
    date: '2025-11-04T04:00:00Z',
  },
  {
    id: '5',
    rating: 5,
    content: '오기를 오랫만에 하는 거라 단단하게 못했었는데 너무 재밌었어요 감사합니다',
    author_name: '오카리나',
    date: '2025-11-04T04:00:00Z',
  },
  {
    id: '6',
    rating: 5,
    content: '시설이 너무 깨끗하고 강사님들이 친절하셔서 좋았어요. 배울 오고 싶네요.',
    author_name: '클라이밍 101',
    date: '2025-11-02T13:00:00Z',
  },
  {
    id: '7',
    rating: 5,
    content: '정말 왜이렇게 좋아여... 너무 황홀해요..............',
    author_name: '나인테라피 마사지 논현점',
    date: '2025-11-03T19:00:00Z',
  },
  {
    id: '8',
    rating: 5,
    content: '요가를 오랜만에 하는 거라 따라가지 못할까 봐 걱정했는데 너무나 즐거운 커리큘럼이었습니다',
    author_name: '요가미학',
    date: '2025-11-03T19:00:00Z',
  },
  {
    id: '9',
    rating: 5,
    content: '굉장히 전문적이신 게 느껴집니다. 신체 움직임 관련 예시도 바로바로 이해가 되며, 교육 전/후 차이가 눈에 띄게 보입니다!~',
    author_name: '텐퍼센트짐',
    date: '2025-11-03T19:00:00Z',
  },
  {
    id: '10',
    rating: 4,
    content: '시설은 깔끔하고 좋았는데, 주차 공간이 좀 부족했어요. 다음에는 대중교통 이용하려고 합니다.',
    author_name: '피트니스 월드',
    date: '2025-11-01T10:30:00Z',
  },
  {
    id: '11',
    rating: 5,
    content: '강사님 설명이 정말 자세하고 친절하셔서 초보자도 쉽게 따라할 수 있었어요. 다음에도 또 오고 싶습니다!',
    author_name: '필라테스 스튜디오',
    date: '2025-11-01T15:20:00Z',
  },
  {
    id: '12',
    rating: 5,
    content: '분위기가 너무 좋고 시설도 최신식이라 운동하기 편했어요. 직원분들도 모두 친절하셨습니다.',
    author_name: '헬스앤조이',
    date: '2025-10-31T14:00:00Z',
  },
  {
    id: '13',
    rating: 3,
    content: '전반적으로 괜찮았지만, 좀 더 다양한 프로그램이 있었으면 좋겠어요.',
    author_name: '요가하우스',
    date: '2025-10-30T11:15:00Z',
  },
  {
    id: '14',
    rating: 5,
    content: '처음 방문했는데 너무 만족스러웠어요! 시설도 넓고 깨끗하고, 강사님도 전문적이셨어요.',
    author_name: '크로스핏 존',
    date: '2025-10-29T16:45:00Z',
  },
  {
    id: '15',
    rating: 5,
    content: '스트레스 해소에 정말 좋았습니다. 마사지 받고 나니 몸이 한결 가벼워진 느낌이에요.',
    author_name: '스파앤웰니스',
    date: '2025-10-28T20:00:00Z',
  },
  {
    id: '16',
    rating: 4,
    content: '가격 대비 만족도가 높아요. 다음에도 이용하고 싶은 곳입니다.',
    author_name: '다이어트 센터',
    date: '2025-10-27T09:30:00Z',
  },
];

const mockJamGroups: JamGroup[] = [
  {
    id: '1',
    name: '기본 그룹',
    amount: 1000,
    recharge_date: '1',
    status: 'active',
  },
  {
    id: '2',
    name: '기본 그룹 2',
    amount: 1000,
    recharge_date: '1',
    status: 'inactive',
  },
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kim.cs@company.com',
    phone: '010-1234-5678',
    employee_code: 'EMP001',
    group_name: '개발팀',
    employment_status: 'active',
    join_date: '2024-01-15',
    jam_balance: 85000,
    jam_capacity: 100000,
  },
  {
    id: '2',
    name: '이영희',
    email: 'lee.yh@company.com',
    phone: '010-2345-6789',
    employee_code: 'EMP002',
    group_name: '마케팅팀',
    employment_status: 'active',
    join_date: '2024-02-20',
    jam_balance: 45000,
    jam_capacity: 100000,
  },
  {
    id: '3',
    name: '박민수',
    email: 'park.ms@company.com',
    phone: '010-3456-7890',
    employee_code: 'EMP003',
    group_name: '개발팀',
    employment_status: 'active',
    join_date: '2024-03-10',
    jam_balance: 92000,
    jam_capacity: 100000,
  },
  {
    id: '4',
    name: '정수진',
    email: 'jung.sj@company.com',
    phone: '010-4567-8901',
    employee_code: 'EMP004',
    group_name: '디자인팀',
    employment_status: 'resigning',
    join_date: '2023-11-05',
    resignation_date: '2025-12-31',
    jam_balance: 30000,
    jam_capacity: 100000,
  },
  {
    id: '5',
    name: '최동욱',
    email: 'choi.dw@company.com',
    phone: '010-5678-9012',
    employee_code: 'EMP005',
    group_name: '영업팀',
    employment_status: 'active',
    join_date: '2024-04-01',
    jam_balance: 67000,
    jam_capacity: 100000,
  },
  {
    id: '6',
    name: '강미래',
    email: 'kang.mr@company.com',
    phone: '010-6789-0123',
    employee_code: 'EMP006',
    group_name: '인사팀',
    employment_status: 'active',
    join_date: '2023-09-15',
    jam_balance: 78000,
    jam_capacity: 100000,
  },
  {
    id: '7',
    name: '윤서연',
    email: 'yoon.sy@company.com',
    phone: '010-7890-1234',
    employee_code: 'EMP007',
    group_name: '마케팅팀',
    employment_status: 'active',
    join_date: '2024-05-20',
    jam_balance: 55000,
    jam_capacity: 100000,
  },
  {
    id: '8',
    name: '임재현',
    email: 'lim.jh@company.com',
    phone: '010-8901-2345',
    employee_code: 'EMP008',
    group_name: '개발팀',
    employment_status: 'inactive',
    join_date: '2023-06-10',
    resignation_date: '2025-11-30',
    jam_balance: 0,
    jam_capacity: 100000,
  },
  {
    id: '9',
    name: '한지우',
    email: 'han.jw@company.com',
    phone: '010-9012-3456',
    employee_code: 'EMP009',
    group_name: '디자인팀',
    employment_status: 'active',
    join_date: '2024-06-15',
    jam_balance: 88000,
    jam_capacity: 100000,
  },
  {
    id: '10',
    name: '오성민',
    email: 'oh.sm@company.com',
    phone: '010-0123-4567',
    employee_code: 'EMP010',
    group_name: '영업팀',
    employment_status: 'active',
    join_date: '2024-07-01',
    jam_balance: 72000,
    jam_capacity: 100000,
  },
  {
    id: '11',
    name: '서하늘',
    email: 'seo.hn@company.com',
    phone: '010-1111-2222',
    employee_code: 'EMP011',
    group_name: '개발팀',
    employment_status: 'active',
    join_date: '2024-01-20',
    jam_balance: 95000,
    jam_capacity: 100000,
  },
  {
    id: '12',
    name: '남궁민',
    email: 'namgung.m@company.com',
    phone: '010-2222-3333',
    employee_code: 'EMP012',
    group_name: '마케팅팀',
    employment_status: 'active',
    join_date: '2024-02-14',
    jam_balance: 63000,
    jam_capacity: 100000,
  },
  {
    id: '13',
    name: '황보라',
    email: 'hwang.br@company.com',
    phone: '010-3333-4444',
    employee_code: 'EMP013',
    group_name: '인사팀',
    employment_status: 'active',
    join_date: '2023-12-01',
    jam_balance: 81000,
    jam_capacity: 100000,
  },
  {
    id: '14',
    name: '신동혁',
    email: 'shin.dh@company.com',
    phone: '010-4444-5555',
    employee_code: 'EMP014',
    group_name: '디자인팀',
    employment_status: 'active',
    join_date: '2024-03-25',
    jam_balance: 47000,
    jam_capacity: 100000,
  },
  {
    id: '15',
    name: '배수지',
    email: 'bae.sj@company.com',
    phone: '010-5555-6666',
    employee_code: 'EMP015',
    group_name: '영업팀',
    employment_status: 'resigning',
    join_date: '2023-10-10',
    resignation_date: '2025-12-25',
    jam_balance: 25000,
    jam_capacity: 100000,
  },
  {
    id: '16',
    name: '전우성',
    email: 'jeon.ws@company.com',
    phone: '010-6666-7777',
    employee_code: 'EMP016',
    group_name: '개발팀',
    employment_status: 'active',
    join_date: '2024-04-15',
    jam_balance: 90000,
    jam_capacity: 100000,
  },
  {
    id: '17',
    name: '송지은',
    email: 'song.je@company.com',
    phone: '010-7777-8888',
    employee_code: 'EMP017',
    group_name: '마케팅팀',
    employment_status: 'active',
    join_date: '2024-05-05',
    jam_balance: 58000,
    jam_capacity: 100000,
  },
  {
    id: '18',
    name: '류태준',
    email: 'ryu.tj@company.com',
    phone: '010-8888-9999',
    employee_code: 'EMP018',
    group_name: '인사팀',
    employment_status: 'active',
    join_date: '2024-06-20',
    jam_balance: 76000,
    jam_capacity: 100000,
  },
  {
    id: '19',
    name: '문채원',
    email: 'moon.cw@company.com',
    phone: '010-9999-0000',
    employee_code: 'EMP019',
    group_name: '디자인팀',
    employment_status: 'active',
    join_date: '2024-07-10',
    jam_balance: 84000,
    jam_capacity: 100000,
  },
  {
    id: '20',
    name: '곽도원',
    email: 'kwak.dw@company.com',
    phone: '010-0000-1111',
    employee_code: 'EMP020',
    group_name: '영업팀',
    employment_status: 'active',
    join_date: '2024-08-01',
    jam_balance: 69000,
    jam_capacity: 100000,
  },
  {
    id: '21',
    name: '안소희',
    email: 'ahn.sh@company.com',
    phone: '010-1212-3434',
    employee_code: 'EMP021',
    group_name: '개발팀',
    employment_status: 'active',
    join_date: '2024-01-08',
    jam_balance: 93000,
    jam_capacity: 100000,
  },
  {
    id: '22',
    name: '유재석',
    email: 'yoo.js@company.com',
    phone: '010-2323-4545',
    employee_code: 'EMP022',
    group_name: '마케팅팀',
    employment_status: 'active',
    join_date: '2024-02-28',
    jam_balance: 51000,
    jam_capacity: 100000,
  },
  {
    id: '23',
    name: '홍길동',
    email: 'hong.gd@company.com',
    phone: '010-3434-5656',
    employee_code: 'EMP023',
    group_name: '인사팀',
    employment_status: 'inactive',
    join_date: '2023-05-15',
    resignation_date: '2025-10-31',
    jam_balance: 0,
    jam_capacity: 100000,
  },
  {
    id: '24',
    name: '김태희',
    email: 'kim.th@company.com',
    phone: '010-4545-6767',
    employee_code: 'EMP024',
    group_name: '디자인팀',
    employment_status: 'active',
    join_date: '2024-03-18',
    jam_balance: 79000,
    jam_capacity: 100000,
  },
  {
    id: '25',
    name: '이병헌',
    email: 'lee.bh@company.com',
    phone: '010-5656-7878',
    employee_code: 'EMP025',
    group_name: '영업팀',
    employment_status: 'active',
    join_date: '2024-04-22',
    jam_balance: 66000,
    jam_capacity: 100000,
  },
  {
    id: '26',
    name: '전지현',
    email: 'jun.jh@company.com',
    phone: '010-6767-8989',
    employee_code: 'EMP026',
    group_name: '개발팀',
    employment_status: 'active',
    join_date: '2024-05-12',
    jam_balance: 87000,
    jam_capacity: 100000,
  },
  {
    id: '27',
    name: '하정우',
    email: 'ha.jw@company.com',
    phone: '010-7878-9090',
    employee_code: 'EMP027',
    group_name: '마케팅팀',
    employment_status: 'active',
    join_date: '2024-06-08',
    jam_balance: 74000,
    jam_capacity: 100000,
  },
  {
    id: '28',
    name: '손예진',
    email: 'son.yj@company.com',
    phone: '010-8989-0101',
    employee_code: 'EMP028',
    group_name: '인사팀',
    employment_status: 'active',
    join_date: '2024-07-25',
    jam_balance: 82000,
    jam_capacity: 100000,
  },
  {
    id: '29',
    name: '현빈',
    email: 'hyun.b@company.com',
    phone: '010-9090-1212',
    employee_code: 'EMP029',
    group_name: '디자인팀',
    employment_status: 'active',
    join_date: '2024-08-15',
    jam_balance: 71000,
    jam_capacity: 100000,
  },
  {
    id: '30',
    name: '공유',
    email: 'gong.y@company.com',
    phone: '010-0101-2323',
    employee_code: 'EMP030',
    group_name: '영업팀',
    employment_status: 'active',
    join_date: '2024-09-01',
    jam_balance: 89000,
    jam_capacity: 100000,
  },
];

const mockSettlementHistory: SettlementHistory[] = [
  {
    id: '1',
    usage_month: '2025-11',
    total_amount: 150000,
    employee_count: 150,
  },
];

// Entity interface
interface Entity<T> {
  list(orderBy?: string): Promise<T[]>;
  get(id: string): Promise<T>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<{ success: boolean }>;
}

// Generic entity factory with mock data
const createEntity = <T extends { id: string }>(entityName: string, mockData: T[]): Entity<T> => ({
  async list(orderBy?: string): Promise<T[]> {
    // Return mock data instead of API call
    return Promise.resolve(mockData);
  },

  async get(id: string): Promise<T> {
    const item = mockData.find((item) => item.id === id);
    if (!item) throw new Error('Not found');
    return Promise.resolve(item);
  },

  async create(data: Partial<T>): Promise<T> {
    const newItem = { ...data, id: String(Date.now()) } as T;
    mockData.push(newItem);
    return Promise.resolve(newItem);
  },

  async update(id: string, data: Partial<T>): Promise<T> {
    const index = mockData.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Not found');
    mockData[index] = { ...mockData[index], ...data };
    return Promise.resolve(mockData[index]);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    const index = mockData.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Not found');
    mockData.splice(index, 1);
    return Promise.resolve({ success: true });
  },
});

export const ReviewEntity = createEntity<Review>('reviews', mockReviews);
export const StatEntity = createEntity<Stat>('stats', mockStats);
export const JamGroupEntity = createEntity<JamGroup>('jam-groups', mockJamGroups);
export const EmployeeEntity = createEntity<Employee>('employees', mockEmployees);
export const SettlementHistoryEntity = createEntity<SettlementHistory>(
  'settlement-history',
  mockSettlementHistory
);

// Backward compatibility aliases
export { ReviewEntity as Review };
export { StatEntity as Stat };
export { JamGroupEntity as JamGroup };
export { EmployeeEntity as Employee };
export { SettlementHistoryEntity as SettlementHistory };
