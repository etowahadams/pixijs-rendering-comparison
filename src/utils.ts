export const generateRandomData = (count: number): { x: number; y: number }[] => {
    const data: { x: number; y: number }[] = [];
  
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 10000;
      const y = Math.random() * 150;
      data.push({ x, y });
    }
  
    return data;
  };