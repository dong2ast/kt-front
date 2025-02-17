<template>
  <div class="service-detail-container">
    <header class="header">
      <router-link to="/sitter" class="title-link">
        <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
        Im Pet
      </router-link>
      <router-link to="/detail" class="user-icon">USER</router-link>
    </header>
    <main class="main-content">
      <div class="service-detail">
        <img
          src="@/assets/list_dog.jpeg"
          :alt="service.name"
          class="service-image"
        />
        <div class="service-info">
          <h1 v-if="!isEditing">{{ service.name }}</h1>

          <div class="info-grid">
            <div class="info-item">
              <h3>위치</h3>
              <p v-if="!isEditing">{{ service.location }}</p>
              <input
                v-else
                v-model="editedService.location"
                class="edit-input"
              />
            </div>

            <div class="info-item">
              <h3>돌봄 가능 동물</h3>
              <p v-if="!isEditing">{{ service.species }}</p>
              <input
                v-else
                v-model="editedService.species"
                class="edit-input"
              />
            </div>

            <div class="info-item">
              <h3>시간당 요금</h3>
              <p v-if="!isEditing">{{ service.price }}원</p>
              <input
                v-else
                type="number"
                v-model="editedService.price"
                class="edit-input"
              />
            </div>

            <div class="info-item">
              <h3>돌봄 가능 시간</h3>
              <ul class="time-list" v-if="!isEditing">
                <li v-for="(time, index) in service.schedule" :key="index">
                  {{ time.day }}: {{ time.startTime }} ~ {{ time.endTime }}
                </li>
              </ul>
              <div v-else>
                <div
                  v-for="(time, index) in editedService.schedule"
                  :key="index"
                  class="time-slot"
                >
                  <select v-model="time.day" class="day-select">
                    <option
                      v-for="(day, index) in daysOfWeek"
                      :key="index"
                      :value="day"
                    >
                      {{ day }}
                    </option>
                  </select>
                  <input
                    v-model="time.startTime"
                    type="time"
                    class="time-input"
                  />
                  <span>~</span>
                  <input
                    v-model="time.endTime"
                    type="time"
                    class="time-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="action-buttons">
            <template v-if="isOwner">
              <button
                v-if="!isEditing"
                @click="startEditing"
                class="action-button"
              >
                수정
              </button>
              <button v-if="isEditing" @click="saveEdit" class="action-button">
                저장
              </button>
              <button
                v-if="isEditing"
                @click="cancelEdit"
                class="action-button cancel"
              >
                취소
              </button>
              <button
                v-if="!isEditing"
                @click="cancelService"
                class="action-button cancel"
              >
                등록 취소
              </button>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const daysOfWeek = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];

    const route = useRoute();
    const router = useRouter();
    const isEditing = ref(false);
    const isOwner = ref(true); // 본인이 작성한 서비스인지 확인 (임시)

    const service = reactive({
      id: null,
      location: "",
      species: "",
      price: 0,
      schedule: [],
      image: "",
    });

    const editedService = reactive({ ...service });

    // JWT 토큰 가져오는 함수
    const getToken = () => localStorage.getItem("accessToken");

    // 서비스 데이터 불러오기 (Authorization 헤더 추가)
    const fetchService = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/api/v1/sitters/services/${route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code === 200) {
          Object.assign(service, response.data.data);
          Object.assign(editedService, response.data.data);
        }
      } catch (error) {
        console.error("서비스 불러오기 실패:", error);
      }
    };

    // 페이지 로드 시 서비스 데이터 가져오기
    onMounted(fetchService);

    const startEditing = () => {
      isEditing.value = true;
      Object.assign(editedService, service);
    };

    const cancelEdit = () => {
      isEditing.value = false;
    };

    // 서비스 수정 요청 (DTO에 맞게 수정)
    const saveEdit = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        // 요청 데이터 DTO 맞춤 변환
        const requestData = {
          id: editedService.id,
          location: editedService.location,
          species: editedService.species,
          price: editedService.price,
          schedule: editedService.schedule.map((time) => ({
            day: time.day,
            startTime: time.startTime,
            endTime: time.endTime,
          })),
        };

        const response = await axios.put(
          `http://localhost:8080/api/v1/sitters/services`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code === 200) {
          Object.assign(service, editedService);
          isEditing.value = false;
          alert("수정이 완료되었습니다.");
        } else {
          alert("수정 실패");
        }
      } catch (error) {
        console.error("수정 실패:", error);
        alert("수정 중 오류가 발생했습니다.");
      }
    };

    // 서비스 등록 취소 요청 (DELETE 요청)
    const cancelService = async () => {
      try {
        const token = getToken();
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }

        const response = await axios.delete(
          `http://localhost:8080/api/v1/sitters/services/${service.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.code === 204) {
          alert("서비스 등록이 취소되었습니다.");
          router.push("/sitter/my-services");
        } else {
          alert("서비스 등록 취소 실패");
        }
      } catch (error) {
        console.error("서비스 등록 취소 실패:", error);
        alert("서비스 등록 취소 중 오류가 발생했습니다.");
      }
    };

    return {
      service,
      editedService,
      isEditing,
      isOwner,
      startEditing,
      cancelEdit,
      saveEdit,
      cancelService,
      daysOfWeek,
    };
  },
};
</script>

<style scoped>
.service-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.title-link {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.dog-icon {
  height: 40px;
  margin-right: 1rem;
}

.user-icon {
  width: 40px;
  height: 40px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #333;
}

.service-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.service-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.service-title {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  gap: 2rem;
}

.info-item h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.info-item p {
  background-color: #f0f0f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.time-list {
  list-style: none;
  padding: 0;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.time-list li {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.time-list li:last-child {
  border-bottom: none;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  background-color: #000;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button.cancel {
  background-color: #dc3545;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.request-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .service-detail {
    grid-template-columns: 1fr;
  }

  .service-image {
    height: 300px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.edit-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.time-list {
  display: flex;
  flex-direction: column;
}

.time-list input {
  margin-bottom: 1rem;
}
</style>
