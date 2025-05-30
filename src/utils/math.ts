export interface Vec2 {
  x: number;
  y: number;
}

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function clampMagnitude({ x, y }: Vec2, magnitude: number) {
  const currentMagnitude = Math.sqrt(x * x + y * y);
  if (currentMagnitude === 0) {
    return { x: 0, y: 0 };
  }

  const fraction = Math.min(currentMagnitude, magnitude) / currentMagnitude;
  return { x: x * fraction, y: y * fraction };
}

export function translate(
  translate: Vec2,
  coordinates: Vec2,
  origin: Vec2 = { x: 0, y: 0 },
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
  radius = 1,
) {
  const { x, y } = coordinates;
  if (radius < 0) {
    throw new Error('Radius must be positive');
  }
  if (squareSize <= 0) {
    throw new Error('Square size must be positive');
  }

  const clampX =
    Math.abs(x) > squareSize / 2 ? Math.sign(x) * (squareSize / 2) : x;
  const clampY =
    Math.abs(y) > squareSize / 2 ? Math.sign(y) * (squareSize / 2) : y;

  // Map coordinates to P' = {(x', y') | x', y' in [-1, 1]}
  const x_ = (2 * clampX) / squareSize;
  const y_ = (2 * clampY) / squareSize;

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
  squareSize = 2,
) {
  if (squareSize <= 0) {
    throw new Error('Square size must be positive');
  }
  if (radius < 0) {
    throw new Error('Radius must be positive');
  }

  // Map coordinates to unit circle
  const { x: clampX, y: clampY } = clampMagnitude(coordinates, radius);
  const x = clampX / radius;
  const y = clampY / radius;

  return {
    x: (0.5 * squareSize * x) / Math.sqrt(1 - (y * y) / 2),
    y: (0.5 * squareSize * y) / Math.sqrt(1 - (x * x) / 2),
  };
}
