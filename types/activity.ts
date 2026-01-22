export type ActivityParticipant = {
  id: string;
  studentId: string; // ✅ MUST HAVE
  studentName: string;
  parentPhoneNumber: string;
  teacherComments: string;
  notes: string;
};


export type ExtracurricularActivity = {
  id: string;
  name: string;
  location: string;
  maxParticipants: number;
  inChargeTeacher: string;
  startTime: string;
  endTime: string;
  cost: number;
  assignDeadline: string;
  description: string;
  participants: ActivityParticipant[];
};

export type ParentViewActivity = ExtracurricularActivity & {
  assignStatus?: string; // optional
};

export type AddActivitySignInDto = {
  studentId: string;
  activityId: string;
};
