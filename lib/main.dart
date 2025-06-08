import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  const initialColors = ["red", "green", "blue"];
  const [buttonColors, setButtonColors] = useState(initialColors);

  const changeColor = (index: number) => {
    const newColors = [...buttonColors];
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
    newColors[index] = randomColor;
    setButtonColors(newColors);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <div className="flex space-x-4">
        {buttonColors.map((color, index) => (
          <Button
            key={index}
            style={{ backgroundColor: color }}
            onClick={() => changeColor(index)}
            className="text-white"
          >
            Button {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
}