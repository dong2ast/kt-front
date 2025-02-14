<template>
  <div class="pet-sitter-profile">
    <header class="header">
      <router-link to="/sitter" class="title-link">
        <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
        Im Pet
      </router-link>
      <div class="info-text">INFO</div>
    </header>

    <main class="main-content">
      <div class="profile-section">
        <div class="profile-image">
          <img src="@/assets/user.png" alt="Profile" />
        </div>

        <div class="info-section">
          <div v-if="!isEditing">
            <div class="info-row">
              <span class="label">이름</span>
              <span class="value">{{ profile.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">위치</span>
              <span class="value">{{ profile.location }}</span>
            </div>
            <div class="info-row">
              <span class="label">돌봄 가능 동물</span>
              <span class="value">{{ profile.petTypes }}</span>
            </div>
            <div class="info-row">
              <span class="label">돌봄 가능 일정</span>
              <span class="value"
                >{{ profile.startDate }} ~ {{ profile.endDate }}</span
              >
            </div>
            <div class="info-row">
              <span class="label">시간당 요금</span>
              <span class="value">{{ profile.hourlyRate }}원</span>
            </div>

            <div class="button-container">
              <button @click="startEditing" class="edit-button">수정</button>
            </div>
          </div>

          <form v-else @submit.prevent="saveProfile" class="edit-form">
            <div class="form-group">
              <label>위치</label>
              <input v-model="editedProfile.location" required />
            </div>

            <div class="form-group">
              <label>돌봄 가능 동물</label>
              <input v-model="editedProfile.petTypes" required />
            </div>

            <div class="form-group">
              <label>돌봄 가능 일정</label>
              <div class="date-input-container">
                <input v-model="editedProfile.startDate" type="date" required />
                <span>~</span>
                <input v-model="editedProfile.endDate" type="date" required />
              </div>
            </div>

            <div class="form-group">
              <label>시간당 요금 (원)</label>
              <input
                v-model.number="editedProfile.hourlyRate"
                type="number"
                required
                min="0"
              />
            </div>

            <div class="button-container">
              <button type="submit" class="save-button">저장</button>
              <button
                type="button"
                @click="cancelEditing"
                class="cancel-button"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="!isRegister" class="approval-notice">
        <p>현재 관리자 승인 대기 중입니다.</p>
        <button @click="cancelRegistration" class="withdraw-button">
          펫시터 등록 취소
        </button>
      </div>
      <div v-if="isRegister" class="withdraw-section">
        <button @click="withdrawSitter" class="withdraw-button">
          펫시터 탈퇴
        </button>
      </div>
    </main>
  </div>
</template>

<script>
  import { ref, reactive, onMounted } from "vue";
  import axios from "axios";
  import { useRouter } from "vue-router";

  export default {
    setup() {
      const router = useRouter();
      const isEditing = ref(false);
      const isRegister = ref(false);

      const profile = reactive({
        name: "",
        location: "",
        petTypes: "",
        startDate: "",
        endDate: "",
        hourlyRate: 0,
      });

      const editedProfile = reactive({ ...profile });

      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            console.error("Access token is missing.");
            return;
          }

          const response = await axios.get(
            "http://localhost:8080/api/v1/sitters/profile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.code === 200) {
            Object.assign(profile, {
              name: response.data.data.name,
              location: response.data.data.location,
              petTypes: response.data.data.species,
              startDate: response.data.data.startDate,
              endDate: response.data.data.endDate,
              hourlyRate: response.data.data.price,
            });

            isRegister.value = response.data.data.isRegister;
          }
        } catch (error) {
          console.error("펫시터 프로필 불러오기 실패:", error);
        }
      };

      onMounted(fetchProfile);

      const withdrawSitter = async () => {
        if (!confirm("정말로 펫시터를 탈퇴하시겠습니까?")) return;

        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            console.error("Access token is missing.");
            return;
          }

          const response = await axios.delete(
            "http://localhost:8080/api/v1/sitters",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.code === 204) {
            alert("펫시터 탈퇴가 완료되었습니다.");
            router.push("/sitter"); // 탈퇴 후 리다이렉트
          } else {
            alert("펫시터 탈퇴 실패");
          }
        } catch (error) {
          console.error("펫시터 탈퇴 실패:", error);
        }
      };

      const startEditing = () => {
        isEditing.value = true;
        Object.assign(editedProfile, profile);
      };

      const cancelEditing = () => {
        isEditing.value = false;
      };

      const saveProfile = async () => {
        if (editedProfile.startDate > editedProfile.endDate) {
          alert("종료 날짜는 시작 날짜보다 늦어야 합니다.");
          return;
        }

        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            console.error("Access token is missing.");
            return;
          }

          const response = await axios.put(
            "http://localhost:8080/api/v1/sitters",
            {
              location: editedProfile.location,
              species: editedProfile.petTypes,
              startDate: editedProfile.startDate,
              endDate: editedProfile.endDate,
              price: editedProfile.hourlyRate,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.code === 200) {
            Object.assign(profile, editedProfile);
            isEditing.value = false;
            console.log("프로필 저장됨:", profile);
          } else {
            alert("프로필 저장 실패");
          }
        } catch (error) {
          console.error("프로필 저장 실패:", error);
        }
      };

      return {
        isEditing,
        profile,
        editedProfile,
        fetchProfile,
        withdrawSitter,
        isRegister,
        startEditing,
        cancelEditing,
        saveProfile,
      };
    },
  };
</script>

<style scoped>
  .pet-sitter-profile {
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

  .date-input-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .logo {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .logo-image {
    height: 30px;
    margin-right: 0.5rem;
  }

  .info-text {
    font-size: 1.5rem;
    font-weight: bold;
  }

  .title-link {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none; /* 링크 스타일 제거 */
  }

  .main-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .profile-section {
    display: flex;
    gap: 3rem;
    margin-bottom: 2rem;
  }

  .profile-image {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #000;
  }

  .profile-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .info-section {
    flex: 1;
  }

  .info-row {
    margin-bottom: 1.5rem;
  }

  .label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .value {
    display: block;
    background-color: #f0f0f0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }

  .time-ranges {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .button-container {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }

  .edit-button,
  .save-button,
  .cancel-button {
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4a4a4a;
    color: white;
  }

  .edit-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group input,
  .form-group select {
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
  }

  .time-input-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .time-range-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f0f0f0;
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }

  .add-button,
  .remove-button {
    padding: 0.25rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4a4a4a;
    color: white;
  }

  .approval-notice {
    margin-top: 3rem;
    text-align: center;
  }

  .withdraw-button {
    margin-top: 1rem;
    padding: 0.5rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #4a4a4a;
    color: white;
  }

  @media (max-width: 768px) {
    .profile-section {
      flex-direction: column;
      align-items: center;
    }

    .profile-image {
      width: 150px;
      height: 150px;
    }

    .time-input-container {
      flex-wrap: wrap;
    }
  }

  .withdraw-section {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }

  .withdraw-button {
    padding: 0.75rem 2rem;
    background-color: #d9534f;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.2s ease-in-out;
  }

  .withdraw-button:hover {
    background-color: #c9302c;
  }
</style>
