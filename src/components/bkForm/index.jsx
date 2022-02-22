/* eslint-disable */

import Vue from 'vue';
import Btn from './btnList.vue';

Vue.component('List', {
    props: {
        config: {
            type: Object,
            required: true,
            default: () => { }
        },
        data: {
            type: Object,
            required: true,
            default: () => { }
        }
    },
    data() {
        return {};
    },
    render(h) {
        const { config, data } = this;
        let List = <div> </div>;
        List = <Btn config={config} data={data} />;
        return List;
    }
});