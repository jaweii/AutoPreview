"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const test_utils_1 = require("@vue/test-utils");
const HelloWorld_vue_1 = require("@/components/HelloWorld.vue");
describe('HelloWorld.vue', () => {
    it('renders props.msg when passed', () => {
        const msg = 'new message';
        const wrapper = (0, test_utils_1.shallowMount)(HelloWorld_vue_1.default, {
            props: { msg }
        });
        (0, chai_1.expect)(wrapper.text()).to.include(msg);
    });
});
//# sourceMappingURL=example.spec.js.map