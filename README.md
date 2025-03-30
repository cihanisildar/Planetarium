# Interactive Solar System - Planetarium

An interactive 3D visualization of our solar system built with React and Three.js. This educational tool allows users to explore the planets of our solar system, learn interesting facts, and understand the scale and beauty of our celestial neighborhood.

![Interactive Solar System](https://i.imgur.com/example.png)

## Features

- **Interactive 3D Environment**: Navigate through a realistic 3D model of our solar system
- **Planet Information**: Click on any planet to view detailed information and interesting facts
- **Realistic Orbital Mechanics**: Planets orbit around the sun at different speeds
- **Camera Controls**: Pan, zoom and rotate to view the solar system from any angle
- **Responsive Design**: Works on desktop and mobile devices
- **Educational Content**: Learn about each planet's characteristics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/planetarium.git
   cd planetarium
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

- **Navigation**: Click and drag to rotate the view, scroll to zoom in/out
- **Select Planet**: Click on any planet to view information about it
- **Return to Exploration**: Click "Continue Exploring" or press ESC to return to the solar system view

## Adding Planet Textures

This project is designed to work with custom planet textures. To add your own textures:

1. Place texture images in the `public/textures/` directory
2. Update the `planetsData` array in `src/components/SpaceScene.tsx` with the paths to your textures:

```javascript
{
  id: 'earth',
  name: 'Earth',
  // Other properties...
  textureUrl: '/textures/earth.jpg',
}
```

## Customization

You can customize the solar system by modifying the planet data in `src/components/SpaceScene.tsx`. Each planet has properties like:

- Position
- Size
- Orbital speed
- Rotation speed
- Color
- Description and facts

## Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber)
- [React Three Drei](https://github.com/pmndrs/drei)

## Future Enhancements

- Additional celestial bodies (moons, asteroids, comets)
- More detailed planet information
- Interactive tutorials
- Space missions information
- Constellation visualization
- Search functionality

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NASA for planetary information and inspiration
- Three.js community for 3D rendering tools and examples

---

Created with ❤️ for astronomy enthusiasts and educational purposes.
