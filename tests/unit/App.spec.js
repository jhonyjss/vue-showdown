import { shallowMount } from '@vue/test-utils'
import firebase from 'firebase/app'
import App from '@/App'
const fetch = require('jest-fetch-mock')
describe('@/App.vue', () => {
  let wrapper
  const node_env = import.meta.env
  beforeEach(async () => {
    jest.resetModules()
    import.meta.env = { ...node_env }
    wrapper = await shallowMount(App)
  })
  afterEach(() => {
    firebase.initializeApp.mockClear()
    wrapper.unmount()
  })
  afterAll(() => {
    import.meta.env = node_env
  })
  describe('Renders', () => {
    it('Layout of the application', () => {
      expect(wrapper.element).toMatchSnapshot()
    })
    it('Initialises firebase', () => {
      expect(firebase.initializeApp).toHaveBeenCalled()
    })
    it('Initialises firebase in production', async () => {
      import.meta.env.NODE_ENV = 'production'
      fetch.mockResponseOnce('{}')
      wrapper = await shallowMount(App)
      expect(firebase.initializeApp).toHaveBeenCalled()
      expect(fetch.mock.calls.length).toBe(1)
      expect(fetch.mock.calls[0][0]).toBe('__/firebase/init.json')
    })
    it('Calls offline is app is initialized offline', async () => {
      jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValueOnce(false)
      wrapper = await shallowMount(App)
    })
  })
  describe('Methods', () => {
    describe('#onLine', () => {
      it('Turns the editable content back on', () => {
        const elements = [{ setAttribute: jest.fn() }]
        wrapper.vm.status = 'offline'
        jest.spyOn(document, 'querySelectorAll').mockReturnValueOnce(elements)
        wrapper.vm.online()
        expect(wrapper.vm.status).toBe(null)
        expect(elements[0].setAttribute).toBeCalled()
      })
    })
    describe('#offLine', () => {
      it('Turns the editable content back on', () => {
        const elements = [{ setAttribute: jest.fn() }]
        wrapper.vm.status = 'offline'
        jest.spyOn(document, 'querySelectorAll').mockReturnValueOnce(elements)
        wrapper.vm.offline()
        expect(wrapper.vm.status).toBe('offline')
        expect(elements[0].setAttribute).toBeCalled()
      })
    })
  })
})
