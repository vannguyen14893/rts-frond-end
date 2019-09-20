export interface IInterview {
  id?: number;
  title?: string;
  startTime?: string | Date;
  endTime?: string | Date;
  location?: string;
  note?: string;
  userCollection?: number[];
  candidateCollection?: number[];
  statusId?: number;
}
