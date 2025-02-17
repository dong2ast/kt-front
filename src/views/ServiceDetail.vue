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
        <img :src="service.image" :alt="service.name" class="service-image" />

        <div class="service-info">
          <h1 class="service-title">{{ service.name }}</h1>
          <div class="info-grid">
            <div class="info-item">
              <h3>위치</h3>
              <p>{{ service.location }}</p>
            </div>
            <div class="info-item">
              <h3>돌봄 가능 동물</h3>
              <p>{{ service.petTypes }}</p>
            </div>
            <div class="info-item">
              <h3>시간당 요금</h3>
              <p>{{ service.price }}원</p>
            </div>
            <div class="info-item">
              <h3>돌봄 가능 시간</h3>
              <ul class="time-list">
                <li
                  v-for="(time, index) in service.availableTimes"
                  :key="index"
                >
                  {{ time.day }}: {{ time.start }} ~ {{ time.end }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <template v-if="isOwner">
              <button @click="editService" class="action-button">수정</button>
              <button @click="cancelService" class="action-button cancel">
                취소
              </button>
            </template>
            <template v-else>
              <button
                v-if="!hasRequested"
                @click="requestService"
                class="action-button"
              >
                예약 요청
              </button>
              <button
                v-else
                @click="cancelRequest"
                class="action-button cancel"
              >
                요청 취소
              </button>
            </template>
          </div>
        </div>
      </div>
    </main>

    <!-- Request Form Modal -->
    <div v-if="showRequestModal" class="modal">
      <div class="modal-content">
        <h2>예약 요청</h2>
        <form @submit.prevent="submitRequest" class="request-form">
          <div class="form-group">
            <label>날짜</label>
            <input type="date" v-model="requestForm.date" required />
          </div>
          <div class="form-group">
            <label>시간</label>
            <select v-model="requestForm.timeSlot" required>
              <option
                v-for="time in service.availableTimes"
                :key="time.day"
                :value="`${time.start}-${time.end}`"
              >
                {{ time.day }} {{ time.start }} ~ {{ time.end }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>요청사항</label>
            <textarea v-model="requestForm.notes" rows="3"></textarea>
          </div>
          <div class="modal-buttons">
            <button type="submit" class="action-button">요청하기</button>
            <button
              type="button"
              @click="showRequestModal = false"
              class="action-button cancel"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import axios from "axios";

  export default {
    setup() {
      const router = useRouter();
      const route = useRoute();
      const service = ref({
        id: 1,
        name: "강아지 산책",
        location: "서울시 강남구",
        petTypes: "강아지, 고양이",
        price: 25000,
        image: "@/assets/list_dog.jpeg",
        availableTimes: [
          { day: "월요일", start: "09:00", end: "18:00" },
          { day: "수요일", start: "10:00", end: "19:00" },
          { day: "금요일", start: "09:00", end: "17:00" },
        ],
      });

      const isOwner = ref(false);
      const hasRequested = ref(false);
      const showRequestModal = ref(false);
      const requestForm = ref({
        date: "",
        timeSlot: "",
        notes: "",
      });

      onMounted(async () => {
        try {
          const serviceId = route.params.id;
          const token = localStorage.getItem("accessToken");

          const response = await axios.get(
            `http://localhost:8080/api/v1/sitters/services/${serviceId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.code === 200) {
            service.value = response.data.data;
            isOwner.value = response.data.data.isOwner;
            hasRequested.value = response.data.data.hasRequested;
          }
        } catch (error) {
          console.error("서비스 정보 가져오기 실패:", error);
        }
      });

      const editService = () => {
        router.push(`/services/${service.value.id}/edit`);
      };

      const cancelService = async () => {
        if (!confirm("정말로 이 서비스를 취소하시겠습니까?")) return;

        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(
            `http://localhost:8080/api/v1/services/${service.value.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          router.push("/services");
        } catch (error) {
          console.error("서비스 취소 실패:", error);
        }
      };

      const requestService = () => {
        showRequestModal.value = true;
      };

      const submitRequest = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          await axios.post(
            `http://localhost:8080/api/v1/services/${service.value.id}/requests`,
            requestForm.value,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          showRequestModal.value = false;
          hasRequested.value = true;
        } catch (error) {
          console.error("예약 요청 실패:", error);
        }
      };

      const cancelRequest = async () => {
        if (!confirm("예약 요청을 취소하시겠습니까?")) return;

        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(
            `http://localhost:8080/api/v1/services/${service.value.id}/requests`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          hasRequested.value = false;
        } catch (error) {
          console.error("요청 취소 실패:", error);
        }
      };

      return {
        service,
        isOwner,
        hasRequested,
        showRequestModal,
        requestForm,
        editService,
        cancelService,
        requestService,
        submitRequest,
        cancelRequest,
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
</style>
