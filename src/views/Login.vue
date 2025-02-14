<template>
  <div class="container">
    <h1>Im Pet</h1>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">로그인</button>
    </form>
    <router-link to="/signup" class="signup-button">회원가입</router-link>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        email: "",
        password: "",
      };
    },
    methods: {
      async handleSubmit() {
        try {
          // 로그인 요청 보내기
          const response = await axios.post(
            "http://localhost:8080/api/v1/members/login",
            {
              email: this.email,
              password: this.password,
            }
          );

          const { name, tokenDto } = response.data.data;

          // 토큰 저장
          localStorage.setItem("accessToken", tokenDto.accessToken);
          localStorage.setItem("refreshToken", tokenDto.refreshToken);

          // 이름을 다른 곳에서 사용할 수 있게 저장
          localStorage.setItem("userName", name);

          // /home 경로로 이동
          this.$router.push("/home");
        } catch (error) {
          console.error("로그인 실패:", error);
          alert("로그인에 실패했습니다. 다시 시도해 주세요.");
        }
      },
    },
  };
</script>

<style scoped>
  body {
    margin: 0;
    display: flex;
    align-items: center; /* 수직 가운데 정렬 */
    justify-content: center; /* 수평 가운데 정렬 */
    height: 100vh; /* 전체 화면 높이 사용 */
    background-color: #ffffff; /* 배경색 설정 */
  }

  .container {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center; /* 수평 정렬 */
    justify-content: center; /* 수직 정렬 */
    text-align: center; /* 텍스트 중앙 정렬 */
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 75px;
    font-weight: bold;
    color: #333;
  }

  .input-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    width: 400px;
  }

  label {
    margin-bottom: 5px;
    font-weight: bold;
    color: #333;
  }

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f0f0f0;
    width: 200px;
  }

  button {
    padding: 10px 20px;
    margin-top: 10px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    font-weight: bold;
  }

  button:hover {
    background-color: #555;
  }

  .signup-button {
    margin-top: 15px; /* 버튼 위쪽 여백 추가 */
    padding: 10px 20px;
    background-color: #333; /* 버튼 배경색 */
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none; /* 링크 텍스트 장식 제거 */
    width: 100%;
    max-width: 360px; /* 버튼을 입력 필드와 동일한 폭으로 설정 */
    text-align: center; /* 텍스트 중앙 정렬 */
    font-weight: bold;
    font-size: 0.8rem;
  }

  .signup-button:hover {
    background-color: #555; /* 호버 색상 */
  }
</style>
