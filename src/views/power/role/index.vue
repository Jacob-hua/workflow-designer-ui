<template>
  <div class="personnel">
    <div class="personnel-left">
      <div class="personnel-header">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">组织结构</span>
      </div>
      <div class="personnel-left-tree">
        <PeTree></PeTree>
      </div>
    </div>
    <div class="personnel-right">
      <div class="personnel-header padding20">
        <i class="el-icon-share"></i>
        <span class="personnel-header-word">权限详情</span>
        <div class="personnel-header-button">
          <el-button type="primary" plain icon="el-icon-search">查看</el-button>
          <el-button type="primary" plain icon="el-icon-s-finance">编辑</el-button>
        </div>
      </div>
      <div class="personnel-right-main">
        <div class="RoleMain">
          <div v-for="(item, index) in roleList" class="RoleList">
            <div>
              <label class="roleTitle">应用菜单权限</label>
              <el-checkbox-group v-model="item.checkList">
                <el-checkbox :label="item.menuCode">{{ item.menuName }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="role-item">
              <label class="roleTitle">操作权限</label>
              <el-checkbox-group v-model="item.menuNameCheck">
                <el-checkbox :label="item1.roleCode" v-for="(item1, index1) in item.role">{{ item1.roleName }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PeTree from '@/components/PeTree.vue'
  export default {
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        roleList: [
         {
          menuName: '工作流管理',
          menuCode: 'gongzuoliu',
          checkList: [],
          menuNameCheck: [],
          role: [{
              roleName: '查看',
              roleCode: 'chakan'
            },
            {
              roleName: '下装工作流',
              roleCode: 'xiazhuang'
            },
            {
              roleName: '新建工作流',
              roleCode: 'xinjian'
            },
            {
              roleName: '编辑工作流',
              roleCode: 'bianji'
            },
          ]
        },
        {
          menuName: '工作流管理',
          menuCode: 'gongzuoliu',
          checkList: [],
          menuNameCheck: [],
          role: [{
              roleName: '查看',
              roleCode: 'chakan'
            },
            {
              roleName: '下装工作流',
              roleCode: 'xiazhuang'
            },
            {
              roleName: '新建工作流',
              roleCode: 'xinjian'
            },
            {
              roleName: '编辑工作流',
              roleCode: 'bianji'
            },
          ]
        },
        {
          menuName: '工作流管理',
          menuCode: 'gongzuoliu',
          checkList: [],
          menuNameCheck: [],
          role: [{
              roleName: '查看',
              roleCode: 'chakan'
            },
            {
              roleName: '下装工作流',
              roleCode: 'xiazhuang'
            },
            {
              roleName: '新建工作流',
              roleCode: 'xinjian'
            },
            {
              roleName: '编辑工作流',
              roleCode: 'bianji'
            },
          ]
        },
        {
          menuName: '工作流管理',
          menuCode: 'gongzuoliu',
          checkList: [],
          menuNameCheck: [],
          role: [{
              roleName: '查看',
              roleCode: 'chakan'
            },
            {
              roleName: '下装工作流',
              roleCode: 'xiazhuang'
            },
            {
              roleName: '新建工作流',
              roleCode: 'xinjian'
            },
            {
              roleName: '编辑工作流',
              roleCode: 'bianji'
            },
          ]
        },
        {
          menuName: '工作流管理',
          menuCode: 'gongzuoliu',
          checkList: [],
          menuNameCheck: [],
          role: [{
              roleName: '查看',
              roleCode: 'chakan'
            },
            {
              roleName: '下装工作流',
              roleCode: 'xiazhuang'
            },
            {
              roleName: '新建工作流',
              roleCode: 'xinjian'
            },
            {
              roleName: '编辑工作流',
              roleCode: 'bianji'
            },
          ]
        },
        ]
      }
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      }
    },
    components: {
      PeTree
    }
  }
</script>

<style scoped="scoped">
  .personnel {
    display: flex;
    margin-left: 20px;
    margin-top: 30px;
  }

  .personnel-left {
    padding-left: 20px;
    padding-right: 20px;
    height: 650px;
    flex: 4;
    border: 1px solid #cccccc;
  }

  .personnel-header {
    line-height: 60px;
    font-size: 16px;
    border-bottom: 1px solid #CCCCCC;
    color: black;
  }

  .personnel-header-word {
    margin-left: 20px;
  }

  .personnel-right {
    flex: 6;
    /* padding-left: 20px; */
    /* padding-right: 20px; */
    border: 1px solid #cccccc;
    margin-left: 40px;
    margin-right: 40px;
  }
  
  .padding20 {
    padding: 0px 20px;
  }
  
  .personnel-header-button {
    float: right;
  }
  
  .personnel-right-main {
    padding: 20px 20px;
    height: 588px;
    overflow: auto;
  }
  
  .RoleList {
    margin-bottom: 20px;
    padding: 30px 20px;
    /* background-color: #f2f2f2; */
    border: 1px solid #7fbcff;
  }
  .RoleList .el-checkbox__input {
    position: absolute;
    left: 110px;
  }
  .roleTitle {
    color: #0066cc;
    font-weight: 700;
    margin-bottom: 20px;
    display: inline-block;
  }
  .role-item {
    border-top: 1px solid #d6d6d6;
    margin-top: 20px;
    padding-top: 15px;
  }
</style>
