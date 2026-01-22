export type PatchStudentRequest = {
  firstName: string;
  lastName: string;
  relationshipWithParent: string;
  dateOfBirth: string; // yyyy-mm-dd
  gender: string;
  address: string;
  province: string;
  district: string;
  ward: string;
};