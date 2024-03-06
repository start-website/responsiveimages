var app = new Vue({
    delimiters: ['%%', '%%'],
    el: '.start',
    data: {
        plugin_url: document.querySelector('#plugin_url').value,
        is_php_version_less_7_1: document.querySelector('#is_php_version_less_7_1').value ? true : false,
        custom_css_instruction: false,
        loading: true,
        button_save_disabled: false,
        checkedNames: [],
        // Settings default
        settings: {
            metadata_iptc: false,
            remove_images: false,
            webp: false,
            deny_png: false,
            ready_alt: false,
            lqip: false,
            set_images_sizes_attr: false,
            image_adapter: 'gd',
            forbidden_pages: '',
            breakpoints: [375, 720, 960, 1280, 1366, 1920],
            aspect_ratio: [],
            enlarged_images: [],
            image_quality: 80,
            number_iterations: 100,
            min_width_image: 100
        }
    },

    filters: {
        bool: function (value) {
            if (!value) return ''
            value = Boolean(value)
            return value
        },

        int: function (value) {
            if (!value) return ''
            value = Number(value)
            return value
        },
    },

    methods: {
        faqOpen(e) {
            if (!e.target.className || !/faq__question/gi.test(e.target.className)) return

            const answer = e.target.parentNode.children[1]
            const question = e.target.parentNode.children[0]
            const icon = question.children[0]

            if (/open/gi.test(answer.className)) {
                answer.className = answer.className.replace(/\s(open)/, '')
                icon.className = icon.className.replace(/darr/gi, 'rarr')
            } else {
                answer.className += ' open'
                icon.className = icon.className.replace(/rarr/gi, 'darr')
            }
        },

        addBreakpoint() {
            this.settings.breakpoints.push(this.settings.breakpoints[(this.settings.breakpoints.length - 1)] * 2)
        },

        delBreakpoint() {
            this.settings.breakpoints.pop()
        },

        sortBreakpoints() {
            this.settings.breakpoints.sort(function (a, b) {
                return a - b;
            })

            this.settings.breakpoints = [...new Set(this.settings.breakpoints)]
        },

        reactiveBreakpoint(e, index) {
            Vue.set(this.settings.breakpoints, index, Number(e.target.value))
        },

        pageReload() {
            this.sortBreakpoints()

            setTimeout(function () {
                window.location.reload();
            }, 500);
        },
    },

    mounted: function () {
        this.settings = Object.assign({}, this.settings, settings_backend)
        this.loading = false
    }
})