<template>
  <div class="uploadpic">
    <el-upload
      class="avatar-uploader"
      action="/uploadpic"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageData.src" :src="imageData.src" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <el-button type="warning" @click="uploadpicData">上传</el-button>
  </div>
</template>

<script>
import { uploadpic } from '@/api/other'
export default {
  name: 'Uploadpic',
  components: {

  },
  props: {
    imageData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      imageUrl: '',
      fileData: {}
    }
  },
  mounted() {

  },
  created() {},
  methods: {
    uploadpicData() {
      var that = this
      var formData = new window.FormData()
      formData.append('file', this.fileData)
      uploadpic(formData).then(response => {
        that.imageData.src = response.url
      })
    },
    handleAvatarSuccess(res, file) {
      this.fileData = file.raw
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {}
  }
}
</script>

<style lang="scss" scoped>
    .uploadpic{
        display: flex;
        .avatar-uploader{
          border: 1px solid #ddd;
          text-align: center;
          font-size: 25px;
          width: 250px;
          line-height: 80px;
          height: 80px;
          >>>.el-upload{
            height: 80px;
            img{
              height:95%;
            }
          }
        }
        .el-button{
          height: 36px;
          margin-top: 20px;
          margin-left: 5px;
        }
    }

</style>
