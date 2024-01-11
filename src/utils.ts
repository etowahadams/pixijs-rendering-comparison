export const generateRandomData = (count: number, maxX: number, maxY: number): { x: number; y: number }[] => {
    const data: { x: number; y: number }[] = [];
  
    for (let i = 0; i < count; i++) {
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      data.push({ x, y });
    }
  
    return data;
  };