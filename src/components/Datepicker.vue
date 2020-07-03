<template>
    <div :class="['input-group', 'date', size ? 'input-group-'+size : '']">
        <input v-bind="$attrs" type="text" :disabled="disabled" :id="id" class="form-control" :class="{'is-valid': this.state===true, 'is-invalid': this.state===false}" ref="dp">
        <div class="input-group-append">
            <button type="button" style="z-index: 0" class="btn btn-primary" :disabled="disabled"><font-awesome-icon icon="calendar-alt"></font-awesome-icon></button>
        </div>
    </div>
</template>

<script>

export default {
    inheritAttrs: false,
    props: ['value','state','id', 'disabled', 'size'],
    watch: {
        value: function(newVal, oldVal) {
            $(this.$el).datepicker('update', newVal)
        }
    },
    mounted() {
        var vm = this;
        $(this.$el).datepicker({
            format: 'yyyy-mm-dd',
            autoclose: true,
            language: 'id',
            weekStart: 1,
            todayHighlight: true,
            orientation: 'left auto',
            clearBtn: true
        }).on('changeDate', function(e) {
            vm.$emit('input', vm.$refs.dp.value)
        }).on('keyup', function(e) {
            // check if match (yyyy-mm-dd)
            var matches = vm.$refs.dp.value.match(/(\d{4})-(\d{1,2})-(\d{1,2})/i)

            if (matches) {
                vm.$emit('input', vm.$refs.dp.value)
            } else if (vm.$refs.dp.value == '') {
                vm.$emit('input', null)
            }
            // vm.$emit('input', vm.$refs.dp.value);
        });
        // init value conversion
        var initVal = this.value || ''
        // var matches = null
        // if (matches = initVal.match(/(\d{4})-(\d{1,2})-(\d{1,2})/i)) {
        //     initVal = `${matches[3]}-${matches[2]}-${matches[1]}`
        //     console.log('converted initial value: ' + initVal)
        // }
        // // trigger initial update
        $(this.$el).datepicker('update', initVal)
    },
    destroyed() {
        $(this.$el).datepicker('destroy')
    }
}
</script>