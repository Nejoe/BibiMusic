<template>
    <div>
        <el-header>
          <nav-bar></nav-bar>
        </el-header>
        <el-main>
            search
        </el-main>
    </div>
</template>
<script>
import NavBar from "../../components/navBar/NavBar";
export default {
  name: "Search",
  components: { NavBar },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
</style>