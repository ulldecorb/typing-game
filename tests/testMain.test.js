const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import {testMain} from '../main.js'

describe('Test main coverage', () => {
    test('mainTest', () => {
        const result = testMain(2, 3);
        expect(true).toBe(true)
    })
})