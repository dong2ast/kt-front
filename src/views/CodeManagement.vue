<template>
  <div class="container">
    <h2>코드 관리</h2>

    <!-- 코드 그룹 관리 -->
    <h3>코드 그룹</h3>
    <form @submit.prevent="saveCodeGroup" class="form-group">
      <fieldset>
        <input v-model="group.id" placeholder="그룹 ID" required />
        <input v-model="group.groupName" placeholder="그룹명" required />
        <textarea v-model="group.description" placeholder="설명"></textarea>
        <button type="submit">저장</button>
      </fieldset>
    </form>

    <table v-if="codeGroups.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>이름</th>
          <th>설명</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="g in codeGroups"
          :key="g.id"
          :class="{ selected: selectedGroup === g.id }"
        >
          <td>{{ g.id }}</td>
          <td>{{ g.groupName }}</td>
          <td>{{ g.description }}</td>
          <td>
            <button @click="editGroup(g)">수정</button>
            <button @click="deleteGroup(g.id)">삭제</button>
            <button @click="toggleSelectGroup(g.id)">코드 상세 관리</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 코드 상세 관리 -->
    <!-- 코드 상세 관리 부분 -->
    <div v-if="selectDetail">
      <h3>코드 상세 ({{ selectedGroup }})</h3>
      <form @submit.prevent="saveCodeDetail" class="form-group">
        <fieldset>
          <input v-model="detail.codeId" placeholder="코드 ID" required />
          <input v-model="detail.codeName" placeholder="코드명" required />
          <input v-model="detail.codeValue" placeholder="코드 값" required />
          <input
            v-model="detail.sortOrder"
            type="number"
            placeholder="정렬순서"
          />
          <select v-model="detail.isActive">
            <option :value="true">활성</option>
            <option :value="false">비활성</option>
          </select>
          <button type="submit">저장</button>
        </fieldset>
      </form>

      <table v-if="codeDetails.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>값</th>
            <th>정렬</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="d in codeDetails"
            :key="d.codeId"
            :class="{ selected: detail.codeId === d.codeId }"
          >
            <td>{{ d.codeId }}</td>
            <td>{{ d.codeName }}</td>
            <td>{{ d.codeValue }}</td>
            <td>{{ d.sortOrder }}</td>
            <td>{{ d.isActive ? "활성" : "비활성" }}</td>
            <td>
              <button @click="editDetail(d)">수정</button>
              <button @click="deleteDetail(d.codeId)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import codeService from "@/api/codeService";

  export default {
    setup() {
      const codeGroups = ref([]);
      const codeDetails = ref([]);
      const selectedGroup = ref(null);
      const selectDetail = ref(null); // selectDetail을 boolean으로 변경

      const group = ref({
        id: "",
        groupName: "",
        description: "",
      });

      const detail = ref({
        codeId: "",
        groupId: "",
        codeName: "",
        codeValue: "",
        sortOrder: 1,
        isActive: true,
      });

      // 코드 그룹 목록 로드
      const loadGroups = async () => {
        const { data } = await codeService.getCodeGroups();
        codeGroups.value = data.data;
      };

      // 코드 그룹 저장
      const saveCodeGroup = async () => {
        await codeService.createCodeGroup(group.value);
        group.value = { id: "", groupName: "", description: "" };
        loadGroups();
      };

      // 코드 그룹 수정
      const editGroup = (g) => {
        group.value = { ...g };
        selectedGroup.value = g.id;
      };

      // 코드 그룹 삭제
      const deleteGroup = async (id) => {
        await codeService.deleteCodeGroup(id);
        loadGroups();
      };

      // 코드 상세 보기/숨기기 토글
      const toggleSelectGroup = async (groupId) => {
        if (selectDetail.value === groupId) {
          selectedGroup.value = null;
          selectDetail.value = null; // 상세 숨기기
          codeDetails.value = [];
        } else {
          selectedGroup.value = groupId;
          selectDetail.value = groupId; // 상세 표시
          detail.value.groupId = groupId;
          const { data } = await codeService.getCodeDetails(groupId);
          codeDetails.value = data.data; // 코드 상세 정보 불러오기
        }
      };

      const stayGroup = async (groupId) => {
        selectedGroup.value = groupId;
        detail.value.groupId = groupId;
        const { data } = await codeService.getCodeDetails(groupId);
        codeDetails.value = data.data;
      };

      // 코드 상세 저장 또는 수정
      const saveCodeDetail = async () => {
        if (detail.value.codeId) {
          // 코드 ID가 있을 경우 수정 (업데이트)
          await codeService.updateCodeDetail(detail.value.codeId, detail.value);
        } else {
          // 코드 ID가 없으면 새로운 코드 상세 생성
          await codeService.createCodeDetail(detail.value);
        }

        // 코드 입력 폼 초기화 및 코드 목록 갱신
        detail.value = {
          codeId: "",
          groupId: selectedGroup.value,
          codeName: "",
          codeValue: "",
          sortOrder: 1,
          isActive: true,
        };
        stayGroup(selectedGroup.value); // 선택된 그룹에 대한 상세정보 갱신
      };

      // 코드 상세 수정
      const editDetail = (d) => {
        detail.value = { ...d };
      };

      // 코드 상세 삭제
      const deleteDetail = async (id) => {
        await codeService.deleteCodeDetail(id);
        toggleSelectGroup(selectedGroup.value);
      };

      onMounted(loadGroups);

      return {
        codeGroups,
        codeDetails,
        selectedGroup,
        selectDetail,
        group,
        detail,
        saveCodeGroup,
        editGroup,
        deleteGroup,
        toggleSelectGroup,
        saveCodeDetail,
        editDetail,
        deleteDetail,
      };
    },
  };
</script>

<style scoped>
  .container {
    width: 80%;
    margin: auto;
    font-family: Arial, sans-serif;
    color: #333;
  }

  .form-group fieldset {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }

  input,
  textarea,
  select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: #f8f8f8;
  }

  table,
  th,
  td {
    border: 1px solid #ccc;
  }

  th,
  td {
    padding: 10px;
    text-align: center;
  }

  th {
    background-color: #e0e0e0;
  }

  /* 선택된 행 스타일 */
  .selected {
    background-color: #ffeb99 !important;
  }

  button {
    margin-right: 5px;
    padding: 5px 10px;
    border: none;
    background-color: #666;
    color: white;
    cursor: pointer;
    border-radius: 4px;
  }

  button:hover {
    background-color: #555;
  }
</style>
