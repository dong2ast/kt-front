<template>
  <div class="service-registration-container">
    <!-- Header with Logo -->
    <header class="header">
      <router-link to="/sitter" class="title-link">
        <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
        Im Pet
      </router-link>
      <router-link to="/detail" class="user-icon">USER</router-link>
    </header>

    <main class="main-content">
      <h1 class="title">서비스 등록</h1>

      <form @submit.prevent="registerService" class="registration-form">
        <!-- Service Types -->
        <div class="form-group">
          <h2>제공 가능한 서비스</h2>
          <div class="checkbox-group">
            <label v-for="service in serviceTypes" :key="service.value">
              <input
                type="checkbox"
                v-model="selectedServices"
                :value="service.value"
              />
              {{ service.label }}
            </label>
          </div>
        </div>

        <!-- Dog Sizes -->
        <div class="form-group">
          <h2>돌봄 가능한 크기</h2>
          <div class="checkbox-group">
            <label v-for="size in dogSizes" :key="size.value">
              <input
                type="checkbox"
                v-model="selectedSizes"
                :value="size.value"
              />
              {{ size.label }}
            </label>
          </div>
        </div>

        <!-- Rates -->
        <div class="form-group">
          <h2>시간당 요금 (원)</h2>
          <input
            type="number"
            v-model.number="rate"
            required
            min="0"
            step="1000"
          />
        </div>

        <!-- Available Schedule -->
        <div class="form-group">
          <h2>가능 일정</h2>
          <div v-for="day in daysOfWeek" :key="day" class="schedule-day">
            <h3>{{ day }}</h3>
            <div class="time-range">
              <input type="time" v-model="schedule[day].start" />
              <span>~</span>
              <input type="time" v-model="schedule[day].end" />
            </div>
          </div>
        </div>

        <button type="submit" class="submit-button">서비스 등록</button>
      </form>
    </main>
  </div>
</template>

<script>
  import { ref, reactive } from "vue";
  import { useRouter } from "vue-router";
  import axios from "axios";

  export default {
    setup() {
      const router = useRouter();

      const serviceTypes = [
        { value: "WALK", label: "산책" },
        { value: "VISIT", label: "방문 돌봄" },
        { value: "BOARDING", label: "위탁 돌봄" },
      ];

      const dogSizes = [
        { value: "SMALL", label: "소형견 (10kg 이하)" },
        { value: "MEDIUM", label: "중형견 (10kg~25kg)" },
        { value: "LARGE", label: "대형견 (25kg 초과)" },
      ];

      const daysOfWeek = [
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
        "일요일",
      ];

      const selectedServices = ref([]);
      const selectedSizes = ref([]);
      const rate = ref(0);
      const schedule = reactive(
        daysOfWeek.reduce((acc, day) => {
          acc[day] = { start: "", end: "" };
          return acc;
        }, {})
      );

      const registerService = async () => {
        if (!validateForm()) return;

        try {
          const token = localStorage.getItem("accessToken");
          const response = await axios.post(
            "http://localhost:8080/api/v1/sitters/services/registration",
            {
              serviceTypes: selectedServices.value,
              dogSizes: selectedSizes.value,
              rate: rate.value,
              schedule: Object.entries(schedule)
                .map(([day, time]) => ({
                  day,
                  startTime: time.start,
                  endTime: time.end,
                }))
                .filter((s) => s.startTime && s.endTime),
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.code === 201) {
            alert("서비스가 성공적으로 등록되었습니다.");
            router.push("/sitter");
          }
        } catch (error) {
          console.error("서비스 등록 실패:", error);
          alert("서비스 등록에 실패했습니다. 다시 시도해주세요.");
        }
      };

      const validateForm = () => {
        if (selectedServices.value.length === 0) {
          alert("최소 하나의 서비스를 선택해주세요.");
          return false;
        }
        if (selectedSizes.value.length === 0) {
          alert("최소 하나의 반려견 크기를 선택해주세요.");
          return false;
        }
        if (rate.value <= 0) {
          alert("유효한 요금을 입력해주세요.");
          return false;
        }
        const hasSchedule = Object.values(schedule).some(
          ({ start, end }) => start && end
        );
        if (!hasSchedule) {
          alert("최소 하나의 가능 일정을 입력해주세요.");
          return false;
        }
        return true;
      };

      return {
        serviceTypes,
        dogSizes,
        daysOfWeek,
        selectedServices,
        selectedSizes,
        rate,
        schedule,
        registerService,
      };
    },
  };
</script>

<style scoped>
  .service-registration-container {
    max-width: 800px;
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

  .registration-form {
    background-color: #f9f9f9;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 2rem;
  }

  .form-group h2 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .checkbox-group input[type="checkbox"] {
    margin-right: 0.5rem;
  }

  input[type="number"],
  input[type="time"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .schedule-day {
    margin-bottom: 1rem;
  }

  .schedule-day h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  .time-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .submit-button {
    width: 100%;
    padding: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .submit-button:hover {
    background-color: #0056b3;
  }

  @media (max-width: 768px) {
    .checkbox-group {
      flex-direction: column;
    }

    .time-range {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
