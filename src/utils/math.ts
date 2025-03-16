export type Vec2 = { x: number; y: number };

export function clamp(value: number, min: number = 0, max: number = 1) {
  return Math.min(Math.max(value, min), max);
}

export function clampMagnitude({ x, y }: Vec2, magnitude: number) {
  const currentMagnitude = Math.sqrt(x * x + y * y);
  const fraction = Math.min(currentMagnitude, magnitude) / currentMagnitude;
  return { x: x * fraction, y: y * fraction };
}

export function translate(
  translate: Vec2,
  coordinates: Vec2,
  origin: Vec2 = { x: 0, y: 0 }
) {
  const { x, y } = coordinates;
  const { x: ox, y: oy } = origin;
  const { x: dx, y: dy } = translate;
  return { x: x - ox + dx, y: y - oy + dy };
}

export function scale(scalar: number, vec2: Vec2) {
  const { x, y } = vec2;
  return {
    x: x * scalar,
    y: y * scalar,
  };
}

/**
 * Map coordinates in a square to coordinates in a circle with center at origin.
 * @param coordinates position in a square. Square expected to be centered at origin.
 * @param squareSize size of the square sides (P = {(x, y) | x, y in [-squareSize/2, squareSize/2]})
 * @param radius radius of the output circle
 * @returns coordinates in a circle (P = {(x, y) | x, y in [-radius, radius] and |P| <= radius})
 */
export function mapSquareToCircle(
  coordinates: Vec2,
  squareSize = 2,
  radius = 1
) {
  const { x, y } = coordinates;
  if (radius < 0) {
    throw new Error("Radius must be positive");
  }
  if (squareSize <= 0) {
    throw new Error("Square size must be positive");
  }
  if (Math.abs(x) > squareSize / 2 || Math.abs(y) > squareSize / 2) {
    // TODO: instead of error, map the coordinates, following a straight line to the center of the circle, to the edge of the square
    throw new Error("Coordinates must be in the square");
  }
  // Map coordinates to P' = {(x', y') | x', y' in [-1, 1]}
  const x_ = (2 * x) / squareSize;
  const y_ = (2 * y) / squareSize;

  return {
    x: radius * x_ * Math.sqrt(1 - (y_ * y_) / 2),
    y: radius * y_ * Math.sqrt(1 - (x_ * x_) / 2),
  };
}

/**
 * Map coordinates in a circle to coordinates in a square with center at origin.
 * @param coordinates position in a circle. Circle expected to be centered at origin.
 * @param radius radius of the circle (P = {(x, y) | x, y in [-radius, radius] and |P| <= radius})
 * @param squareSize size of the square sides
 * @returns coordinates in a square (P = {(x, y) | x, y in [-squareSize/2, squareSize/2]})
 */
export function mapCircleToSquare(
  coordinates: Vec2,
  radius = 1,
  squareSize = 2
) {
  if (squareSize <= 0) {
    throw new Error("Square size must be positive");
  }
  const { x, y } = coordinates;
  if (radius < 0) {
    throw new Error("Radius must be positive");
  }
  if (Math.abs(x) > radius || Math.abs(y) > radius) {
    // TODO: instead of error, map the coordinates, following a straight line to the center of the square, to the edge of the circle
    throw new Error("Coordinates must be in the circle");
  }
  // Map coordinates to unit circle
  const x_ = x / radius;
  const y_ = y / radius;

  return {
    x: (0.5 * squareSize * x_) / Math.sqrt(1 - (y_ * y_) / 2),
    y: (0.5 * squareSize * y_) / Math.sqrt(1 - (x_ * x_) / 2),
  };
}
