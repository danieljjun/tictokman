interface Settings {
  [key: string]: any;
}

class SettingsManager {
  private static instance: SettingsManager;
  private settings: Settings = {};
  private listeners: ((settings: Settings) => void)[] = [];

  private constructor() {}

  static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  // 서버에서 설정 로드
  async loadFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      this.settings = data;
      this.notifyListeners();
    } catch (error) {
      console.error('Error loading settings:', error);
      // 서버 로드 실패시 로컬 스토리지에서 복구 시도
      this.loadFromLocalStorage();
    }
  }

  // 서버에 설정 저장
  async saveToServer(): Promise<void> {
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      // 로컬 스토리지에도 백업
      this.saveToLocalStorage();
    } catch (error) {
      console.error('Error saving settings:', error);
      // 서버 저장 실패시 로컬 스토리지에만 저장
      this.saveToLocalStorage();
    }
  }

  // 로컬 스토리지에서 설정 로드
  private loadFromLocalStorage(): void {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        this.settings = JSON.parse(savedSettings);
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }

  // 로컬 스토리지에 설정 저장
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  }

  // 설정 값 가져오기
  get(key: string, defaultValue: any = null): any {
    return this.settings[key] ?? defaultValue;
  }

  // 설정 값 설정하기
  async set(key: string, value: any): Promise<void> {
    this.settings[key] = value;
    await this.saveToServer();
    this.notifyListeners();
  }

  // 설정 변경 리스너 등록
  subscribe(listener: (settings: Settings) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // 리스너들에게 변경 알림
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({ ...this.settings }));
  }
}

export const settingsManager = SettingsManager.getInstance(); 