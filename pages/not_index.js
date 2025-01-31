import { useState } from "react";
import Image from "next/image"; // If you're using Next.js, otherwise use <img>

export default function ValentineInvite() {
  const [response, setResponse] = useState(null);

  if (response === "yes") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-3xl font-bold">Thank you! ❤️</h1>
        <p className="text-lg mt-2">Can't wait for our special day! 🥰</p>
      </div>
    );
  }
  if (response === "no") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-4">
        <h1 className="text-3xl font-bold">Are you sure? 🥺</h1>
        <p className="text-lg mt-2">I was really hoping you'd say yes... 😢</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      {/* Adding Image */}
      <Image 
        src="/Bingus.jpg" 
        alt="Valentine's Day" 
        width={500} 
        height={300} 
        className="rounded-lg mb-4" 
      />
      <h1 className="text-3xl font-bold">Will you be my Valentine? 💖</h1>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={() => setResponse("yes")}
          className="px-6 py-3 bg-pink-500 text-white rounded-full text-lg shadow-lg hover:bg-pink-600"
        >
          Yes
        </button>
        <button
          onClick={() => setResponse("no")}
          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-full text-lg shadow-lg hover:bg-gray-400"
        >
          No
        </button>
      </div>
    </div>
  );
}
