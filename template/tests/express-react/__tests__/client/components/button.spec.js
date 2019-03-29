import React from 'react'
import { mount } from 'enzyme'
import Button from '@components/Button'

describe('Button component', () => {
    it('mounts properly', () => {
        expect(mount(<Button>Register User</Button>)).toMatchSnapshot()
    })
})
