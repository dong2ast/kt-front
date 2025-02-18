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
            <span v-if="!isEditing">{{ userInfo.name }}</span>
            <input v-else v-model="editData.name" type="text" />
          </div>
          <div class="info-item">
            <label>전화번호</label>
            <span v-if="!isEditing">{{ userInfo.phone }}</span>
            <input v-else v-model="editData.phone" type="text" />
          </div>
          <div class="info-item">
            <label>이메일</label>
            <span>{{ userInfo.email }}</span>
            <!-- 이메일은 수정 불가 -->
          </div>
        </div>
      </div>
      <div class="button-container">
        <button v-if="!isEditing" class="button edit" @click="startEdit">
          수정
        </button>
        <button v-else class="button save" @click="saveEdit">완료</button>
        <button class="button logout" @click="logout">로그아웃</button>
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
        isEditing: false, // 수정 모드 여부
        userInfo: {
          name: localStorage.getItem("userName") || "Guest",
          phone: localStorage.getItem("userPhone") || "정보 없음",
          email: localStorage.getItem("userEmail") || "정보 없음",
        },
        editData: {
          name: "", // 수정할 이름
          phone: "", // 수정할 전화번호
        },
      };
    },
    methods: {
      startEdit() {
        // 수정 버튼 클릭 시 기존 데이터를 입력 필드에 채움
        this.editData.name = this.userInfo.name;
        this.editData.phone = this.userInfo.phone;
        this.isEditing = true;
      },
      async saveEdit() {
        try {
          const token = localStorage.getItem("accessToken");

          // PUT 요청 보내기
          const response = await axios.put(
            "http://localhost:8080/api/v1/members",
            {
              name: this.editData.name,
              phone: this.editData.phone,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // 성공적으로 변경되었을 경우 UI 업데이트
          if (response.data.code === 200) {
            // localStorage 업데이트
            localStorage.setItem("userName", this.editData.name);
            localStorage.setItem("userPhone", this.editData.phone);

            // UI 업데이트
            this.userInfo.name = this.editData.name;
            this.userInfo.phone = this.editData.phone;
            this.isEditing = false;
          } else {
            alert("정보 수정에 실패했습니다.");
          }
        } catch (error) {
          console.error("정보 수정 실패:", error);
          alert("정보 수정 중 오류가 발생했습니다.");
        }
      },
      async deleteAccount() {
        try {
          const token = localStorage.getItem("accessToken");

          const response = await axios.delete(
            "http://localhost:8080/api/v1/members",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("회원탈퇴가 완료되었습니다.");
          this.$router.replace("/");
        } catch (error) {
          console.error("회원탈퇴 실패:", error);
          alert("회원탈퇴에 실패했습니다. 다시 시도해 주세요.");
        }
      },
      async logout() {
        try {
          const token = localStorage.getItem("accessToken");

          await axios.post(
            "http://localhost:8080/api/v1/members/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // localStorage 데이터 삭제
          localStorage.removeItem("accessToken");
          localStorage.removeItem("userName");
          localStorage.removeItem("userPhone");
          localStorage.removeItem("userEmail");

          alert("로그아웃 되었습니다.");
          this.$router.replace("/");
        } catch (error) {
          console.error("로그아웃 실패:", error);
          alert("로그아웃에 실패했습니다. 다시 시도해 주세요.");
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
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #ffffff;
  }

  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
  }

  .logo {
    width: 50px;
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
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
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

  input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: right;
    gap: 10px;
  }

  .button {
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .button:hover {
    background-color: #aaa;
  }

  .save {
    background-color: #007bff;
  }

  .save:hover {
    background-color: #0056b3;
  }

  .button.delete {
    background-color: #ff5733;
  }

  .button.delete:hover {
    background-color: #cc4626;
  }
</style>
