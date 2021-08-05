function eval() {
    // Do not use eval!!!
    return;
}

const operations = {
    '+': (x, y) => x + y,
    '-': (x, y) => x - y,
    '*': (x, y) => x * y,
    '/': (x, y) => {
        if (y == 0) {
            throw "TypeError: Division by zero."
        }
        return x / y;
    }
};

const priorities = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
    '(': -1,
    ')': -1,
};

function expressionCalculator(expr) {
    let tokens = expr.replace(/\s+/g, '').match(/(\d+)|[\)\(\+\-\*\/]?/g).filter(x => x != '');
    let RPN = [], stack = [];
    tokens.forEach(token => {
        if (token == '(') {
            // if (stack.length && stack[stack.length - 1] == "-") {
            //     RPN.push(stack.pop());
            // }
            stack.push(token);
        } else if (token == ')') {
            if (stack.length) {
                let item = stack.pop();
                while (stack.length && item != '(') {
                    RPN.push(item);
                    item = stack.pop();
                }
                if (!stack.length && item != '(') {
                    throw "ExpressionError: Brackets must be paired";
                }
            }
        } else if (token in operations) {
            if (!stack.length) {
                stack.push(token);
            } else if (priorities[token] > priorities[stack[stack.length - 1]]) {

                stack.push(token);
            } else {
                RPN.push(stack.pop());
                stack.push(token);
            }
        } else {
            RPN.push(parseInt(token));
        }
    });
    while (stack.length) {
        let item = stack.pop();
        if (item == '(') {
            throw "ExpressionError: Brackets must be paired";
        }
        RPN.push(item);
    }

    RPN.forEach(token => {
        if (token in operations) {
            let [y, x] = [stack.pop(), stack.pop()];
            stack.push(operations[token](x, y));
        } else {
            stack.push(token);
        }
    });

    return +stack.pop().toFixed(4);
}

module.exports = {
    expressionCalculator
}