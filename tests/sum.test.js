import { calculator } from '../index.js'

describe('sum', () => {
    test('sum numbers', () => {
        const result = calculator.sum(2,2);
        expect(result).toBe(4);
    })
    
    test('sum numbers must result type number', () => {
        const result = calculator.sum(1, 1);
        const typeOfNumber = typeof(result);
        expect(typeOfNumber).toBe('number');
    })
    
    test('sum strings', () => {
        const result = calculator.sum('hello ', 'world');
        expect(result).toBe('hello world');
    })
    
    test('test sum must match letters regex', () => {
        const result = calculator.sum('hey', 'how');
        expect(result).toMatch(/[a-z]/i);
    })
    
})