"use client";
import data from "@/data.json";
import Image from "next/image";
import { useState } from "react";
import Div100vh from "react-div-100vh";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { cn, utoa } from "@/lib/utils";
import { setClipboard } from "@/lib/utils";

export default function Page() {
  const [order, setOrder] = useState<Recordable[]>([]);
  const shareUrl = `${location ? location.href: ''}/share#${utoa(
    JSON.stringify(order.map((item) => item.id))
  )}`;
  const { toast } = useToast();

  const handleAdd = (item: Recordable) => {
    if (order.includes(item)) {
      return;
    }
    setOrder([...order, item]);
  };

  const handleDelete = (item: Recordable) => {
    setOrder(() => order.filter((o) => o !== item));
  };

  const share = async () => {
    await setClipboard(shareUrl);
    toast({
      title: "已复制到剪贴板",
    });
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
              <div
                key={item.id}
                className={cn([
                  "flex p-5 gap-2 border rounded-lg",
                  order.includes(item) ? "border-primary" : "",
                ])}
              >
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
                    onClick={
                      !order.includes(item)
                        ? () => handleAdd(item)
                        : () => handleDelete(item)
                    }
                  >
                    <span
                      className={
                        !order.includes(item)
                          ? "icon-[heroicons--plus]"
                          : "icon-[heroicons--minus]"
                      }
                    ></span>
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
              <DrawerHeader>
                <DrawerTitle>已点的菜单</DrawerTitle>
              </DrawerHeader>
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
          <Button onClick={share} variant="outline">点菜</Button>
        </div>
      </Div100vh>
    </>
  );
}
