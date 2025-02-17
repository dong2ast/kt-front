<template>
  <div class="my-services-container">
    <!-- Header with Logo -->
    <header class="header">
      <router-link to="/sitter" class="title-link">
        <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
        Im Pet
      </router-link>
      <router-link to="/detail" class="user-icon">USER</router-link>
    </header>

    <main class="main-content">
      <h1 class="title">내 서비스 목록</h1>

      <div v-if="loading" class="loading">로딩 중...</div>

      <div v-else-if="services.length === 0" class="no-services">
        등록된 서비스가 없습니다.
      </div>

      <div v-else class="services-list">
        <div
          v-for="service in services"
          :key="service.id"
          class="service-item"
          @click="goToServiceDetail(service.id)"
        >
          <img :src="service.image" :alt="service.name" class="service-image" />
          <div class="service-info">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-price">{{ formatPrice(service.price) }}원/시간</p>
          </div>
          <div class="service-actions">
            <button @click="editService(service.id)" class="action-button edit">
              수정
            </button>
            <button
              @click="deleteService(service.id)"
              class="action-button delete"
            >
              삭제
            </button>
          </div>
        </div>
      </div>

      <button @click="navigateToServiceRegistration" class="floating-button">
        + 서비스 등록
      </button>
    </main>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";

  export default {
    setup() {
      const router = useRouter();
      const services = ref([]);
      const loading = ref(true);

      const fetchServices = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.get(
            "http://localhost:8080/api/v1/sitters/services",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          services.value = response.data.data; // 응답 데이터는 그대로 services에 저장
        } catch (error) {
          console.error("서비스 목록 가져오기 실패:", error);
        } finally {
          loading.value = false;
        }
      };

      const goToServiceDetail = (serviceId) => {
        router.push(`/sitter/services/${serviceId}`);
      };

      onMounted(fetchServices);

      const formatPrice = (price) => {
        return price.toLocaleString();
      };

      const editService = (serviceId) => {
        router.push(`/services/${serviceId}/edit`);
      };

      const deleteService = async (serviceId) => {
        if (!confirm("정말로 이 서비스를 삭제하시겠습니까?")) return;

        try {
          const token = localStorage.getItem("accessToken");
          await axios.delete(
            `http://localhost:8080/api/v1/sitters/services/${serviceId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          services.value = services.value.filter(
            (service) => service.id !== serviceId
          );
        } catch (error) {
          console.error("서비스 삭제 실패:", error);
          alert("서비스 삭제에 실패했습니다.");
        }
      };

      const navigateToServiceRegistration = () => {
        router.push("/sitter/my-services/register");
      };

      return {
        services,
        goToServiceDetail,
        loading,
        formatPrice,
        editService,
        deleteService,
        navigateToServiceRegistration,
      };
    },
  };
</script>

<style scoped>
  .my-services-container {
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
  .no-services {
    text-align: center;
    font-size: 1.2rem;
    margin-top: 2rem;
  }

  .services-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .service-item {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .service-item:hover {
    transform: translateY(-5px);
  }

  .service-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .service-info {
    padding: 1rem;
  }

  .service-name {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .service-price {
    color: #666;
  }

  .service-actions {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
  }

  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .action-button.edit {
    background-color: #007bff;
    color: white;
  }

  .action-button.delete {
    background-color: #dc3545;
    color: white;
  }

  .floating-button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #28a745;
    color: white;
    font-size: 1.5rem;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s;
  }

  .floating-button:hover {
    background-color: #218838;
  }

  @media (max-width: 768px) {
    .services-list {
      grid-template-columns: 1fr;
    }

    .floating-button {
      width: 50px;
      height: 50px;
      font-size: 1.2rem;
    }
  }
</style>
