<template>
  <div class="avatar-container">
    <div class="avatar-wrapper">
      <AvatarShow :name="userInfo.name" class="user-avatar" :avatar="avatar" size="small" />
      <span class="user-name">{{ userInfo.name || '用户名' }}</span>
      <i class="el-icon-arrow-down" />
    </div>
    <div class="avatar-container-dropdown">
      <!-- <div class="dropdown-item" @click="goUserCenter">个人中心</div> -->
      <!-- <div class="dropdown-item" @click="changePassword">修改密码</div> -->
      <div class="dropdown-item" @click="logout">退出登录</div>
    </div>

    <!--修改密码-->
    <!-- <cp ref="cp"></cp> -->
  </div>
</template>

<script>
// import cp from '@/views/login/components/ChangePassword.vue'
import { removeToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
import AvatarShow from './AvatarShow'
export default {
  name: 'Avatar',
  components: { AvatarShow },
  computed: {
    ...mapGetters(['userInfo', 'avatar'])
  },
  methods: {
    goUserCenter() {
      this.$router.push('/').catch((err) => err)
    },

    changePassword() {
      this.$refs.cp.show()
    },

    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '点错了'
      })
        .then(() => {
          removeToken()
          location.reload()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/mixins.scss';

.avatar-container {
  padding: 0 32px 0 12px;

  .avatar-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;

    .user-name {
      display: inline-block;
      padding: 0 8px;
      @include font_color('header-text-color');
      font-size: 14px;
    }

    .el-icon-arrow-down {
      @include font_color('header-text-color');
      font-size: 12px;
    }
  }

  &-dropdown {
    position: absolute;
    top: 100%;
    right: 32px;
    display: none;
    background: #fff;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);

    .dropdown-item {
      min-width: 140px;
      padding: 12px 22px;
      font-size: 14px;
      line-height: 100%;
      cursor: pointer;

      &:hover {
        @include background_color('menu-hover-bg-color');
      }
    }
  }

  &:hover {
    .avatar-container-dropdown {
      display: block;
    }
  }
}
</style>
