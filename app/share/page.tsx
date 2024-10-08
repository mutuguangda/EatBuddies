"use client";
import Image from "next/image";
import { atou } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Page() {
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const order: Recordable[] =
    typeof window !== "undefined"
      ? JSON.parse(atou(window.location.hash.slice(1)))
      : [];

  return (
    <div className="p-5 min-h-screen overflow-auto flex flex-col gap-2">
      {domLoaded && order.map((item: any) => {
        return (
          <div key={item.id} className="flex p-5 gap-2 border rounded-lg">
            {item.image ? (
              <Image
                src={`https://www.notion.so/image/${encodeURIComponent(
                  item.image
                )}?table=block&id=${item.id}`}
                alt={item.name}
                className="rounded-lg h-20 w-20 object-cover"
                width={80}
                height={80}
              />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex justify-center items-center text-2xl">
                {item.name[0]}
              </div>
            )}
            <div className="w-0 min-w-0 flex-grow flex flex-col justify-between">
              <div>{item.name}</div>
              <div className="pb-2 text-sm text-gray-500 w-full line-clamp-2">
                {item.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
