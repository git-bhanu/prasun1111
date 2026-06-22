"use client";

import { WritingListItem } from "@/components/writings/writing-list-item";
import type {
  WritingConnectionQuery,
  WritingConnectionQueryVariables,
} from "@/tina/__generated__/types";
import { useTina } from "tinacms/dist/react";

type Props = {
  query: string;
  data: WritingConnectionQuery;
  variables: WritingConnectionQueryVariables;
};

type WritingNode = NonNullable<
  NonNullable<WritingConnectionQuery["writingConnection"]["edges"]>[number]
>["node"];

export default function WritingsClientPage({ query, data, variables }: Props) {
  const { data: tinaData } = useTina({ query, data, variables });

  const writings = (tinaData.writingConnection.edges ?? [])
    .map((e) => e?.node)
    .filter((n): n is NonNullable<WritingNode> => n != null)
    .filter((n, i, arr) => arr.findIndex((m) => m._sys.filename === n._sys.filename) === i)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return (
    <section className="w-full pb-20 pt-0 md:pt-2">
      {writings.length === 0 ? (
        <p className="px-4 py-12 font-space-grotesk text-black/40 md:px-[58px]">
          No writings yet.
        </p>
      ) : (
        <div>
          {writings.map((writing) => (
            <WritingListItem
              key={writing.id}
              slug={writing._sys.filename}
              titleSections={writing.titleSections ?? []}
              date={writing.date}
              tags={writing.tags}
              visualsCount={writing.visualsCount}
              readingType={writing.readingType}
            />
          ))}
        </div>
      )}
    </section>
  );
}
