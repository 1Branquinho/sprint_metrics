import type { SprintWidgetConfig } from "@/types/widgets";

import "./WidgetConfigPanel.css";

type WidgetConfigPanelProps = {
  widgets: SprintWidgetConfig[];
  onChange: (nextWidgets: SprintWidgetConfig[]) => void;
};

const chartOptionsByWidget: Record<SprintWidgetConfig["id"], SprintWidgetConfig["chartType"][]> = {
  burndown: ["line", "area"],
  status_breakdown: ["bar", "pie"],
  assignee_summary: ["table"],
};

const metricOptionsByWidget: Record<SprintWidgetConfig["id"], SprintWidgetConfig["metricMode"][]> = {
  burndown: ["points"],
  status_breakdown: ["points", "count"],
  assignee_summary: ["points", "count"],
};

const groupByByWidget: Record<SprintWidgetConfig["id"], SprintWidgetConfig["groupBy"][]> = {
  burndown: ["day"],
  status_breakdown: ["status"],
  assignee_summary: ["assignee"],
};

function chartLabel(value: SprintWidgetConfig["chartType"]): string {
  const labels: Record<SprintWidgetConfig["chartType"], string> = {
    bar: "Barras",
    line: "Linhas",
    area: "Area",
    pie: "Pizza",
    table: "Tabela",
  };

  return labels[value];
}

function metricLabel(value: SprintWidgetConfig["metricMode"]): string {
  const labels: Record<SprintWidgetConfig["metricMode"], string> = {
    points: "Pontos",
    count: "Quantidade",
  };

  return labels[value];
}

function groupByLabel(value: SprintWidgetConfig["groupBy"]): string {
  const labels: Record<SprintWidgetConfig["groupBy"], string> = {
    day: "Dia",
    status: "Status",
    assignee: "Responsavel",
    sprint: "Sprint",
  };

  return labels[value];
}

export function WidgetConfigPanel({ widgets, onChange }: WidgetConfigPanelProps) {
  function patch(id: SprintWidgetConfig["id"], patchValue: Partial<SprintWidgetConfig>) {
    const next = widgets.map((widget) => (widget.id === id ? { ...widget, ...patchValue } : widget));
    onChange(next);
  }

  function move(id: SprintWidgetConfig["id"], direction: "up" | "down") {
    const index = widgets.findIndex((widget) => widget.id === id);
    if (index < 0) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) {
      return;
    }

    const next = [...widgets];
    const [item] = next.splice(index, 1);
    next.splice(targetIndex, 0, item);
    onChange(next);
  }

  return (
    <section className="widget-config">
      <header>
        <h3>Widgets</h3>
        <p>Presets controlados com persistencia local.</p>
      </header>

      <div className="widget-config__list">
        {widgets.map((widget) => (
          <article className="widget-config__item" key={widget.id}>
            <div className="widget-config__title-row">
              <strong>{widget.title}</strong>
              <label>
                <input
                  checked={widget.enabled}
                  onChange={(event) => patch(widget.id, { enabled: event.target.checked })}
                  type="checkbox"
                />
                Ativo
              </label>
            </div>

            <div className="widget-config__controls">
              <label>
                Grafico
                <select
                  value={widget.chartType}
                  onChange={(event) =>
                    patch(widget.id, {
                      chartType: event.target.value as SprintWidgetConfig["chartType"],
                    })
                  }
                >
                  {chartOptionsByWidget[widget.id].map((option) => (
                    <option key={option} value={option}>
                      {chartLabel(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Metrica
                <select
                  value={widget.metricMode}
                  onChange={(event) =>
                    patch(widget.id, {
                      metricMode: event.target.value as SprintWidgetConfig["metricMode"],
                    })
                  }
                >
                  {metricOptionsByWidget[widget.id].map((option) => (
                    <option key={option} value={option}>
                      {metricLabel(option)}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Agrupar por
                <select
                  value={widget.groupBy}
                  onChange={(event) =>
                    patch(widget.id, {
                      groupBy: event.target.value as SprintWidgetConfig["groupBy"],
                    })
                  }
                >
                  {groupByByWidget[widget.id].map((option) => (
                    <option key={option} value={option}>
                      {groupByLabel(option)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="widget-config__order-actions">
              <button onClick={() => move(widget.id, "up")} type="button">
                Subir
              </button>
              <button onClick={() => move(widget.id, "down")} type="button">
                Descer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}