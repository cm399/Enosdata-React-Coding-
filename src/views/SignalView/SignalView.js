import React, { useRef, useState,useEffect } from "react";
import styled from "styled-components";
import { SineWave } from "components";
// import Selection from "components/Selection";

const Container = styled.div`
  position: relative;
`;

// The Overlay is a div that lies on top of the chart to capture mouse events
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
`;

// The chart canvas will be the same height/width as the ChartWrapper
// https://www.chartjs.org/docs/3.2.1/configuration/responsive.html#important-note
const ChartWrapper = styled.div``;

const SignalView = () => {
  // Access the height of the chart as chartWrapperRef.current?.clientHeight to determine the height to set on events
  const chartWrapperRef = useRef();
  const chartHeight = chartWrapperRef.current?.clientHeight;
  const [showSelection, setShowSelection] = useState(false);
  const [Xstart, setXstart] = useState(0);
  const [Ewidth, setEwidth] = useState(0);
  const Selection = ({ styled }) => <div id="selection" style={styled} ></div>;
  //Working on draging 
  useEffect(()=>{
    let area = document.getElementsByClassName('area')[0]
    if(!area){return;}
    console.log(area);
    area.addEventListener("mousedown", function(e){
      area.classList.add("resize");  
      var m_pos = e.x;
      document.addEventListener("mousemove",()=>{
        let parent = area;
        let dx = m_pos - e.x;
        m_pos = e.x;
        parent.style.width = (parseInt(getComputedStyle(parent, '').width) + dx) + "px";
      }, false);
  }, false)
  })
  const handleMouseDown = (event) => {
    // Prevent the event from bubbling up to the chart
    event.stopPropagation();
    event.preventDefault();
    setShowSelection(true);
    setXstart(event.pageX);
    setEwidth(0);
  };

  const handleMouseMove = (event) => {
    if (showSelection) {
      let calWidth =
        event.pageX > Xstart ? event.pageX - Xstart : Xstart - event.pageX;
      let calLeft = event.pageX > Xstart ? Xstart : event.pageX;
      setEwidth(calWidth);
      return (
        <Selection  
          styled={{ width: calWidth, height: chartHeight, left: calLeft }}
        />,
        document.getElementById("overlayDiv")
      );
    }
  };

  const handleMouseUp = (event) => {
    setShowSelection(false);
    const area = document.createElement("div");
    area.classList.add("area");
    area.style.cursor = "w-resize"
    area.style.width = Ewidth + "px";
    area.style.height = chartHeight + "px";
    area.style.left =
      event.pageX > Xstart ? Xstart + "px" : Xstart - Ewidth + "px";
    document.getElementById("overlayDiv").append(area);
  };

  return (
    <Container>
      <ChartWrapper ref={chartWrapperRef}>
        <SineWave samplingRate={50} lowerBound={0} upperBound={10} />
      </ChartWrapper>
      {/* The overlay covers the same exact area the sine wave chart does */}
      <Overlay
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        id="overlayDiv">
        {/* You can place events in here as children if you so choose */}
      </Overlay>
    </Container>
  );
};

export default SignalView;
