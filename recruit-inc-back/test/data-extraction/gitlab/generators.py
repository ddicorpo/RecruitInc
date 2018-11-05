from random import randint, choice
from .literals import OPERATOR_ADD, OPERATOR_SUB, OPERATOR_MUL, OPERATOR_DIV


def formula_generator(operation, digits_1=1, digits_2=1, range_1=None, range_2=None, even_1=False, even_2=False, big_endian=False):
    if range_1:
        low_limit_1, high_limit_1 = range_1
    else:
        low_limit_1 = 10 ** (digits_1 - 1)
        high_limit_1 = 10 ** digits_1 - 1

    if range_2:
        low_limit_2, high_limit_2 = range_2
    else:
        low_limit_2 = 10 ** (digits_2 - 1)
        high_limit_2 = 10 ** digits_2 - 1

    if operation == OPERATOR_DIV and low_limit_2 == 0:
        # Avoid generating a div by zero
        low_limit_2 = 1

    first_number = randint(low_limit_1, high_limit_1)
    second_number = randint(low_limit_2, high_limit_2)

    if even_1 and first_number % 2 != 0:
        first_number += 1

    if even_2 and second_number % 2 != 0:
        second_number += 1

    if big_endian and second_number > first_number:
        return formula_generator(operation, digits_1, digits_2, range_1, range_2, even_1, even_2, big_endian)

    if operation == OPERATOR_ADD:
        return '%d + %d' % (first_number, second_number), str(first_number + second_number)
    elif operation == OPERATOR_SUB:
        return '%d - %d' % (first_number, second_number), str(first_number - second_number)
    elif operation == OPERATOR_MUL:
        return '%d * %d' % (first_number, second_number), str(first_number * second_number)
    elif operation == OPERATOR_DIV:
        return '%d / %d' % (first_number, second_number), str(first_number / second_number)
