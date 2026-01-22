export type ParentInfo = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  generatedPassword: string;
  address: string;
  healthCondition: string;
};

export type ParentChildItem = {
  studentInfo: {
    id: string;
    firstName: string;
    lastName: string;
    fullAddress: string;
    parent: any | null;
    relationshipWithParent: string;
    dateOfBirth: string;
    gender: string;
  };
  classInfo: {
    id: string;
    name: string;
    grade: string;
    teacherName: string;
    roomName: string;
    startDate: string;
    endDate: string;
    currentStudentCount: number;
    maxCapacity: number;
    description: string;
  };
};

export type UpdateParentInfoRequest = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  healthCondition: string; // swagger PUT đang có field này
};
