<template>
  <div class="formDiv">
    <div id="form" ref="form">
      
    </div>
  </div>
</template>

<script>
  import {
    FormEditor
  } from '@bpmn-io/form-js-editor';
  export default {
    data() {
      return {
        formEditor: null,
        schema: {
          schemaVersion: 1,
          type: "default",
          exporter: {
            name: "form-js",
            version: "0.7.0"
          }
        }
      }
    },
    methods: {
      async init() {
        const container = this.$refs.form
        this.formEditor = new FormEditor({
          container: container
        });
        
        let str = '{"components":[{"label":"Text Field","type":"textfield","id":"Field_0wi0bph","key":"field_1h9sf53"},{"label":"Number","type":"number","id":"Field_17j2myb","key":"field_0015l1e"},{"label":"Checkbox","type":"checkbox","id":"Field_1yjofg1","key":"field_0uoxlai"},{"values":[{"label":"Value","value":"value"}],"label":"Radio","type":"radio","id":"Field_1iefqvx","key":"field_02t66sm"},{"values":[{"label":"Value","value":"value"}],"label":"Select","type":"select","id":"Field_19dd56r","key":"field_1x3uycc"},{"text":"# Text","type":"text","id":"Field_10bgy0v"},{"action":"submit","label":"Button","type":"button","id":"Field_1uvrwge","key":"field_148fk9h"}],"schemaVersion":4,"type":"default","exporter":{"name":"form-js","version":"0.7.0"},"id":"Form_0brc4xq"}'
        let schema = JSON.parse(str)
        this.formEditor.importSchema(schema)
        this.formEditor.on('selection.changed', (item) => {
          console.log('选中？', item)
        })
      },
      save() {
        let { href, filename } = this.setEncoded('form', 'test', JSON.stringify(this.formEditor.saveSchema()))
        this.downloadFunc(href, filename);
      },
      downloadProcess() {
        
      },
      // 根据所需类型进行转码并返回下载地址
      setEncoded(type, filename = "diagram", data) {
        const encodedData = encodeURIComponent(data);
        return {
          filename: `${filename}.${type}`,
          href: `data:application/${type === "svg" ? "text/xml" : "bpmn20-xml"};charset=UTF-8,${encodedData}`,
          data: data
        };
      },
      downloadFunc(href, filename) {
        if (href && filename) {
          let a = document.createElement("a");
          a.download = filename; //指定下载的文件名
          a.href = href; //  URL对象
          a.click(); // 模拟点击
          URL.revokeObjectURL(a.href); // 释放URL对象
        }
      },
      // 加载本地文件
      importLocalFile() {
        const that = this;
        const file = this.$refs.refFile.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          this.formEditor.importSchema(JSON.parse(reader.result))
        }
      },
    },
    mounted() {
      this.init()
    }
  }
</script>

<style scoped>
  h3 {
    margin: 40px 0 0;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
  
  .formDiv {
    height: 100%;
  }
  
  #form {
    /* height: calc(100vh - 48px); */
    height: 100%;
    background-color: aliceblue;
  }
  
  /deep/ .fjs-form-container {
    /* border: 1px solid #000000; */
    margin: 0px 0px 0px 00px;
  }
  
  /deep/ .fjs-palette-container {
    display: none;
  }
  
  /deep/ .fjs-properties-container {
    display: none;
  }
  
  /deep/ .fjs-context-pad {
    display: none;
  }
</style>
