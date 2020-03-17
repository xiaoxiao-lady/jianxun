<template>
    <div class="month-report">
        <div class="table">
            <div class="rows-common row-top">
                <li>{{year}} 年 {{month}} 月月度结算单</li>
            </div>
            <div class="rows-common rows-titles">
                <li>日期</li>
                <li>订单数量</li>
                <li>订单金额（元）</li>
            </div>
            <div class="list-bg">
                <div class="rows-common rows-list" v-for="(item, index) in list" :key="index">
                    <li>{{item.date}}</li>
                    <li>{{item.ddsl}}</li>
                    <li>{{item.yye}}</li>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { monthReport } from '@/api/monthReport'

export default {
    data () {
        return {
            year: new Date().getFullYear(),
            month: new Date().getMonth()+1,
            list: []
        }
    },
    created () {
        this.getList()
    },
    methods: {
        getList() {
            monthReport().then(res => {
                this.list = res.result
            })
        }
    }
}
</script>

<style scoped>
.month-report {
    padding: 5px;
}
.table {
    width: 100%;
    height: 100%;
    border-top: 1px solid #dbdbdb;
    border-left: 1px solid #dbdbdb;
    display: flex;
    flex-direction: column;
}
.list-bg {
    flex: 1;
    overflow: auto;
    border-bottom: 1px solid #dbdbdb;
}
.rows-common {
    display: flex;
    border-bottom: 1px solid #dbdbdb;
}

.rows-common li {
    flex: 1;
    border-right: 1px solid #dbdbdb;
    font-size: .3rem;
    padding: 5px;
}
.row-top li {
    font-size: .36rem;
}
.list-bg .rows-common:last-child {
    border-bottom: 0px;
}
</style>
