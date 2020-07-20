export default {
    methods: {        
        badgeVariant(text) {
            // make it a number?
            const variants = [
                'primary', 
                'success', 
                'secondary', 
                'danger', 
                'light',
                'warning', 
                'dark',
                'info', 
            ];

            var n = Math.max(1, text.length);
            for (var i = 0; i < text.length; i++) {
                n += ( text.charCodeAt(i) * variants.length);
                n = n % 17;
            }
            return variants[(n) % variants.length];
        }
    }
}