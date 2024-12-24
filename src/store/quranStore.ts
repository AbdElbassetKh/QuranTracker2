import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Juz, Hizb, Thumn, DailyProgress } from '../types/quran';
import { isSameDay, normalizeDate } from '../utils/dateUtils';

interface QuranStore {
  juzs: Juz[];
  dailyProgress: DailyProgress[];
  currentThumn: number;
  
  // Actions
  markJuzRead: (date: Date) => void;
  markHizbListened: (date: Date) => void;
  markPreparationRead: (date: Date) => void;
  markTafseerRead: (date: Date) => void;
  markThumnListened: (date: Date) => void;
  markThumnRead: (date: Date) => void;
  markThumnMemorized: (thumnId: number, date: Date) => void;
  incrementThumnRepetition: (date: Date) => void;
  updateReviewStatus: () => void;
}

const getEmptyProgress = (date: Date): DailyProgress => ({
  date: normalizeDate(date),
  juzReading: false,
  hizbListening: false,
  preparationReading: false,
  tafseerReading: false,
  thumnListening: false,
  thumnReading: false,
  thumnMemorization: false,
  thumnRepetition: 0
});

const updateDailyProgress = (
  progress: DailyProgress[],
  date: Date,
  updates: Partial<DailyProgress>
): DailyProgress[] => {
  const normalizedDate = normalizeDate(date);
  const existingProgress = progress.find(p => 
    isSameDay(new Date(p.date), normalizedDate)
  );
  
  if (existingProgress) {
    return progress.map(p =>
      isSameDay(new Date(p.date), normalizedDate)
        ? { ...p, ...updates }
        : p
    );
  }

  return [
    ...progress,
    {
      ...getEmptyProgress(normalizedDate),
      ...updates
    }
  ];
};

export const useQuranStore = create<QuranStore>()(
  persist(
    (set, get) => ({
      juzs: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        name: `الجزء ${i + 1}`,
        hizbs: Array.from({ length: 2 }, (_, j) => ({
          id: i * 2 + j + 1,
          juzId: i + 1,
          name: `الحزب ${i * 2 + j + 1}`,
          athman: Array.from({ length: 8 }, (_, k) => ({
            id: (i * 2 + j) * 8 + k + 1,
            hizbId: i * 2 + j + 1,
            name: `الثمن ${(i * 2 + j) * 8 + k + 1}`,
            order: (i * 2 + j) * 8 + k + 1,
            memorized: false
          }))
        }))
      })),
      dailyProgress: [],
      currentThumn: 1,

      markJuzRead: (date: Date) => {
        set((state) => ({
          dailyProgress: updateDailyProgress(state.dailyProgress, date, {
            juzReading: true
          })
        }));
      },

      markHizbListened: (date: Date) => {
        set((state) => ({
          dailyProgress: updateDailyProgress(state.dailyProgress, date, {
            hizbListening: true
          })
        }));
      },

      markPreparationRead: (date: Date) => {
        set((state) => ({
          dailyProgress: updateDailyProgress(state.dailyProgress, date, {
            preparationReading: true
          })
        }));
      },

      markTafseerRead: (date: Date) => {
        set((state) => ({
          dailyProgress: updateDailyProgress(state.dailyProgress, date, {
            tafseerReading: true
          })
        }));
      },

      markThumnListened: (date: Date) => {
        set((state) => ({
          dailyProgress: updateDailyProgress(state.dailyProgress, date, {
            thumnListening: true
          })
        }));
      },

      markThumnRead: (date: Date) => {
        set((state) => ({
          dailyProgress: updateDailyProgress(state.dailyProgress, date, {
            thumnReading: true
          })
        }));
      },

      markThumnMemorized: (thumnId: number, date: Date) => {
        set((state) => {
          const updatedJuzs = state.juzs.map(juz => ({
            ...juz,
            hizbs: juz.hizbs.map(hizb => ({
              ...hizb,
              athman: hizb.athman.map(thumn => 
                thumn.id === thumnId
                  ? { ...thumn, memorized: true, memorizedAt: date.toISOString() }
                  : thumn
              )
            }))
          }));

          return {
            juzs: updatedJuzs,
            currentThumn: thumnId + 1
          };
        });
      },

      incrementThumnRepetition: (date: Date) => {
        set((state) => {
          const normalizedDate = normalizeDate(date);
          const existingProgress = state.dailyProgress.find(p => 
            isSameDay(new Date(p.date), normalizedDate)
          );
          
          return {
            dailyProgress: updateDailyProgress(state.dailyProgress, date, {
              thumnRepetition: (existingProgress?.thumnRepetition || 0) + 1
            })
          };
        });
      },

      updateReviewStatus: () => {
        set((state) => {
          const memorizedAthman = state.juzs
            .flatMap(juz => juz.hizbs)
            .flatMap(hizb => hizb.athman)
            .filter(thumn => thumn.memorized);

          const recentCount = 24;
          const recentAthman = memorizedAthman.slice(-recentCount);
          const oldAthman = memorizedAthman.slice(0, -recentCount);

          const updatedJuzs = state.juzs.map(juz => ({
            ...juz,
            hizbs: juz.hizbs.map(hizb => ({
              ...hizb,
              athman: hizb.athman.map(thumn => ({
                ...thumn,
                reviewType: recentAthman.find(a => a.id === thumn.id)
                  ? 'recent'
                  : oldAthman.find(a => a.id === thumn.id)
                  ? 'old'
                  : undefined
              }))
            }))
          }));

          return { juzs: updatedJuzs };
        });
      }
    }),
    {
      name: 'quran-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          if (data.state.dailyProgress) {
            data.state.dailyProgress = data.state.dailyProgress.map((p: any) => ({
              ...p,
              date: new Date(p.date)
            }));
          }
          return data;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);