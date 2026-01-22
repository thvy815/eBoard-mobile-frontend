export interface ScheduleSettingDetail {
  periodNumber: number;
  startTime: string; // "08:00:00"
  endTime: string;   // "08:45:00"
  isMorningPeriod: boolean;
}

export interface ScheduleSettingsResponse {
  id: string;
  morningPeriodCount: number;
  afternoonPeriodCount: number;
  details: ScheduleSettingDetail[];
}
