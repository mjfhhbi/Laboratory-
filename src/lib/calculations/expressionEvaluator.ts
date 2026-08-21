export interface Token {
  type: 'NUMBER' | 'IDENTIFIER' | 'OPERATOR' | 'LPAREN' | 'RPAREN' | 'COMMA';
  value: string;
}

export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const str = expression.trim();

  while (i < str.length) {
    const ch = str[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < str.length && /[0-9.]/.test(str[i])) {
        numStr += str[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    if (/[a-zA-Z_\u0600-\u06FF]/.test(ch)) {
      let ident = '';
      while (i < str.length && /[a-zA-Z0-9_\u0600-\u06FF]/.test(str[i])) {
        ident += str[i];
        i++;
      }
      tokens.push({ type: 'IDENTIFIER', value: ident });
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    if (['+', '-', '*', '/', '^', '%'].includes(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch });
      i++;
      continue;
    }

    throw new Error(`کاراکتر نامعتبر در عبارت ریاضی: '${ch}'`);
  }

  return tokens;
}

const PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  '%': 2,
  '^': 3,
  'u-': 4 // unary minus
};

const RIGHT_ASSOCIATIVE: Record<string, boolean> = {
  '^': true,
  'u-': true
};

const BUILTIN_FUNCTIONS = new Set(['sqrt', 'abs', 'log', 'ln', 'exp', 'pow', 'round', 'floor', 'ceil', 'min', 'max']);

export function parseToRpn(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'IDENTIFIER') {
      if (BUILTIN_FUNCTIONS.has(token.value.toLowerCase())) {
        operatorStack.push(token);
      } else {
        outputQueue.push(token);
      }
    } else if (token.type === 'COMMA') {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) {
        throw new Error('ویرگول یا پرانتز نابجا در تابع.');
      }
    } else if (token.type === 'OPERATOR') {
      let op = token.value;
      // Detect unary minus
      const prev = tokens[i - 1];
      if (op === '-' && (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN' || prev.type === 'COMMA')) {
        op = 'u-';
      }

      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== 'LPAREN'
      ) {
        const top = operatorStack[operatorStack.length - 1];
        const isFunction = top.type === 'IDENTIFIER' && BUILTIN_FUNCTIONS.has(top.value.toLowerCase());
        const topOp = top.value;

        if (isFunction) {
          outputQueue.push(operatorStack.pop()!);
        } else if (
          (PRECEDENCE[topOp] > PRECEDENCE[op]) ||
          (PRECEDENCE[topOp] === PRECEDENCE[op] && !RIGHT_ASSOCIATIVE[op])
        ) {
          outputQueue.push(operatorStack.pop()!);
        } else {
          break;
        }
      }
      operatorStack.push({ type: 'OPERATOR', value: op });
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      let foundLparen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop()!;
        if (top.type === 'LPAREN') {
          foundLparen = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!foundLparen) {
        throw new Error('پرانتزهای باز و بسته نامتقارن هستند.');
      }
      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type === 'IDENTIFIER' &&
        BUILTIN_FUNCTIONS.has(operatorStack[operatorStack.length - 1].value.toLowerCase())
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('پرانتزهای باز و بسته نامتقارن هستند.');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

export function evaluateRpn(
  rpn: Token[],
  variables: Record<string, number> = {}
): { result: number; evaluationSteps: string[] } {
  const stack: number[] = [];
  const steps: string[] = [];

  // Normalize variable keys (lowercase)
  const normVars: Record<string, number> = {};
  for (const [k, v] of Object.entries(variables)) {
    normVars[k.toLowerCase()] = v;
  }

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      stack.push(parseFloat(token.value));
    } else if (token.type === 'IDENTIFIER') {
      const lower = token.value.toLowerCase();
      if (BUILTIN_FUNCTIONS.has(lower)) {
        if (lower === 'sqrt') {
          const a = stack.pop();
          if (a === undefined) throw new Error('ورودی ناکافی برای sqrt');
          if (a < 0) throw new Error('جذر از عدد منفی مجاز نیست.');
          const res = Math.sqrt(a);
          steps.push(`sqrt(${a}) = ${res}`);
          stack.push(res);
        } else if (lower === 'abs') {
          const a = stack.pop();
          if (a === undefined) throw new Error('ورودی ناکافی برای abs');
          stack.push(Math.abs(a));
        } else if (lower === 'ln' || lower === 'log') {
          const a = stack.pop();
          if (a === undefined) throw new Error('ورودی ناکافی برای لگاریتم');
          if (a <= 0) throw new Error('لگاریتم اعداد نامثبت تعریف نشده است.');
          const res = lower === 'log' ? Math.log10(a) : Math.log(a);
          stack.push(res);
        } else if (lower === 'exp') {
          const a = stack.pop();
          if (a === undefined) throw new Error('ورودی ناکافی برای exp');
          stack.push(Math.exp(a));
        } else if (lower === 'round') {
          const a = stack.pop();
          if (a === undefined) throw new Error('ورودی ناکافی برای round');
          stack.push(Math.round(a));
        } else if (lower === 'pow') {
          const b = stack.pop();
          const a = stack.pop();
          if (a === undefined || b === undefined) throw new Error('ورودی ناکافی برای pow');
          stack.push(Math.pow(a, b));
        } else if (lower === 'min' || lower === 'max') {
          const b = stack.pop();
          const a = stack.pop();
          if (a === undefined || b === undefined) throw new Error(`ورودی ناکافی برای ${lower}`);
          stack.push(lower === 'min' ? Math.min(a, b) : Math.max(a, b));
        }
      } else {
        if (!(lower in normVars)) {
          throw new Error(`متغیر '${token.value}' مقداردهی نشده است.`);
        }
        stack.push(normVars[lower]);
      }
    } else if (token.type === 'OPERATOR') {
      if (token.value === 'u-') {
        const a = stack.pop();
        if (a === undefined) throw new Error('عملوند ناکافی برای علامت منفی');
        stack.push(-a);
        continue;
      }

      const b = stack.pop();
      const a = stack.pop();

      if (a === undefined || b === undefined) {
        throw new Error(`عملوند ناکافی برای عملگر '${token.value}'`);
      }

      let res = 0;
      switch (token.value) {
        case '+':
          res = a + b;
          break;
        case '-':
          res = a - b;
          break;
        case '*':
          res = a * b;
          break;
        case '/':
          if (b === 0) {
            throw new Error('خطای تقسیم بر صفر: مخرج کسر نمی‌تواند صفر باشد.');
          }
          res = a / b;
          break;
        case '^':
          res = Math.pow(a, b);
          break;
        case '%':
          res = a % b;
          break;
        default:
          throw new Error(`عملگر ناشناخته: ${token.value}`);
      }
      stack.push(res);
    }
  }

  if (stack.length !== 1) {
    throw new Error('فرمول ریاضی نامعتبر است (تعداد عملوندها و عملگرها همخوانی ندارد).');
  }

  return {
    result: stack[0],
    evaluationSteps: steps
  };
}

export function evaluateExpression(
  expression: string,
  variables: Record<string, number> = {}
): { result: number; evaluationSteps: string[] } {
  const tokens = tokenize(expression);
  const rpn = parseToRpn(tokens);
  return evaluateRpn(rpn, variables);
}
