export default {
    methods: {
        badgeVariant(text) {
            // make it a number?
            const variants = [
                'primary', 
                'secondary', 
                'success', 
                'danger', 
                'warning', 
                'info', 
                'light', 
                'dark'
            ];

            var n = 0;
            for (var i = 0; i < text.length; i++) {
                n += text.charCodeAt(i) * ((i*2)+1)
            }
            n = (n+3) % variants.length
            return variants[n]
        }
    }
}