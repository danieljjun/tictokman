import { settingsManager } from './settings';

interface StorageData {
  timestamp: number;
  data: any;
}

// 데이터 저장
export const saveData = async (key: string, data: any) => {
  try {
    const storageData: StorageData = {
      timestamp: Date.now(),
      data
    };
    
    // 서버와 로컬에 저장
    await settingsManager.set(key, storageData);
    
    // 동기화 이벤트 발생
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: JSON.stringify(storageData)
    }));
    
    // 커스텀 이벤트 발생
    window.dispatchEvent(new CustomEvent(`${key}Updated`, { detail: data }));
    
    return true;
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
    return false;
  }
};

// 데이터 로드
export const loadData = (key: string, defaultValue: any = null) => {
  try {
    const savedData = settingsManager.get(key);
    if (!savedData) return defaultValue;

    return savedData.data;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return defaultValue;
  }
};

// 데이터 삭제
export const removeData = async (key: string) => {
  try {
    await settingsManager.set(key, null);
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: null
    }));
    return true;
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
    return false;
  }
};

// 데이터 변경 감지 설정
export const setupStorageListener = (key: string, callback: (data: any) => void) => {
  // settings 변경 리스너
  const unsubscribe = settingsManager.subscribe((settings) => {
    const savedData = settings[key];
    if (savedData) {
      callback(savedData.data);
    }
  });

  // storage 이벤트 리스너
  const handleStorage = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      try {
        const { data } = JSON.parse(e.newValue);
        callback(data);
      } catch (error) {
        console.error(`Error parsing storage data for key ${key}:`, error);
      }
    }
  };

  // 커스텀 이벤트 리스너
  const handleCustomEvent = (e: CustomEvent) => {
    callback(e.detail);
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(`${key}Updated`, handleCustomEvent as EventListener);

  // 클린업 함수 반환
  return () => {
    unsubscribe();
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(`${key}Updated`, handleCustomEvent as EventListener);
  };
}; 