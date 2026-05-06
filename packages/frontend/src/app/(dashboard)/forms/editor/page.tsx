"use client";

import { useState } from "react";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@dashboardpack/core/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RichTextEditor } from "@/components/forms/rich-text-editor";

const PREPOPULATED_CONTENT = `<h2>Welcome to the Rich Text Editor</h2><p>This is a <strong>full-featured</strong> editor with support for <em>formatting</em>, <u>underline</u>, and <s>strikethrough</s>.</p><ul><li>Bullet lists</li><li>Ordered lists</li></ul><blockquote>Blockquotes look like this.</blockquote><p>You can also add <a href="https://example.com">links</a> and images.</p>`;

function HtmlOutput({ html }: { html: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
        View HTML Output
      </button>
      {open && (
        <pre className="mt-2 rounded-lg bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap break-all text-muted-foreground">
          {html || "<p></p>"}
        </pre>
      )}
    </div>
  );
}

export default function EditorPage() {
  const [fullHtml, setFullHtml] = useState(PREPOPULATED_CONTENT);
  const [minimalHtml, setMinimalHtml] = useState("");

  return (
    <>
      <PageBreadcrumb
        title="Editor"
        items={[{ label: "Forms" }, { label: "Editor" }]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rich Text Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              variant="full"
              content={PREPOPULATED_CONTENT}
              onChange={setFullHtml}
            />
            <HtmlOutput html={fullHtml} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Minimal Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              variant="minimal"
              placeholder="Write a comment..."
              onChange={setMinimalHtml}
            />
            <HtmlOutput html={minimalHtml} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
