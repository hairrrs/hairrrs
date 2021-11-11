// a little function to help us with reordering the result
export const Reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 1;
export const getItemStyle = (isDragging, draggableStyle) => {
  return {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "grey" : "white",

    // styles we need to apply on draggables
    ...draggableStyle
  };
};

export const getQuestionListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightgrey" : "white",
  // padding: 8,
  // width: 350
});

export const getAnswerListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightgrey" : "white",
  padding: 4,
  width: 250
});
