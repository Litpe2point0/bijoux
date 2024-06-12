import React, { useCallback, useRef, useEffect, useReducer } from "react";
import $ from "jquery";

const getPxValue = (remValue) => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return remValue * rootFontSize;
};

export const onGridReady = (gridId) => (params) => {
    
    
    const marginBottom = parseFloat($('.nav-tabs').css('margin-bottom')) ? parseFloat($('.nav-tabs').css('margin-bottom')) : 0;
    const nav_tabs_height = $('.nav-tabs').height() ? $('.nav-tabs').height() : 0;

    const headerPos = nav_tabs_height + marginBottom + getPxValue(1.5); // Adjust this selector and value as needed
    //alert(marginBottom+''+ nav_tabs_height)

    $(window).on("scroll", function () {

        const header = $(`#${gridId} .ag-header`);
        //alert(gridId)

        //alert('ngu')
        //const body_width=  $('.ag-theme-quartz').width()-1;
        const bodyWidth = $(`#${gridId}`).width() - 1;

        if ($(window).scrollTop() > headerPos) {
            //alert(body_width)
            header.css({
                position: 'fixed',
                top: 82,
                zIndex: 99,
                width: bodyWidth
            });
            //$('.ag-body-viewport.ag-layout-normal').css("margin-top", "150px");
            $(`#${gridId} .ag-body-viewport.ag-layout-normal`).css("margin-top", "150px");
        } else {
            header.css("position", "static");
            //$('.ag-body-viewport.ag-layout-normal').css("margin-top", "0px");
            $(`#${gridId} .ag-body-viewport.ag-layout-normal`).css("margin-top", "0px");
        }
    });
};
export const resetHeaderProperties = (key) => {
    
    const header = $(`#${key} .ag-header`);
    header.css({
        position: 'static',
        top: 'auto',
        zIndex: 'auto',
        width: 'auto'
    });
    $(`#${key} .ag-body-viewport.ag-layout-normal`).css("margin-top", "0px");


}

export const StickyText = ({ stickyRef }) => {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  
    React.useEffect(() => {
      window.addEventListener("scroll", forceUpdate);
      return () => window.removeEventListener("scroll", forceUpdate);
    }, []);
  
    return (
      <div
        style={{
          position: "fixed",
          bottom: 0,
          zIndex: 10000,
          backgroundColor: stickyRef.current ? "green" : "red",
          color: "white"
        }}
      >
        Is header sticky: {stickyRef.current.toString()}
      </div>
    );
  };


export default onGridReady;
