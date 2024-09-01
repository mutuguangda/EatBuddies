"use client";
import data from "@/data.json";
import Image from "next/image";
import Div100vh from "react-div-100vh";
import { atou } from "@/lib/utils";

export default function Page() {
  const ids = JSON.parse(
    atou((typeof window !== 'undefined' ? location.hash : '').slice(1))
  ) as string[];
  const order = data.filter((item) => ids.includes(item.id));

  return (
    <>
      <Div100vh className="flex flex-col">
        <div className="p-5 h-0 min-h-0 flex-grow overflow-auto flex flex-col gap-2">
          {order.map((item: any) => {
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
      </Div100vh>
    </>
  );
}
