<template>
  <div class="header">
    <router-link to="/home" class="title-link">
      <img src="@/assets/dog.png" alt="Dog Icon" class="dog-icon" />
      Im Pet
    </router-link>
    <router-link to="#" class="user-button" @click.prevent="fetchUserInfo">
      <img src="@/assets/user.png" alt="User Icon" class="user-icon" />
      <span>{{ userName }}</span>
    </router-link>
  </div>
  <div class="container">
    <div class="circle-container">
      <router-link to="/shop" class="circle">SHOP</router-link>
      <router-link to="/pet" class="circle">PET</router-link>
      <router-link to="/sitter" class="circle">SITTER</router-link>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        userName: localStorage.getItem("userName") || "Guest",
      };
    },
    computed: {
      buttonStyle() {
        // 사용자 이름의 길이에 맞춰 버튼의 너비를 계산
        const width = `${(this.userName.length + 2) * 2}rem`; // 이름 길이에 비례하여 넓이 설정
        return {
          width: width, // 계산된 너비 적용
        };
      },
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
  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    overflow: hidden; /* 스크롤 막기 */
    height: 100%; /* 전체 화면 높이 유지 */
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 20vh);
    overflow: hidden;
    text-align: center;
  }

  .header {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 40px);
    height: 10vh;
    margin: 20px 20px 0 20px;
  }

  .title-link {
    font-size: 2.5rem;
    font-weight: bold;
    color: #333;
    text-decoration: none; /* 링크 스타일 제거 */
  }

  .user-button {
    padding: 10px; /* 올바른 padding 속성 */
    background-color: #f0f0f0;
    border-radius: 5px;
    text-decoration: none; /* 링크 스타일 제거 */
    color: #333;
    height: 90%;
    font-weight: bold;

    display: flex;
    justify-content: flex-start; /* 가로 중앙 정렬 */
    align-items: center; /* 세로 중앙 정렬 */
    text-align: center; /* 다중 줄 텍스트 정렬 */
  }

  .user-button span {
    margin-left: 10px; /* 아이콘과 이름 사이에 간격 추가 */
  }

  .circle-container {
    display: flex;
    justify-content: space-around;
    width: 80%;
    margin-top: 40px; /* 원과 헤더 사이의 간격 */
  }

  .circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16rem;
    height: 16rem;
    border-radius: 50%;
    background-color: #d3d3d3; /* 기본 배경색 */
    color: black;
    font-weight: bold;
    text-decoration: none; /* 링크 스타일 제거 */
    transition: background-color 0.3s; /* 부드러운 색상 변화 */
  }

  .circle:hover {
    background-color: #aaa; /* 호버 시 색상 변경 */
  }

  .user-icon {
    height: 100%;
  }
</style>
