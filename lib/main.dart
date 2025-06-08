import { useState } from 'react';
import { Button } from "@/components/ui/button";

export default function HelloWorldApp() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="space-x-4">
        <Button onClick={() => setMessage("Hello from Button 1!")}>Button 1</Button>
        <Button onClick={() => setMessage("Hello from Button 2!")}>Button 2</Button>
      </div>
      <p className="text-xl mt-4">{message}</p>
    </div>
  );
}