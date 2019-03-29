import { mount } from '@vue/test-utils'
import Button from '@components/Button.vue'

describe('Button component', () => {
    it('mounts properly', () => {
        expect(
            mount(Button, {
                propsData: {
                    label: 'Register'
                }
            })
        ).toMatchSnapshot()
    })
})
