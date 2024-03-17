<template id="profile">
 <div id = "wrapper">
      <h1 class="authcateAnimated">
        {{ this.currentUser.authcate }}
      </h1>
      <div class=" roundCard">

       <img id="avatar" :src="setAvatar()" />
       </div>
<br>
         <button @click="logout()" class="uk-button">
        Logout
      </button>
      </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Profile",
  computed: {
    ...mapState("accounts", ["currentUser"]),
  },
  methods: {
    ...mapActions("accounts", ["logout"]),
    setAvatar() {
      return this.currentUser.avatar;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200&display=swap');
#avatar {
  width: 70%;
  margin: 15%;
};
#wrapper{
  padding: 20px;
  text-align: center;
}
.authcateAnimated{
  padding:20px;
  font-size: 4em;
  border: none;
  font-family: 'Poppins', sans-serif;
  /* font-family: "Helvetica"; */
  color: rgb(82, 81, 81);
  margin-top: 7%;
}
.roundCard{
  height:250px;
  width: 250px;
  border-radius: 20%;
  box-shadow: 3px 5px 18px #cac8c8;
  text-align: center;
  margin: 0 37% ;
}
button {
  margin-top:5%;
}
</style>
