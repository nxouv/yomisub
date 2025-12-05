"use client";

import { Shell } from "@/components/layout/Shell";
import { PreviewCard } from "@/components/control/PreviewCard";
import { ControlCard } from "@/components/control/ControlCard";
import { ConnectionCard } from "@/components/control/ConnectionCard";


export default function Home() {
  return (
    <Shell>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左カラム：プレビュー */}
        <div className="w-full lg:flex-1 lg:min-w-0">
          <PreviewCard />
        </div>

        {/* 右カラム：コントロール + 接続 */}
        <div className="w-full lg:w-[340px] lg:shrink-0 flex flex-col gap-6">
          <ControlCard />
          <ConnectionCard />
        </div>
      </div>
    </Shell>
  );
}
