import { DropLocator, DroppedTaskLocator } from './../modules/projects/actions/project.actions';

export function getStageAndSwimlaneId(element: HTMLBaseElement): number[] {
  return element
    .getAttribute('id')
    .split('-')
    .filter((_, idx) => idx % 2 !== 0)
    .map(Number);
}

export function mapDropEventToIds([_, element, target, source]): DropLocator {
  const taskId = Number(element.getAttribute('id'));
  const [ tStageId, tSwimlaneId ] = getStageAndSwimlaneId(target);
  const [ sStageId, sSwimlaneId ] = getStageAndSwimlaneId(source);
  const dropLocator: DropLocator = {
    taskId,
    from: { stageId: sStageId, swimlaneId: sSwimlaneId },
    to: { stageId: tStageId, swimlaneId: tSwimlaneId },
  };
  return dropLocator;
}

export function extendIdsObj(idsObj: DropLocator, project): DroppedTaskLocator {
  const destSwimlane = project.swimlanes.find((swimlane) => swimlane.id === idsObj.to.swimlaneId);
  const destStage = destSwimlane.stages.find((stage) => stage.id === idsObj.to.stageId);
  const draggedTask = destStage.cards.find(card => card.id === idsObj.taskId);
  const draggedTaskIdx = destStage.cards.indexOf(draggedTask);
  const prevTaskId: number|null = draggedTaskIdx > 0 ? destStage.cards[draggedTaskIdx - 1].id : null;
  const draggedTaskLocator: DroppedTaskLocator = { ...idsObj, projectId: project.id, prevTaskId };
  return draggedTaskLocator;
}
