import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

interface UserProgress {
  xp: number;
  badges: string[];
  lastCompleted?: {
    lessonId: string;
    timestamp: Date;
  };
}

interface Badge {
  id: string;
  name: string;
  xpReward: number;
  check: (userId: string) => Promise<boolean>;
}

const BADGES: Record<string, Badge> = {
  historian_lvl1: {
    id: 'historian_lvl1',
    name: 'Начинающий историк',
    xpReward: 100,
    check: async (userId: string): Promise<boolean> => {
      try {
        const progress = await admin.firestore()
          .collection('userProgress')
          .doc(userId)
          .get();
        
        return progress.exists && progress.data()?.lastCompleted !== undefined;
      } catch (error) {
        console.error('Error checking historian_lvl1 badge:', error);
        return false;
      }
    }
  },
  analyst: {
    id: 'analyst',
    name: 'Аналитик',
    xpReward: 500,
    check: async (userId: string): Promise<boolean> => {
      try {
        const essays = await admin.firestore()
          .collection('essays')
          .where('userId', '==', userId)
          .where('score', '>=', 8)
          .get();
        
        return essays.size >= 10;
      } catch (error) {
        console.error('Error checking analyst badge:', error);
        return false;
      }
    }
  },
  researcher: {
    id: 'researcher',
    name: 'Исследователь',
    xpReward: 300,
    check: async (userId: string): Promise<boolean> => {
      try {
        const progress = await admin.firestore()
          .collection('userProgress')
          .doc(userId)
          .get();
        
        const data = progress.data() as UserProgress;
        return data?.badges?.includes('historian_lvl1') || false;
      } catch (error) {
        console.error('Error checking researcher badge:', error);
        return false;
      }
    }
  },
  debater: {
    id: 'debater',
    name: 'Оратор',
    xpReward: 200,
    check: async (userId: string): Promise<boolean> => {
      try {
        const discussions = await admin.firestore()
          .collection('discussions')
          .where('participants', 'array-contains', userId)
          .get();
        
        return discussions.size >= 5;
      } catch (error) {
        console.error('Error checking debater badge:', error);
        return false;
      }
    }
  }
};

export const checkAchievements = functions.firestore
  .document('userProgress/{userId}')
  .onUpdate(async (change, context) => {
    const userId = context.params.userId;
    const newData = change.after.data() as UserProgress;
    const oldData = change.before.data() as UserProgress;

    try {
      const newBadges: string[] = [];
      let totalXpReward = 0;

      // Проверяем каждое достижение
      for (const [badgeId, badge] of Object.entries(BADGES)) {
        // Если достижение уже получено, пропускаем
        if (oldData.badges.includes(badgeId)) continue;

        // Проверяем условия достижения
        const isUnlocked = await badge.check(userId);
        
        if (isUnlocked) {
          newBadges.push(badgeId);
          totalXpReward += badge.xpReward;
        }
      }

      // Если есть новые достижения, обновляем прогресс
      if (newBadges.length > 0) {
        await change.after.ref.update({
          badges: admin.firestore.FieldValue.arrayUnion(...newBadges),
          xp: admin.firestore.FieldValue.increment(totalXpReward)
        });

        // Отправляем уведомление о новых достижениях
        const userDoc = await admin.firestore()
          .collection('users')
          .doc(userId)
          .get();
        
        const userData = userDoc.data();
        
        if (userData?.fcmToken) {
          await admin.messaging().send({
            token: userData.fcmToken,
            notification: {
              title: 'Новые достижения!',
              body: `Вы получили ${newBadges.length} новых достижений!`
            }
          });
        }
      }

      return null;
    } catch (error) {
      console.error('Error in checkAchievements:', error);
      throw new functions.https.HttpsError('internal', 'Error checking achievements');
    }
  }); 