import * as React from "react";
import { render } from "react-dom";
import Moveable, { OnDrag, OnResize, onRotate } from "react-moveable";
//import { Frame } from "scenejs";
import Selecto from "react-selecto";
import "./styles.css";

function App({ onLayoutChange, layout }: any) {
  const [targets, setTargets] = React.useState(null);
  const [targetId, setTargetId] = React.useState(null);

  const [frames, setFrames] = React.useState(null);
  const moveableRef = React.useRef<Moveable>(null);
  const onWindowResize = React.useCallback(() => {
    moveableRef.current.updateTarget();
  }, []);

  React.useEffect(() => {
    //const nextTargets = document.querySelector(".target");
    //  .forEach((node)=>{
    //   nextTargets.push(node);
    //  })
    //setTargets(nextTargets);
    // setFrames(
    //   nextTargets.map(
    //     frame =>
    //       new Frame(
    //         "transform: translateX(0px) translateY(0px) rotate(0deg) scaleX(1), scaleY(1)"
    //       )
    //   )
    // );
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, [onWindowResize]);

  return (
    <div className="page main">
      <Moveable
        ref={moveableRef}
        target={targets}
        //individualGroupable={true}
        draggable={true}
        resizable={true}
        rotatable={true}
        keepRatio={false}
        //throttleResize={0}
        //renderDirections={["nw","n","ne","w","e","sw","s","se"]}
        //edge={false}
        // zoom={1}
        // origin={true}
        onDrag={({ target, transform }: OnDrag) => {
          //console.log("target", target, transform);
          //target!.style.transform = transform;

          onLayoutChange(targetId, { transform });
        }}
        onResizeStart={({ setOrigin, dragStart }) => {
          setOrigin(["%", "%"]);
          //dragStart && dragStart.set(frame.translate);
        }}
        onResize={({ target, width, height, delta, drag }: OnResize) => {
          //console.log("onResize", target);
          //let beforeTranslate = drag.beforeTranslate;
          //target!.style.width = `${width}px`;
          //target!.style.height = `${height}px`;
          //-issue target!.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
          onLayoutChange(targetId, { width, height });
        }}
        onRotate={({ target, transform }: onRotate) => {
          //target!.style.transform = transform;

          onLayoutChange(targetId, { transform });
        }}
      />
      <Selecto
        selectableTargets={[".target"]}
        hitRate={0}
        selectByClick={true}
        selectFromInside={false}
        onDragStart={(e) => {
          const moveable = moveableRef.current;
          const target = e.inputEvent.target;
          if (moveable.isMoveableElement(target)) {
            e.stop();
          }
        }}
        onSelect={(e) => {
          console.log("e.selected", e.selected);
          setTargets(e.selected);
          setTargetId((e.selected as any)[0]?.id);
        }}
        onSelectEnd={(e) => {
          const moveable = moveableRef.current;
          if (e.isDragStart) {
            e.inputEvent.preventDefault();

            setTimeout(() => {
              moveable.dragStart(e.inputEvent);
            });
          }
        }}
      ></Selecto>
      <div className="container">
        <div
          className="target"
          id="target1"
          style={{
            width: layout["target1"]?.width,
            height: layout["target1"]?.height,
            transform: layout["target1"]?.transform
          }}
        >
          target1
        </div>
        <div
          className="target"
          id="target2"
          style={{
            width: layout["target2"]?.width,
            height: layout["target2"]?.height,
            transform: layout["target2"]?.transform
          }}
        >
          target2
        </div>
        <div
          className="target"
          id="target3"
          style={{
            width: layout["target3"]?.width,
            height: layout["target3"]?.height,
            transform: layout["target3"]?.transform
          }}
        >
          target3
        </div>
      </div>
    </div>
  );
}

function Main() {
  const [layout, setLayout] = React.useState({});

  const onLayoutChange = (id: number, ln: any) => {
    let l = { ...layout[id], ...ln };
    console.log(layout, l, id);
    setLayout((prev) => ({ ...prev, [id]: l }));
  };

  return <App layout={layout} onLayoutChange={onLayoutChange} />;
}

const rootElement = document.getElementById("root");
render(<Main />, rootElement);
