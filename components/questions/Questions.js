import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Reorder, getItemStyle, getQuestionListStyle } from "./utils";

function Questions({ questions, setQuestions, editMode }) {
  const [, setNewQuestion] = useState([])

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (questions && result.type === "QUESTIONS") {
      const q = Reorder(
        questions,
        result.source.index,
        result.destination.index
      );
      setQuestions(q)
    }
  }

  const [lastNumber, setLastNumber] = useState(0)

  const removeQuestion = async (div, id) => {
    let myArray = questions?.filter(function (obj) {
      return obj.id !== (id).slice(1);
    });
    await setQuestions(myArray);
    div.remove();
  }

  function addField() {
    let id = lastNumber + 1;
    var data = {
      id: `${(`question${id}`).toString()}`,
      content: ''
    };
    let q = questions?.push(data);
    setNewQuestion(q);
    setLastNumber(id);
  }
  
  return (<>
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <Droppable droppableId="droppable" type="QUESTIONS">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getQuestionListStyle(snapshot.isDraggingOver)}>

            {questions?.length>0 && questions?.map((question, index) => (
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={index}>

                {(provided, snapshot) => (
                  <div
                    id={question.id}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}>


                    <textarea
                      value={questions[index]['content']}
                      onChange={(e) => {
                        if (editMode) {
                          questions[index]['content'] = e.target.value
                          setNewQuestion(e.target.value)
                        }
                      }}
                      style={{
                        padding: '3px',
                        width: '100%',
                        // minHeight: '40px',
                        resize: 'none',
                        fontFamily: 'roboto'
                      }}
                      name="" id="" className="applicantForm" ></textarea>



                    {/* modify field buttons */}
                    {editMode && <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '15px'
                    }}>
                      <span {...provided.dragHandleProps}>
                        <b style={{
                          border: '1px solid #f9f9f9',
                          padding: '5px',
                          marginRight: 10
                        }}
                          className="fa fa-bars"></b>
                      </span>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          let id = `#${(question.id).toString()}`
                          let div = document.querySelector(id)
                          if (div) { removeQuestion(div, id) }
                        }}>
                        <b style={{
                          border: '1px solid #f9f9f9',
                          padding: '5px'
                        }}
                          className="fa fa-times"></b>
                      </span>
                    </div>}
                    {/* modify field buttons */}


                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

          </div>
        )}
      </Droppable>
    </DragDropContext>

    {editMode && <>
      <br />
      <span
        style={{
          border: '1px solid grey',
          padding: '5px 10px',
          marginBottom: '20px',
          cursor: 'pointer'
        }}
        onClick={() => { addField() }}>
        Add text field
      </span>
      <br />
    </>}
  </>);
}

export default Questions;
