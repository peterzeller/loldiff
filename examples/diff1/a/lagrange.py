import numpy as np


def lagrange_interpolation(x_values, y_values, x):
    """
    Perform Lagrange interpolation for a given set of x and y values.
    :param x_values: List of x coordinates.
    :param y_values: List of y coordinates.
    :param x: The x value to interpolate.
    :return: Interpolated y value.
    """
    n = len(x_values)
    result = 0
    for i in range(n):
        term = y_values[i]
        for j in range(n):
            if i != j:
                term *= (x - x_values[j]) / (x_values[i] - x_values[j])
        result += term
    return result


def newton_interpolation(x_values, y_values, x):
    """
    Perform Newton's divided difference interpolation for a given set of x and y values.
    :param x_values: List of x coordinates.
    :param y_values: List of y coordinates.
    :param x: The x value to interpolate.
    :return: Interpolated y value.
    """
    n = len(x_values)
    divided_diff = np.zeros((n, n))
    divided_diff[:, 0] = y_values

    for j in range(1, n):
        for i in range(n - j):
            divided_diff[i][j] = (divided_diff[i + 1][j - 1] - divided_diff[i][j - 1]) / (x_values[i + j] - x_values[i])

    result = divided_diff[0, 0]
    product_term = 1.0
    for i in range(1, n):
        product_term *= (x - x_values[i - 1])
        result += divided_diff[0, i] * product_term

    return result