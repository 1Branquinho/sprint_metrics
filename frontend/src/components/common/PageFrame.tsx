import type { ReactNode } from "react";

import "./PageFrame.css";

type PageFrameProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function PageFrame({ title, subtitle, children }: PageFrameProps) {
  return (
    <section className="page-frame">
      <header className="page-frame__header">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </header>
      <div className="page-frame__body">{children}</div>
    </section>
  );
}
