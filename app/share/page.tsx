"use client";
import data from "@/data.json";
import Image from "next/image";
import { useState } from "react";
import Div100vh from "react-div-100vh";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function Page() {
  const [order, setOrder] = useState<Recordable[]>([]);

  const handleAdd = (item: Recordable) => {
    setOrder([...order, item]);
  };

  const handleDelete = (item: Recordable) => {
    setOrder(() => order.filter((o) => o !== item));
  };

  return (
    <>
      {/* <header className="fixed top-0 border-b p-5 flex justify-between items-center">
        <span>EatBuddies</span>
        <div>
          
        </div>
      </header> */}
      <Div100vh className="flex flex-col">
        <div className="p-5 h-0 min-h-0 flex-grow overflow-auto flex flex-col gap-2">
          {data.map((item) => {
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
                <div className="flex flex-col justify-end">
                  <div
                    className="flex justify-center items-center p-1 text-gray-500 text-xl border rounded-full hover:text-primary hover:border-primary cursor-pointer"
                    onClick={() => handleAdd(item)}
                  >
                    <span className="icon-[heroicons--plus]"></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-5 border-t bg-background w-full flex justify-between items-center">
          <Drawer>
            <DrawerTrigger>
              <div className="flex items-center gap-1">
                <span className="text-xl">🤣</span>
                <span className="text-sm">
                  已点 <span className="text-primary">{order.length}</span> 道菜
                </span>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <div className="flex flex-col gap-2 p-2">
                {order.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center p-5 gap-2 border rounded-lg"
                    >
                      {item.image ? (
                        <Image
                          src={`https://www.notion.so/image/${encodeURIComponent(
                            item.image
                          )}?table=block&id=${item.id}`}
                          alt={item.name}
                          className="rounded-lg h-5 w-5 object-cover"
                          width={20}
                          height={20}
                        />
                      ) : (
                        <div className="w-5 h-5 bg-gray-100 rounded-lg flex justify-center items-center text-2xl">
                          {item.name[0]}
                        </div>
                      )}
                      <div className="w-0 min-w-0 flex-grow flex flex-col justify-between">
                        {item.name}
                      </div>
                      <div className="flex flex-col justify-end">
                        <div
                          className="flex justify-center items-center p-1 text-gray-500 text-xl border rounded-full hover:text-primary hover:border-primary cursor-pointer"
                          onClick={() => handleDelete(item)}
                        >
                          <span className="icon-[heroicons--trash]"></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </DrawerContent>
          </Drawer>
          <button
            onClick={() => {
              navigator.share({
                title: "分享标题",
                text: "分享内容",
                url: "分享链接",
              });
            }}
            className="btn-primary"
          >
            分享
          </button>
        </div>
      </Div100vh>
    </>
  );
}
