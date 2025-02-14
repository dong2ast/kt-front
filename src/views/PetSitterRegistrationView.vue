<template>
  <div class="pet-sitter-registration">
    <h1 class="title">펫시터 등록</h1>
    <form @submit.prevent="submitForm" class="registration-form">
      <div class="form-group">
        <label for="location">위치</label>
        <input 
          id="location" 
          v-model="formData.location" 
          type="text" 
          required
          placeholder="예: 서울시 강남구"
        >
      </div>

      <div class="form-group">
        <label for="petTypes">돌봄 가능 반려동물 종류</label>
        <input 
          id="petTypes" 
          v-model="formData.petTypes" 
          type="text" 
          required
          placeholder="예: 강아지, 고양이"
        >
      </div>

      <div class="form-group">
        <label>돌봄 가능 기간</label>
        <div class="date-range-input">
          <input v-model="startDate" type="date" required>
          <span>~</span>
          <input v-model="endDate" type="date" required>
        </div>
        <p v-if="dateRangeError" class="error-message">{{ dateRangeError }}</p>
      </div>

      <div class="form-group">
        <label for="hourlyRate">시간당 요금 (원)</label>
        <input 
          id="hourlyRate" 
          v-model.number="formData.hourlyRate" 
          type="number" 
          required
          min="0"
          placeholder="예: 20000"
        >
      </div>

      <button type="submit" class="submit-button">등록하기</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const formData = reactive({
      location: '',
      species: '',
      startDate: '',
      endDate: '',
      price: 0
    });

    const startDate = ref('');
    const endDate = ref('');
    const dateRangeError = ref('');
    const petTypes = ref('');
    const price = ref(0);

    const validateDateRange = () => {
      if (!startDate.value || !endDate.value) {
        dateRangeError.value = '시작 날짜와 종료 날짜를 모두 입력해주세요.';
        return false;
      }
      if (startDate.value > endDate.value) {
        dateRangeError.value = '종료 날짜는 시작 날짜보다 늦어야 합니다.';
        return false;
      }
      dateRangeError.value = '';
      return true;
    };

    const submitForm = async () => {
      if (!validateDateRange()) return;
      
      formData.startDate = startDate.value;
      formData.endDate = endDate.value;
      formData.species = petTypes.value;
      formData.price = price.value;

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("Access token is missing.");
          return;
        }

        const response = await axios.post("http://localhost:8080/api/v1/sitters", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          router.push('/sitter');
        }
      } catch (error) {
        console.error("펫시터 등록 실패:", error);
      }
    };

    return {
      formData,
      startDate,
      endDate,
      dateRangeError,
      petTypes,
      price,
      submitForm
    };
  }
};
</script>



<style scoped>
.pet-sitter-registration {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="number"],
input[type="date"] {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.date-range-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.error-message {
  color: red;
  font-size: 0.9rem;
}

.submit-button {
  padding: 1rem 2rem;
  background-color: #f0f0f0;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  align-self: center;
}

.submit-button:hover {
  background-color: #e0e0e0;
}

.submit-button:active {
  transform: translateY(2px);
}
</style>
