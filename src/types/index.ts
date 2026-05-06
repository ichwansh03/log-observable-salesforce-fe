export interface UserSummaryDto {
  Name?: string;
}

export interface ApexLogDto {
  Id: string;
  LogUser?: UserSummaryDto;
  Operation?: string;
  StartTime?: string;
  Status?: string;
  Request?: string;
  LogLength?: number;
  apexClassName?: string;
}
