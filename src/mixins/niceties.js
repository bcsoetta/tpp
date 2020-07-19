export default {
    methods: {
        badgeVariant(text) {
            // make it a number?
            const variants = [
                'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
            ];

            var n = 0;
            for (var i = 0; i < text.length; i++) {
                n += text.charCodeAt(i) * Math.pow(2, i)
            }
            n = n % variants.length
            return variants[n]
        }
    }
}