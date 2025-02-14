<template>
  <div class="container">
    <router-link to="/" class="title-link">Im Pet</router-link>
    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <label for="name">이름</label>
        <input type="text" id="name" v-model="name" required />
      </div>
      <div class="input-group">
        <label for="phone">전화번호</label>
        <input type="tel" id="phone" v-model="phone" required />
      </div>
      <div class="input-group">
        <label for="email">이메일</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">완료</button>
    </form>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    data() {
      return {
        name: "",
        phone: "",
        email: "",
        password: "",
      };
    },
    methods: {
      async handleSubmit() {
        const signupData = {
          name: this.name,
          phone: this.phone,
          email: this.email,
          password: this.password,
        };

        try {
          // 서버로 POST 요청을 보냅니다.
          const response = await axios.post(
            "http://localhost:8080/api/v1/members/signup",
            signupData
          );

          // 성공적으로 응답을 받으면 처리
          console.log("회원가입 성공:", response.data);
          alert("회원가입이 성공적으로 완료되었습니다!");

          // 필요에 따라 리디렉션 등을 할 수 있습니다.
          this.$router.push("/"); // 예: 로그인 페이지로 이동
        } catch (error) {
          console.error("회원가입 실패:", error);
          alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
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

  .title-link {
    font-size: 2.5rem;
    margin-bottom: 75px;
    font-weight: bold;
    text-decoration: none;
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
</style>
