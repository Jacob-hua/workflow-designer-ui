<template>
  <div class="form">
    <div class="componentArea">
      123
    </div>
    <div class="ContentArea">
      123
    </div>
    <div class="AttributeArea">
      123
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        componentAreaList: ['radio', 'checkbox', 'select', 'selectApi', 'upLoad']
        ContentArea:[
          {
            type: 'radio',
            label: 'radio',
            key: 'radio',
            value: ''
          }
        ]
      }
    }
  }
</script>

<style scoped="scoped">
  .form {
    width: 100%;
    height: 100%;
    display: flex;
  }
  .componentArea {
    flex: 1;
  }
  .ContentArea {
    flex: 3;
  }
  .AttributeArea {
    flex: 1;
  }
</style>
