<template>
  <div class="pet-sitter-container">
    <!-- Header with Logo -->
    <header class="header">
      <router-link to="/home" class="title-link">
        <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
        Im Pet
      </router-link>
      <router-link to="/detail" class="user-icon" @click.prevent="fetchUserInfo"
        >USER</router-link
      >
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <h1 class="title">Pet Sitter Services</h1>

      <!-- Controls based on user role -->
      <div class="control-buttons">
        <template v-if="isPetSitter">
          <button @click="navigateToProfile" class="square-button">
            프로필 관리
          </button>
          <button @click="navigateToServiceRegistration" class="square-button">
            서비스 등록
          </button>
        </template>
        <template v-else>
          <button @click="registerAsPetSitter" class="square-button">
            펫시터 등록
          </button>
        </template>
      </div>

      <!-- Services List -->
      <div class="services-list">
        <div
          v-for="service in sitterServices"
          :key="service.id"
          class="service-item"
          @click="viewServiceDetails(service.id)"
        >
          <img
            src="@/assets/list_dog.jpeg"
            :alt="service.name"
            class="service-image"
          />
          <div class="service-info">
            <h3 class="service-name">{{ service.name }}</h3>
            <p class="service-price">{{ service.price }}원/시간</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
  import axios from "axios";
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";

  export default {
    setup() {
      const router = useRouter();
      const isPetSitter = ref(false); // Changed to false for demonstration
      const sitterServices = ref([
        {
          id: 1,
          name: "강아지 산책",
          price: 25000,
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2023-GU4lkUGhAgTLgfItZi61xbUCPy6THy.png",
        },
        {
          id: 2,
          name: "방문 돌봄",
          price: 40000,
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2023-GU4lkUGhAgTLgfItZi61xbUCPy6THy.png",
        },
        {
          id: 3,
          name: "장기 돌봄",
          price: 35000,
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%2023-GU4lkUGhAgTLgfItZi61xbUCPy6THy.png",
        },
      ]);
      onMounted(async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            console.error("Access token is missing.");
            return;
          }

          const response = await axios.get(
            "http://localhost:8080/api/v1/sitters",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.code === 200) {
            isPetSitter.value = response.data.data.isSitter;
          }
        } catch (error) {
          console.error("펫시터 정보 가져오기 실패:", error);
        }
      });

      const navigateToProfile = () => {
        router.push("/sitter/profile");
      };

      const navigateToServiceRegistration = () => {
        console.log("서비스 등록으로 이동");
      };

      const registerAsPetSitter = () => {
        router.push("/sitter/registration");
      };

      const viewServiceDetails = (serviceId) => {
        console.log("서비스 상세 보기:", serviceId);
      };

      return {
        isPetSitter,
        sitterServices,
        navigateToProfile,
        navigateToServiceRegistration,
        registerAsPetSitter,
        viewServiceDetails,
      };
    },
    methods: {
      async fetchUserInfo() {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            alert("로그인이 필요합니다.");
            this.$router.replace("/login");
            return;
          }

          const response = await axios.get(
            "http://localhost:8080/api/v1/members",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { email, name, phone } = response.data.data;

          // 사용자 정보를 localStorage에 저장
          localStorage.setItem("userName", name);
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userPhone", phone);

          // userName 업데이트
          this.userName = name;

          // detail 페이지로 이동
          this.$router.push("/detail");
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          alert("사용자 정보를 불러오는 데 실패했습니다.");
        }
      },
    },
  };
</script>

<style scoped>
  .title-link {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none; /* 링크 스타일 제거 */
  }

  .pet-sitter-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .user-icon {
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    text-decoration: none;
    color: #333;
  }

  .main-content {
    text-align: center;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .control-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .square-button {
    padding: 1rem 2rem;
    background-color: #f0f0f0;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
  }

  .square-button:hover {
    background-color: #e0e0e0;
  }

  .square-button:active {
    transform: translateY(2px);
  }

  .services-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    padding: 1rem;
  }

  .service-item {
    background-color: #f9f9f9;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
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

  @media (max-width: 768px) {
    .control-buttons {
      flex-direction: column;
      align-items: center;
    }

    .square-button {
      width: 100%;
      max-width: 250px;
    }
  }
</style>
