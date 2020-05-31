<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    console.log("实例化Vue")
		this.$store.commit('user/initUser')
    this.$store.commit('user/SET_MENU','')
  }
}
</script>
