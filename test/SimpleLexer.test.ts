import { expect, test, describe } from 'vitest'
import { simpleLexer, TokenType } from '../src/SimpleLexer'

describe('SimpleLexer 测试', () => {
  // 基础测试用例
  describe('基础功能测试', () => {
    test('单个标识符', () => {
      const script = 'age'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.Id, text: 'age' }])
    })

    test('单个数字', () => {
      const script = '35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('单个大于号', () => {
      const script = '>'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.GT, text: '>' }])
    })

    test('大于等于号', () => {
      const script = '>='
      expect(simpleLexer(script)).toEqual([{ type: TokenType.GE, text: '>=' }])
    })
  })

  // 组合测试用例
  describe('组合表达式测试', () => {
    test('age >= 35', () => {
      const script = 'age >= 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('score > 100', () => {
      const script = 'score > 100'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'score' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.IntLiteral, text: '100' },
      ])
    })

    test('name >= 0', () => {
      const script = 'name >= 0'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'name' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '0' },
      ])
    })
  })

  // 复杂表达式测试
  describe('复杂表达式测试', () => {
    test('多个标识符和数字', () => {
      const script = 'age >= 35 score > 100'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
        { type: TokenType.Id, text: 'score' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.IntLiteral, text: '100' },
      ])
    })

    test('连续操作符', () => {
      const script = 'a > b >= c'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.Id, text: 'b' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.Id, text: 'c' },
      ])
    })

    test('数字开头的标识符', () => {
      const script = 'age123 >= 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age123' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })
  })

  // 空白字符处理测试
  describe('空白字符处理测试', () => {
    test('包含多个空格', () => {
      const script = '  age   >=   35  '
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('包含制表符', () => {
      const script = '\tage\t>=\t35\t'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('包含换行符', () => {
      const script = 'age\n>=\n35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })
  })

  // 边界情况测试
  describe('边界情况测试', () => {
    test('空字符串', () => {
      const script = ''
      expect(simpleLexer(script)).toEqual([])
    })

    test('只有空格', () => {
      const script = '   '
      expect(simpleLexer(script)).toEqual([])
    })

    test('只有制表符和换行符', () => {
      const script = '\t\n\r'
      expect(simpleLexer(script)).toEqual([])
    })

    test('单个字符标识符', () => {
      const script = 'a'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.Id, text: 'a' }])
    })

    test('单个数字字符', () => {
      const script = '7'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '7' },
      ])
    })
  })

  // 整数测试用例
  describe('整数处理测试', () => {
    test('零值', () => {
      const script = '0'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '0' },
      ])
    })

    test('单位数', () => {
      const script = '5'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '5' },
      ])
    })

    test('多位数', () => {
      const script = '123'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '123' },
      ])
    })

    test('大整数', () => {
      const script = '999999'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '999999' },
      ])
    })

    test('以零开头的数字', () => {
      const script = '007'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '007' },
      ])
    })

    test('多个连续数字', () => {
      const script = '123 456 789'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '123' },
        { type: TokenType.IntLiteral, text: '456' },
        { type: TokenType.IntLiteral, text: '789' },
      ])
    })

    test('数字与标识符混合', () => {
      const script = 'age123 456'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age123' },
        { type: TokenType.IntLiteral, text: '456' },
      ])
    })

    test('数字与操作符组合', () => {
      const script = '100 > 50 >= 25'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '100' },
        { type: TokenType.GT, text: '>' },
        { type: TokenType.IntLiteral, text: '50' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '25' },
      ])
    })

    test('长数字字符串', () => {
      const script = '12345678901234567890'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '12345678901234567890' },
      ])
    })

    test('数字前后有空白字符', () => {
      const script = '  123  '
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '123' },
      ])
    })

    test('数字与换行符', () => {
      const script = '123\n456\n789'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '123' },
        { type: TokenType.IntLiteral, text: '456' },
        { type: TokenType.IntLiteral, text: '789' },
      ])
    })

    test('数字与制表符', () => {
      const script = '123\t456\t789'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '123' },
        { type: TokenType.IntLiteral, text: '456' },
        { type: TokenType.IntLiteral, text: '789' },
      ])
    })
  })

  // 特殊字符测试
  describe('特殊字符处理测试', () => {
    test('包含下划线的标识符', () => {
      const script = 'user_name >= 0'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'user_name' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.IntLiteral, text: '0' },
      ])
    })
  })

  // 变量声明测试
  describe('变量声明测试', () => {
    test('int age = 35', () => {
      const script = 'int age = 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Int, text: 'int' },
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.Assignment, text: '=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('int age222 = 35', () => {
      const script = 'int age222 = 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Int, text: 'int' },
        { type: TokenType.Id, text: 'age222' },
        { type: TokenType.Assignment, text: '=' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })

    test('age == 35', () => {
      const script = 'age == 35'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'age' },
        { type: TokenType.EQ, text: '==' },
        { type: TokenType.IntLiteral, text: '35' },
      ])
    })
  })

  // 算术运算符测试
  describe('算术运算符测试', () => {
    test('单个加号', () => {
      const script = '+'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.Plus, text: '+' }])
    })

    test('单个减号', () => {
      const script = '-'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Minus, text: '-' },
      ])
    })

    test('单个乘号', () => {
      const script = '*'
      expect(simpleLexer(script)).toEqual([{ type: TokenType.Star, text: '*' }])
    })

    test('单个除号', () => {
      const script = '/'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Slash, text: '/' },
      ])
    })

    test('加法表达式', () => {
      const script = 'a + b'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Plus, text: '+' },
        { type: TokenType.Id, text: 'b' },
      ])
    })

    test('减法表达式', () => {
      const script = 'a - b'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Minus, text: '-' },
        { type: TokenType.Id, text: 'b' },
      ])
    })

    test('乘法表达式', () => {
      const script = 'a * b'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Star, text: '*' },
        { type: TokenType.Id, text: 'b' },
      ])
    })

    test('除法表达式', () => {
      const script = 'a / b'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Slash, text: '/' },
        { type: TokenType.Id, text: 'b' },
      ])
    })

    test('数字加法', () => {
      const script = '10 + 20'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '10' },
        { type: TokenType.Plus, text: '+' },
        { type: TokenType.IntLiteral, text: '20' },
      ])
    })

    test('数字减法', () => {
      const script = '100 - 50'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '100' },
        { type: TokenType.Minus, text: '-' },
        { type: TokenType.IntLiteral, text: '50' },
      ])
    })

    test('数字乘法', () => {
      const script = '5 * 6'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '5' },
        { type: TokenType.Star, text: '*' },
        { type: TokenType.IntLiteral, text: '6' },
      ])
    })

    test('数字除法', () => {
      const script = '15 / 3'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.IntLiteral, text: '15' },
        { type: TokenType.Slash, text: '/' },
        { type: TokenType.IntLiteral, text: '3' },
      ])
    })

    test('复杂算术表达式', () => {
      const script = 'a + b * c - d / e'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Plus, text: '+' },
        { type: TokenType.Id, text: 'b' },
        { type: TokenType.Star, text: '*' },
        { type: TokenType.Id, text: 'c' },
        { type: TokenType.Minus, text: '-' },
        { type: TokenType.Id, text: 'd' },
        { type: TokenType.Slash, text: '/' },
        { type: TokenType.Id, text: 'e' },
      ])
    })

    test('混合数字和变量', () => {
      const script = 'x + 10 - y * 5'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'x' },
        { type: TokenType.Plus, text: '+' },
        { type: TokenType.IntLiteral, text: '10' },
        { type: TokenType.Minus, text: '-' },
        { type: TokenType.Id, text: 'y' },
        { type: TokenType.Star, text: '*' },
        { type: TokenType.IntLiteral, text: '5' },
      ])
    })

    test('包含空格的算术表达式', () => {
      const script = '  a  +  b  *  c  '
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Plus, text: '+' },
        { type: TokenType.Id, text: 'b' },
        { type: TokenType.Star, text: '*' },
        { type: TokenType.Id, text: 'c' },
      ])
    })

    test('连续运算符', () => {
      const script = 'a + - b'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Plus, text: '+' },
        { type: TokenType.Minus, text: '-' },
        { type: TokenType.Id, text: 'b' },
      ])
    })

    test('除法与比较运算符', () => {
      const script = 'a / b >= c'
      expect(simpleLexer(script)).toEqual([
        { type: TokenType.Id, text: 'a' },
        { type: TokenType.Slash, text: '/' },
        { type: TokenType.Id, text: 'b' },
        { type: TokenType.GE, text: '>=' },
        { type: TokenType.Id, text: 'c' },
      ])
    })
  })
})
