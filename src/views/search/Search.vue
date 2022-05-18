<template>
  <div>
    <el-header>
      <nav-bar></nav-bar>
    </el-header>
    <el-main>
      <el-row type="flex" justify="center" class="search-view">
        <el-col :span="20">
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-input v-model="input" placeholder="请输入内容" @keydown.enter.native="searchClick">
                <el-button slot="append" icon="el-icon-search" @click="searchClick">
                </el-button>
              </el-input>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" class="result">
            <el-col>
              <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" stretch v-loading="loading">
                <el-tab-pane lazy label="单曲" name="first">
                  <el-empty description="无结果" v-show="is_empty"></el-empty>
                  <el-table :data="result" stripe style="width: 100%" v-show="!is_empty">
                    <el-table-column width="50px">
                      <template slot-scope="scope">
                        <el-button icon="el-icon-caret-right" size="mini" @click="playMusic(scope.row.music_id)" circle>
                        </el-button>
                      </template>
                    </el-table-column>
                    <el-table-column :label="search_note" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-link @click="goDetail(scope.row.music_id, 'Music')">{{ scope.row.music_name }}
                        </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-link @click="goDetail(scope.row.artist_id, 'Artist')">{{ scope.row.artist_name }}</el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane lazy label="歌手" name="second">
                  <el-empty description="无结果" v-show="is_empty"></el-empty>
                  <el-table :data="result" stripe style="width: 100%" v-show="!is_empty">
                    <el-table-column width="80px">
                      <template slot-scope="scope">
                        <el-image style="width: 50px; height: 50px; margin-right: 20px; border-radius: 5px;"
                          :src="scope.row.avatar">
                        </el-image>
                      </template>
                    </el-table-column>
                    <el-table-column :label="search_note" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-link @click="goDetail(scope.row.artist_id, 'Artist')">{{ scope.row.artist_name }}
                        </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column label="简介" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{ scope.row.description }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane lazy label="歌单" name="three">
                  <el-empty description="无结果" v-show="is_empty"></el-empty>
                  <el-table :data="result" stripe style="width: 100%" v-show="!is_empty">
                    <el-table-column width="80px">
                      <template slot-scope="scope">
                        <el-image style="width: 50px; height: 50px; margin-right: 20px; border-radius: 5px;"
                          :src="scope.row.cover">
                        </el-image>
                      </template>
                    </el-table-column>
                    <el-table-column :label="search_note" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-link @click="goDetail(scope.row.playlist_id, 'Playlist')">{{ scope.row.playlist_name }}
                        </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-link @click="goDetail(scope.row.user_id, 'User')">by {{ scope.row.user_name }}#{{scope.row.user_id}}</el-link>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane lazy label="用户" name="four">
                  <el-empty description="无结果" v-show="is_empty"></el-empty>
                  <el-table :data="result" stripe style="width: 100%" v-show="!is_empty">
                    <el-table-column width="80px">
                      <template slot-scope="scope">
                        <el-image style="width: 50px; height: 50px; margin-right: 20px; border-radius: 5px;"
                          :src="scope.row.avatar">
                        </el-image>
                      </template>
                    </el-table-column>
                    <el-table-column label="UID" :show-overflow-tooltip="true" width="50px">
                      <template slot-scope="scope">
                        #{{ scope.row.user_id }}
                      </template>
                    </el-table-column>
                    <el-table-column :label="search_note" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <el-link @click="goDetail(scope.row.user_id, 'User')">{{ scope.row.user_name }}
                        </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column label="个人介绍" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        {{ scope.row.description ? scope.row.description : '暂无介绍' }}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>
<script>
import NavBar from "../../components/navBar/NavBar";
import { mapActions } from "vuex";
export default {
  name: "Search",
  components: { NavBar },
  data() {
    return {
      input: '',
      activeName: 'first',
      result: [],
      total: 0,
      input_copy: '',
      loading: false,
    };
  },
  computed: {
    is_empty: function () {
      return this.result.length === 0;
    },
    search_note: function () {
      return `搜索"${this.input_copy}"的结果，共${this.total}项`;
    }
  },
  methods: {
    ...mapActions({
      playMusic: "changeCurrentSong"
    }),
    searchClick() {
      if (this.input === '') {
        this.$message({
          message: '请输入关键字',
          type: 'warning'
        });
      } else {
        // 保证退后可以显示原来的搜索结果
        this.goRouter();
      }
    },
    goRouter() {
      this.$router.push({
        path: '/search',
        query: {
          keyword: this.input,
          type: this.activeName
        }
      });
    },
    search() {
      // 修改搜索关键字的显示
      if (this.input_copy !== this.input) {
        this.input = this.input_copy;
      }
      if (this.input_copy !== '') {
        switch (this.$route.query.type) {
          case "first":
            this.searchByName(this.input_copy, '/music/getMusicByName');
            break;
          case "second":
            this.searchByName(this.input_copy, '/artist/getArtistByName');
            break;
          case "three":
            this.searchByName(this.input_copy, '/playlist/getPlaylistByName');
            break;
          case "four":
            this.searchByName(this.input_copy, '/user/getUserByName');
            break;
          default: console.log("默认");
        }
      }
    },
    handleClick() {
      this.goRouter();
    },
    goMusicDetail(id) {
      this.$router.push({
        name: "Music",
        params: { id },
      });
    },
    goDetail(id, type) {
      this.$router.push({
        name: type,
        params: { id },
      });
    },
    searchByName(keyword, api) {
      this.loading = true;
      this.$axios({
        url: api,
        method: 'get',
        params: {
          name: keyword,
          page: 1,
          pageSize: 10
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.result = res.data.obj.data;
          this.total = res.data.obj.total;
          if (res.data.obj.total === 0 && typeof (this.$route.query.keyword) !== 'undefined') {
            this.$message({
              message: '无结果',
              type: 'warning'
            });
          }
          this.loading = false;
        }

      })
    }
  },
  watch: {
    '$route': {
      handler: function (to, from) {
        this.activeName = to.query.type;
        this.input_copy = to.query.keyword;
        if (!to.query.type) {
          this.activeName = 'first';
        }
        this.search();
      },
      immediate: true
    }
  },
}


</script>
<style>
.search-view {
  padding-top: 40px;
}

.search-note {
  height: 20px;
  margin: 20px 0 20px 0;
  font-size: 12px;
}

.result {
  padding-top: 40px;
}
</style>