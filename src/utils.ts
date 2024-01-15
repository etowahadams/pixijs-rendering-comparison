export const generateRandomData = (options: {count: number, maxX: number, maxY: number, startX: number, startY: number}): { x: number; y: number }[] => {
    const data: { x: number; y: number }[] = [];
  
    for (let i = 0; i < options.count; i++) {
      const x = Math.random() * options.maxX;
      const y = Math.random() * options.maxY;
      data.push({ x: x + options.startX, y: y + options.startY });
    }
  
    return data;
  };