<template>
  <div class="user-request-list-container">
    <!-- Header with Logo -->
    <header class="header">
      <router-link to="/sitter" class="title-link">
        <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
        Im Pet
      </router-link>
      <router-link to="/detail" class="user-icon">USER</router-link>
    </header>

    <main class="main-content">
      <h1 class="title">내 요청 목록</h1>

      <div v-if="loading" class="loading">로딩 중...</div>

      <div v-else-if="requests.length === 0" class="no-requests">
        요청한 서비스가 없습니다.
      </div>

      <div v-else class="requests-list">
        <div v-for="request in requests" :key="request.id" class="request-item">
          <div class="request-info">
            <h3 class="service-name">{{ request.serviceName }}</h3>
            <p class="request-date">날짜: {{ formatDate(request.date) }}</p>
            <p class="request-time">
              시간: {{ request.startTime }} - {{ request.endTime }}
            </p>
            <p class="request-status" :class="request.status">
              상태: {{ translateStatus(request.status) }}
            </p>
          </div>
          <div class="request-actions">
            <button
              v-if="request.status === 'PENDING'"
              @click="cancelRequest(request.id)"
              class="action-button cancel"
            >
              요청 취소
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import axios from "axios";

  export default {
    setup() {
      const requests = ref([]);
      const loading = ref(true);

      const fetchRequests = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            "http://localhost:8080/api/v1/users/requests",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          requests.value = response.data.data;
        } catch (error) {
          console.error("요청 목록 가져오기 실패:", error);
        } finally {
          loading.value = false;
        }
      };

      onMounted(fetchRequests);

      const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("ko-KR", options);
      };

      const translateStatus = (status) => {
        const statusMap = {
          PENDING: "대기 중",
          ACCEPTED: "수락됨",
          REJECTED: "거절됨",
          CANCELED: "취소됨",
        };
        return statusMap[status] || status;
      };

      const cancelRequest = async (requestId) => {
        if (!confirm("정말로 이 요청을 취소하시겠습니까?")) return;

        try {
          const token = localStorage.getItem("accessToken");
          await axios.post(
            `http://localhost:8080/api/v1/users/requests/${requestId}/cancel`,
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // Update the local state
          const index = requests.value.findIndex((r) => r.id === requestId);
          if (index !== -1) {
            requests.value[index].status = "CANCELED";
          }
        } catch (error) {
          console.error("요청 취소 실패:", error);
          alert("요청 취소에 실패했습니다.");
        }
      };

      return {
        requests,
        loading,
        formatDate,
        translateStatus,
        cancelRequest,
      };
    },
  };
</script>

<style scoped>
  .user-request-list-container {
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

  .title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .loading,
  .no-requests {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 2rem;
  }

  .requests-list {
    display: grid;
    gap: 2rem;
  }

  .request-item {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .request-info h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .request-info p {
    margin: 0.25rem 0;
    color: #666;
  }

  .request-status {
    font-weight: bold;
  }

  .request-status.PENDING {
    color: #ffc107;
  }
  .request-status.ACCEPTED {
    color: #28a745;
  }
  .request-status.REJECTED,
  .request-status.CANCELED {
    color: #dc3545;
  }

  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .action-button.cancel {
    background-color: #dc3545;
    color: white;
  }

  .action-button.cancel:hover {
    background-color: #c82333;
  }

  @media (max-width: 768px) {
    .request-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .request-actions {
      margin-top: 1rem;
      align-self: flex-end;
    }
  }
</style>
