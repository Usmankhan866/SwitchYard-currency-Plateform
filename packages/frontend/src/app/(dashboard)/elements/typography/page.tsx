import { Card, CardContent, CardHeader, CardTitle } from "@dashboardpack/core/components/ui/card";
import { PageBreadcrumb } from "@/components/dashboard/breadcrumb";

export default function TypographyPage() {
  return (
    <>
      <PageBreadcrumb
        title="Typography"
        items={[{ label: "Elements" }, { label: "Typography" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Card 1: Headings */}
        <Card>
          <CardHeader>
            <CardTitle>Headings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-baseline gap-4">
                <h1 className="text-[2rem] font-semibold leading-tight">h1. Heading</h1>
                <span className="text-sm text-muted-foreground">2rem</span>
              </div>
              <div className="flex items-baseline gap-4">
                <h2 className="text-[1.5rem] font-semibold leading-tight">h2. Heading</h2>
                <span className="text-sm text-muted-foreground">1.5rem</span>
              </div>
              <div className="flex items-baseline gap-4">
                <h3 className="text-[1.25rem] font-semibold leading-tight">h3. Heading</h3>
                <span className="text-sm text-muted-foreground">1.25rem</span>
              </div>
              <div className="flex items-baseline gap-4">
                <h4 className="text-[1rem] font-semibold leading-tight">h4. Heading</h4>
                <span className="text-sm text-muted-foreground">1rem</span>
              </div>
              <div className="flex items-baseline gap-4">
                <h5 className="text-[0.875rem] font-semibold leading-tight">h5. Heading</h5>
                <span className="text-sm text-muted-foreground">0.875rem</span>
              </div>
              <div className="flex items-baseline gap-4">
                <h6 className="text-[0.75rem] font-semibold leading-tight">h6. Heading</h6>
                <span className="text-sm text-muted-foreground">0.75rem</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Display Headings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Headings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-light leading-tight">Display 1</span>
                <span className="text-sm text-muted-foreground">text-5xl</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-light leading-tight">Display 2</span>
                <span className="text-sm text-muted-foreground">text-4xl</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-light leading-tight">Display 3</span>
                <span className="text-sm text-muted-foreground">text-3xl</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-light leading-tight">Display 4</span>
                <span className="text-sm text-muted-foreground">text-2xl</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Inline Text Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Text Elements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                You can use the <mark className="bg-yellow-200 px-0.5 dark:bg-yellow-900/50">mark tag</mark> to highlight text.
              </p>
              <p>
                <del>This line of text is meant to be treated as deleted text.</del>
              </p>
              <p>
                <ins>This line of text is meant to be treated as an addition to the document.</ins>
              </p>
              <p>
                <small className="text-xs text-muted-foreground">This line of text is meant to be treated as fine print.</small>
              </p>
              <p>
                The following snippet of text is <strong>rendered as bold text</strong>.
              </p>
              <p>
                The following snippet of text is <em>rendered as italicized text</em>.
              </p>
              <p>
                An abbreviation of the word attribute is{" "}
                <abbr title="attribute" className="cursor-help underline decoration-dotted">attr</abbr>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Contextual Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Contextual Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="text-primary">This text is styled as primary.</p>
              <p className="text-[#2ca87f]">This text is styled as success.</p>
              <p className="text-[#dc2626]">This text is styled as danger.</p>
              <p className="text-[#e58a00]">This text is styled as warning.</p>
              <p className="text-[#3ebfea]">This text is styled as info.</p>
              <p className="text-[#7c4dff]">This text is styled as purple.</p>
              <p className="text-muted-foreground">This text is styled as muted.</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Lists</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6 text-sm">
              <div>
                <p className="mb-2 font-medium text-foreground">Unordered</p>
                <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                  <li>Lorem ipsum dolor</li>
                  <li>Consectetur adipiscing</li>
                  <li>Integer molestie lorem</li>
                </ul>
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground">Ordered</p>
                <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                  <li>Lorem ipsum dolor</li>
                  <li>Consectetur adipiscing</li>
                  <li>Integer molestie lorem</li>
                </ol>
              </div>
              <div>
                <p className="mb-2 font-medium text-foreground">Unstyled</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>Lorem ipsum dolor</li>
                  <li>Consectetur adipiscing</li>
                  <li>Integer molestie lorem</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Blockquotes */}
        <Card>
          <CardHeader>
            <CardTitle>Blockquotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <blockquote className="border-l-4 border-primary pl-4">
                <p className="text-base italic text-foreground">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet."
                </p>
                <footer className="mt-2 text-sm text-muted-foreground">
                  — Someone famous, <cite>Source Title</cite>
                </footer>
              </blockquote>
              <blockquote className="border-l-4 border-[#2ca87f] pl-4">
                <p className="text-base italic text-foreground">
                  "The best way to predict the future is to create it. Hard work and dedication pave the road to success."
                </p>
                <footer className="mt-2 text-sm text-muted-foreground">
                  — Peter Drucker, <cite>Management Consultant</cite>
                </footer>
              </blockquote>
            </div>
          </CardContent>
        </Card>

      </div>
    </>
  );
}
