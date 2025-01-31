/**
 * A table of Card Sources (retrieved from backend) which facilitates controlling the order the Sources are
 * searched in and whether each Source is enabled.
 * This component forms part of the Search Settings modal.
 */

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"; // TODO: look into using `react-dnd` instead as it's a significantly smaller package
import React, { ReactNode, useCallback } from "react";
import Table from "react-bootstrap/Table";
// @ts-ignore: https://github.com/arnthor3/react-bootstrap-toggle/issues/21
import Toggle from "react-bootstrap-toggle";
import { useSelector } from "react-redux";

import { RootState } from "@/app/store";
import { ToggleButtonHeight } from "@/common/constants";
import { selectSourceDocuments } from "@/features/search/sourceDocumentsSlice";
import { Spinner } from "@/features/ui/spinner";

import {
  SourceRow,
  SourceSettings as SourceSettingsType,
} from "../../common/types";

interface SourceSettingsProps {
  sourceSettings: SourceSettingsType;
  setSourceSettings: {
    (newSourceSettings: SourceSettingsType): void;
  };
}

export function SourceSettings(props: SourceSettingsProps) {
  const maybeSourceDocuments = useSelector(selectSourceDocuments);

  const sourceSettingsSources = props.sourceSettings.sources;
  const setSourceSettings = props.setSourceSettings;
  const moveSourceToIndex = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      const updatedSources = [...(sourceSettingsSources ?? [])];
      const [removed] = updatedSources.splice(sourceIndex, 1);
      updatedSources.splice(destinationIndex, 0, removed);
      setSourceSettings({ sources: updatedSources });
    },
    [sourceSettingsSources, setSourceSettings]
  );

  const onDragEnd = (result: DropResult) => {
    /**
     * Update `localSourceOrder` according to the drag and drop result.
     */

    if (result.destination != null) {
      moveSourceToIndex(result.source.index, result.destination.index);
    }
  };

  const toggleSpecificSourceEnabledStatus = useCallback(
    (index: number) => {
      /**
       * Toggle the enabled status of the source at `index` in `localSourceOrder`.
       */

      const updatedSources = [...(sourceSettingsSources ?? [])];
      updatedSources[index] = [
        updatedSources[index][0],
        !updatedSources[index][1],
      ];
      setSourceSettings({ sources: updatedSources });
    },
    [sourceSettingsSources, setSourceSettings]
  );

  const toggleAllSourceEnabledStatuses = useCallback(() => {
    /**
     * Toggle the enabled status of all sources in `localSourceOrder`. If any is enabled, they're all disabled.
     */

    const sourcesOrEmpty = sourceSettingsSources ?? [];
    const newEnabledStatus = !sourcesOrEmpty.some((x) => x[1]);
    const updatedSources: Array<SourceRow> = sourcesOrEmpty.map((x) => [
      x[0],
      newEnabledStatus,
    ]);
    setSourceSettings({ sources: updatedSources });
  }, [sourceSettingsSources, setSourceSettings]);

  let sourceTable = <Spinner />;
  if (maybeSourceDocuments != null) {
    const sourceRows: Array<ReactNode> = (
      props.sourceSettings.sources ?? []
    ).map((sourceRow, index) => (
      <Draggable
        key={sourceRow[0]}
        draggableId={sourceRow[0].toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <tr
            key={`${sourceRow[0]}-row`}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <td
              key={`${sourceRow[0]}-toggle-column`}
              style={{ verticalAlign: "middle", width: 20 + "%" }}
            >
              <Toggle
                key={`${sourceRow[0]}-toggle`}
                on="On"
                onClassName="flex-centre prevent-select"
                off="Off"
                offClassName="flex-centre prevent-select"
                onstyle="primary"
                offstyle="secondary"
                size="md"
                width={80 + "%"}
                height={ToggleButtonHeight + "px"}
                active={sourceRow[1]}
                onClick={() => toggleSpecificSourceEnabledStatus(index)}
              />
            </td>
            <td
              key={`${sourceRow[0]}-name-column`}
              style={{ verticalAlign: "middle", width: 40 + "%" }}
            >
              {maybeSourceDocuments[sourceRow[0]].external_link != null ? (
                <a
                  href={maybeSourceDocuments[sourceRow[0]].external_link}
                  target="_blank"
                >
                  {maybeSourceDocuments[sourceRow[0]].name}
                </a>
              ) : (
                <a>{maybeSourceDocuments[sourceRow[0]].name}</a>
              )}
            </td>
            <td
              key={`${sourceRow[0]}-type-column`}
              className="prevent-select"
              style={{ verticalAlign: "middle", width: 30 + "%" }}
            >
              {maybeSourceDocuments[sourceRow[0]].source_type}
            </td>
            <td
              key={`${sourceRow[0]}-updown-button-column`}
              style={{
                verticalAlign: "middle",
                width: 5 + "%",
                textAlign: "center",
              }}
            >
              <div>
                <i
                  key={`${sourceRow[0]}-up-button`}
                  className="bi bi-chevron-double-up"
                  style={{ fontSize: 1 + "em", cursor: "pointer" }}
                  onClick={() => {
                    moveSourceToIndex(index, 0);
                  }}
                />
              </div>
              <div>
                <i
                  key={`${sourceRow[0]}-down-button`}
                  className="bi bi-chevron-double-down"
                  style={{ fontSize: 1 + "em", cursor: "pointer" }}
                  onClick={() => {
                    moveSourceToIndex(
                      index,
                      (props.sourceSettings.sources ?? []).length - 1
                    );
                  }}
                />
              </div>
            </td>
            <td
              key={`${sourceRow[0]}-drag-button-column`}
              style={{
                verticalAlign: "middle",
                width: 5 + "%",
                textAlign: "center",
              }}
            >
              <i
                key={`${sourceRow[0]}-drag-button`}
                className="bi bi-grip-horizontal"
                style={{ fontSize: 2 + "em" }}
              />
            </td>
          </tr>
        )}
      </Draggable>
    ));
    sourceTable = (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="source-order">
          {(provided, snapshot) => (
            <div
              style={{
                height: sourceRows.length * 59 + ToggleButtonHeight + "px",
              }}
            >
              <Table ref={provided.innerRef} style={{ tableLayout: "auto" }}>
                <thead>
                  <tr
                    style={{ height: ToggleButtonHeight + "px" }}
                    onClick={toggleAllSourceEnabledStatuses}
                  >
                    <th className="prevent-select">Enabled</th>
                    <th className="prevent-select">Source Name</th>
                    <th className="prevent-select">Source Type</th>
                    <th />
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {sourceRows}
                  {provided.placeholder}
                </tbody>
              </Table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return (
    <>
      <h5>Sources</h5>
      Configure the sources to include in the search results.
      <ul>
        <li>
          <b>Drag & drop</b> them to change the order they&apos;re searched in.
        </li>
        <li>
          Use the <b>arrows</b> to send a source to the top or bottom.
        </li>
        <li>
          Click the <b>table header</b> to enable or disable all sources.
        </li>
      </ul>
      {sourceTable}
    </>
  );
}
