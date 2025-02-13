<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <img src="@/assets/dog.png" alt="Logo" class="logo" />
        <router-link to="/home" class="home-link">Im Pet</router-link>
      </div>
      <h2>INFO</h2>
    </header>
    <div class="info-section">
      <div class="profile">
        <img src="@/assets/user.png" alt="User Icon" class="profile-icon" />
        <div class="info">
          <div class="info-item">
            <label>이름</label>
            <span>{{ userInfo.name }}</span>
          </div>
          <div class="info-item">
            <label>전화번호</label>
            <span>{{ userInfo.phone }}</span>
          </div>
          <div class="info-item">
            <label>이메일</label>
            <span>{{ userInfo.email }}</span>
          </div>
        </div>
      </div>
      <div class="button-container">
        <button class="button edit" @click="editInfo">수정</button>
        <button class="button delete" @click="deleteAccount">회원탈퇴</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userInfo: {
        name: "감자튀김",
        phone: "010-1234-5678",
        email: "test1234@gmail.com",
      },
    };
  },
  methods: {
    editInfo() {
      alert("정보 수정 기능은 추후에 구현될 예정입니다.");
    },
    async deleteAccount() {
      try {
        // 로컬 스토리지에서 accessToken 가져오기
        const token = localStorage.getItem("accessToken");

        // 삭제 요청 보내기
        const response = await axios.delete(
          "http://localhost:8080/api/v1/members",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Authorization 헤더에 accessToken 추가
            },
          }
        );

        // 요청 성공 시, 로그인 페이지로 리디렉션
        alert("회원탈퇴가 완료되었습니다.");
        this.$router.replace("/"); // / 페이지로 리디렉션
      } catch (error) {
        console.error("회원탈퇴 실패:", error);
        alert("회원탈퇴에 실패했습니다. 다시 시도해 주세요.");
      }
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  display: flex;
  align-items: center; /* 수직 가운데 정렬 */
  justify-content: center; /* 수평 가운데 정렬 */
  height: 100vh; /* 전체 화면 높이 사용 */
  background-color: #ffffff; /* 배경색 설정 */
}

header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

.logo {
  width: 50px; /* 로고 크기 조절 */
  height: auto;
  margin-right: 10px;
}

.header-left {
  display: flex;
  align-items: center;
}

.home-link {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
  z-index: 10;
}

h2 {
  width: 100%;
  text-align: center;
  font-size: 20px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.profile {
  margin-top: 50px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.info {
  flex: 1;
  justify-content: center;
  align-items: center;
}

.container {
  max-width: 1200px; /* 전체 너비 제한 */
  width: 100%;
  margin: 0 auto; /* 가운데 정렬 */
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #ccc;
  margin: 0 150px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-icon img {
  width: 80%;
  height: auto;
  border-radius: 50%;
}

.info-item {
  max-width: 500px;
  display: flex;
  justify-content: space-between;
  margin: 15px 150px;
}

.info-item label {
  font-weight: bold;
}

.button-container {
  margin-top: 20px;
  display: flex;
  justify-content: right; /* 버튼 중앙 정렬 */
  gap: 10px;
}

.button {
  padding: 10px 20px;
  background-color: #333; /* 버튼 배경색 */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center; /* 텍스트 중앙 정렬 */
  font-weight: bold;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #aaa;
}
</style>
