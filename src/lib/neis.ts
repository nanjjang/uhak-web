import { School } from "./auth-context";

const BASE_URL = "https://open.neis.go.kr/hub";
const API_KEY = process.env.NEXT_PUBLIC_NEIS_API_KEY!;

export interface MealInfo {
  mealDate: string;
  mealType: string;
  dishName: string;
  calInfo: string;
  mealTypeName: string;
  dishes: string[];
}

export interface TimetableEntry {
  date: string;
  period: string;
  subject: string;
  teacher?: string;
}

export interface SchoolSchedule {
  date: string;
  eventName: string;
  eventContent?: string;
  holidayType?: string;
  isHoliday: boolean;
}

async function fetchNEIS(endpoint: string, params: Record<string, string>) {
  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set("KEY", API_KEY);
  url.searchParams.set("Type", "json");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  return res.json();
}

export async function searchSchools(keyword: string, type?: string): Promise<School[]> {
  const params: Record<string, string> = { SCHUL_NM: keyword, pSize: "20" };
  if (type) params.SCHUL_KND_SC_NM = type;

  const data = await fetchNEIS("schoolInfo", params);
  const rows = data.schoolInfo?.[1]?.row;
  if (!rows) return [];

  return rows.map((r: Record<string, string>) => ({
    SD_SCHUL_CODE: r.SD_SCHUL_CODE,
    SCHUL_NM: r.SCHUL_NM,
    ORG_RDNZC: r.ORG_RDNZC || "",
    ATPT_OFCDC_SC_CODE: r.ATPT_OFCDC_SC_CODE,
    SCHUL_KND_SC_NM: r.SCHUL_KND_SC_NM?.includes("고등") ? "HIGH" : "MIDD",
    ORG_RDNMA: r.ORG_RDNMA || "",
    ATPT_OFCDC_SC_NM: r.ATPT_OFCDC_SC_NM || "",
  }));
}

export async function fetchMeals(school: School, yearMonth: string): Promise<MealInfo[]> {
  const data = await fetchNEIS("mealServiceDietInfo", {
    ATPT_OFCDC_SC_CODE: school.ATPT_OFCDC_SC_CODE,
    SD_SCHUL_CODE: school.SD_SCHUL_CODE,
    MLSV_YMD: yearMonth,
    pSize: "100",
  });

  const rows = data.mealServiceDietInfo?.[1]?.row;
  if (!rows) return [];

  return rows.map((r: Record<string, string>) => {
    const mealType = r.MMEAL_SC_CODE;
    const mealTypeName = mealType === "1" ? "조식" : mealType === "2" ? "중식" : "석식";
    const dishName = r.DDISH_NM || "";
    const dishes = dishName
      .split(/<br\s*\/?>/)
      .map((d: string) => d.replace(/\([^)]*\)/g, "").trim())
      .filter(Boolean);

    return {
      mealDate: r.MLSV_YMD,
      mealType,
      dishName,
      calInfo: r.CAL_INFO || "",
      mealTypeName,
      dishes,
    };
  });
}

export async function fetchWeekTimetable(
  school: School,
  grade: number,
  classNum: number,
  monday: string,
  friday: string
): Promise<TimetableEntry[]> {
  const endpoint = school.SCHUL_KND_SC_NM === "MIDD" ? "misTimetable" : "hisTimetable";
  const data = await fetchNEIS(endpoint, {
    ATPT_OFCDC_SC_CODE: school.ATPT_OFCDC_SC_CODE,
    SD_SCHUL_CODE: school.SD_SCHUL_CODE,
    GRADE: String(grade),
    CLASS_NM: String(classNum),
    TI_FROM_YMD: monday,
    TI_TO_YMD: friday,
    pSize: "100",
  });

  const key = school.SCHUL_KND_SC_NM === "MIDD" ? "misTimetable" : "hisTimetable";
  const rows = data[key]?.[1]?.row;
  if (!rows) return [];

  return rows.map((r: Record<string, string>) => ({
    date: r.ALL_TI_YMD,
    period: r.PERIO,
    subject: r.ITRT_CNTNT,
    teacher: r.TCHR_NM,
  }));
}

export async function fetchSchedules(
  school: School,
  year: number
): Promise<SchoolSchedule[]> {
  const data = await fetchNEIS("SchoolSchedule", {
    ATPT_OFCDC_SC_CODE: school.ATPT_OFCDC_SC_CODE,
    SD_SCHUL_CODE: school.SD_SCHUL_CODE,
    AA_FROM_YMD: `${year}0101`,
    AA_TO_YMD: `${year}1231`,
    pSize: "365",
  });

  const rows = data.SchoolSchedule?.[1]?.row;
  if (!rows) return [];

  return rows.map((r: Record<string, string>) => ({
    date: r.AA_YMD,
    eventName: r.EVENT_NM,
    eventContent: r.EVENT_CNTNT,
    holidayType: r.SBTR_DD_SC_NM,
    isHoliday: r.SBTR_DD_SC_NM === "공휴일" || r.SBTR_DD_SC_NM === "휴업일",
  }));
}
