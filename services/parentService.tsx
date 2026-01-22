import api from "@/lib/api";
import type { ParentChildItem, ParentInfo } from "@/types/parent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CLASS_ID_KEY = "currentClassId";
const STUDENT_ID_KEY = "currentStudentId";

export const parentService = {

  // GET /api/parents/info/{id}
  async getParentInfo(parentId: string) {
    const res = await api.get<ParentInfo>(`/parents/info/${parentId}`);
    return res.data;
  },

  // GET /api/parents/class/{parentId}/children?pageNumber=1&pageSize=20
  async getChildrenByParentId(parentId: string, pageNumber = 1, pageSize = 20) {
    const res = await api.get<ParentChildItem[]>(`/parents/class/${parentId}/children`, {
      params: { pageNumber, pageSize },
    });
    return res.data;
  },

  // Fetch children -> lấy classId + studentId -> lưu AsyncStorage
  // Mặc định lấy item đầu tiên (sau này có màn chọn con thì đổi logic)
  async fetchAndStoreCurrentChildIds(parentId: string) {
    const list = await this.getChildrenByParentId(parentId, 1, 20);

    if (!list || list.length === 0) {
      throw new Error("Parent has no children");
    }

    const first = list[0];
    const classId = first.classInfo.id;
    const studentId = first.studentInfo.id;

    await AsyncStorage.multiSet([
      [CLASS_ID_KEY, classId],
      [STUDENT_ID_KEY, studentId],
    ]);

    return {
      classId,
      studentId,
      studentName: `${first.studentInfo.firstName} ${first.studentInfo.lastName}`,
      className: first.classInfo.name,
    };
  },

  // Helpers để dùng cho các màn sau
  async getStoredClassId() {
    return AsyncStorage.getItem(CLASS_ID_KEY);
  },

  async getStoredStudentId() {
    return AsyncStorage.getItem(STUDENT_ID_KEY);
  },

  async clearStoredChildIds() {
    await AsyncStorage.multiRemove([CLASS_ID_KEY, STUDENT_ID_KEY]);
  },
}
