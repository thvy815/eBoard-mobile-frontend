export type AttendanceDto = {
  id: string;
  studentId: string;
  studentName: string;
  status: string;
  absenceReason: string;
  pickupPerson: string;
  notes: string;
};

export type AttendanceInfoByClassDto = {
  classId: string;
  className: string;
  date: string;
  attendances: AttendanceDto[];
};

export type AbsentRequestDto = {
  id: string;
  studentId: string;
  classId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export interface CreateAbsentRequestDto {
  studentId: string;
  classId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  notes?: string;
}


