import { AddActivitySignInDto, ParentViewActivity } from "@/types/activity";
import axios from "axios";

const API_URL = "https://eboardapi-hsabeadsb2a8anb3.southeastasia-01.azurewebsites.net/api/activities";

export const activityService = {
  // GET class/{classId}
  getActivitiesForParent(classId: string, studentId: string) {
    return axios.get<ParentViewActivity[]>(
      `${API_URL}/class/${classId}`,
      {
        params: { studentId },
      }
    );
  },

  // POST signins
  signInActivity(data: AddActivitySignInDto) {
    return axios.post(`${API_URL}/signins`, data);
  },

  // DELETE sign-in
    removeParticipant(participantId: string) {
        return axios.delete(`${API_URL}/participants/${participantId}`);
    },

  getActivityById(activityId: string) {
    return axios.get(`${API_URL}/${activityId}`);}

};
