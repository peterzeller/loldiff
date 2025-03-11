import numpy as np

def lagrange_basis(x, x_coords, j):
    """
    Calculate the j-th Lagrange basis polynomial for a given x.

    :param x: The point at which to evaluate the basis polynomial.
    :param x_coords: List of x-coordinates.
    :param j: Index of the basis polynomial.
    :return: The value of the j-th Lagrange basis polynomial at x.
    """
    basis = 1.0
    for i in range(len(x_coords)):
        if i != j:
            basis *= (x - x_coords[i]) / (x_coords[j] - x_coords[i])
    return basis

def lagrange_interpolation(x, x_coords, y_coords):
    """
    Perform Lagrange interpolation to find the value of the polynomial at x.

    :param x: The point at which to evaluate the interpolating polynomial.
    :param x_coords: List of x-coordinates.
    :param y_coords: List of y-coordinates.
    :return: The interpolated value at x.
    """
    if len(x_coords) != len(y_coords):
        raise ValueError("x_coords and y_coords must have the same length.")

    interpolation = 0.0
    for j in range(len(y_coords)):
        interpolation += y_coords[j] * lagrange_basis(x, x_coords, j)
    return interpolation

def interpolate_polynomial(x_coords, y_coords, x_values):
    """
    Interpolate a polynomial for a list of x_values using Lagrange interpolation.

    :param x_coords: List of x-coordinates.
    :param y_coords: List of y-coordinates.
    :param x_values: List of x values to interpolate.
    :return: List of interpolated y values.
    """
    return [lagrange_interpolation(x, x_coords, y_coords) for x in x_values]

# Example usage
if __name__ == "__main__":
    # Given (x, y) coordinates
    x_coords = [1, 2, 3, 4]
    y_coords = [1, 4, 9, 16]

    # Points to interpolate
    x_values = [1.5, 2.5, 3.5]

    # Perform interpolation
    y_values = interpolate_polynomial(x_coords, y_coords, x_values)

    # Print results
    for x, y in zip(x_values, y_values):
        print(f"Interpolated value at x = {x}: {y}")