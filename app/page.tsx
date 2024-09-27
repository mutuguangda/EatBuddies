"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
import { throttle } from "lodash-es";
import data from '@/data/index.json'
import { getNotionData, transformNotionData } from "@/lib/notion";

export default function Page() {
  const [categories, setCategoreis] = useState<string[]>(data.categories)
  const [content, setContent] = useState<Recordable[]>(data.content);
  const [order, setOrder] = useState<Recordable[]>([]);
  const [category, setCategory] = useState<string>(categories[0]);
  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/share#${utoa(JSON.stringify(order))}`;
  const contentTransform = categories.reduce((acc, cur) => {
    acc[cur] = content.filter((item) => (item.tags || '').includes(cur));
    return acc;
  }, {} as Recordable);
  const container = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const remaining = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current) {
      const clientHeight = container.current.clientHeight, scrollHeight = container.current.scrollHeight;
      const nodeList = document.querySelectorAll("[data-target-anchor]");
      const anchors = Array.from(nodeList).map((item) => {
        return getScrollToElementValue(container.current!, item as HTMLElement) - 1;
      });
      if (remaining.current) {
        const lastAnchor = anchors[anchors.length - 1];
        const lastMenuitemHeight = scrollHeight - lastAnchor
        if (lastMenuitemHeight < clientHeight) {
          remaining.current.style.height = remaining.current.style.height || `${clientHeight - lastMenuitemHeight + 1}px`
        }
      }
      container.current.addEventListener(
        "scroll",
        throttle(() => {
          const scrollTop = container.current!.scrollTop;
          for (let i = 0; i < anchors.length; i++) {
            if (i === 0 && scrollTop < anchors[i]) {
              setCategory(categories[0]);
              break;
            }
            if (scrollTop >= anchors[i]) {
              if (i === anchors.length - 1) {
                setCategory(categories[i]);
                break;
              }
              if (scrollTop < anchors[i + 1]) {
                setCategory(categories[i]);
                break;
              }
            }
          }
        }, 200)
      );
      return container.current.removeEventListener("scroll", () => {});
    }
  }, [categories]);

  useEffect(() => {
    fetchData();

    async function fetchData() {
      const { response, isSync } = await getNotionData();
      if (!isSync) {
        const { categories, content } = await transformNotionData(response);
        setCategoreis(categories);
        setContent(content);
      }
    }
  }, [])

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

  const getScrollToElementValue = (
    scrollContainer: HTMLElement,
    targetElement: HTMLElement
  ) => {
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const relativeTop = targetRect.top - containerRect.top;
    const scrollValue = scrollContainer.scrollTop + relativeTop;
    return scrollValue;
  }

  return (
    <>
      <Div100vh className="flex flex-col">
        <div className="h-0 min-h-0 flex-grow flex">
          <div className="relative flex flex-col border-r">
            {categories.map((item) => (
              <a key={item} className="p-3" href={`#${item}`}>
                {item}
              </a>
            ))}
            <div
              className="absolute right-0 top-0 h-12 transition-all flex items-center"
              style={{
                transform: `translateY(${3 * categories.indexOf(category)}rem)`,
              }}
            >
              <span className="border-r-2 border-primary h-6 transform translate-y-0.5"></span>
            </div>
          </div>
          <div
            className="m-0 min-w-0 flex-grow p-3 overflow-auto flex flex-col gap-5 scroll-smooth"
            ref={container}
          >
            {Object.keys(contentTransform).map((key) => {
              return (
                <div key={key} className="flex flex-col gap-2">
                  <h3 id={key} data-target-anchor="1">
                    {key}
                  </h3>
                  {contentTransform[key].map((item: any) => {
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
                            priority={true}
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
              );
            })}
            <div ref={remaining}></div>
          </div>
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
          <Button onClick={share} variant="outline">
            分享
          </Button>
        </div>
      </Div100vh>
    </>
  );
}
