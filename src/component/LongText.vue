<template>
    <div class="wrapper">
        <label class="fontcolor" :style="labelStyle">{{label}}</label> 
        <el-tooltip :style="contentStyle" :content="content" :placement="placement" effect="light">
            <span class="text-hidden">{{ content }}</span>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        contentWidth: {
            type: Number,
            default: 180
        },
        labelWidth: {
            type: Number,
            default: 80
        },
        lineClamp: {
            type: Number,
            default: 1
        },
    },
    computed: {
        contentStyle() {
            return `width: ${this.contentWidth}px; -webkit-line-clamp: ${this.lineClamp}`
        },
        labelStyle() {
            return `width: ${this.labelWidth}px;`
        }
    },
}
</script>

<style>
.text-hidden {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: white;
}

.wrapper {
display: flex;
}

.fontcolor{
color: #999999;
}
</style>



