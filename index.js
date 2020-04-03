const Reposition = (function () {
  const rects = [];

  function makeDraggable(el) {
    let pos1 = 0;
    let pos2 = 0;
    let pos3 = 0;
    let pos4 = 0;
    el.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();

      // Must have this here so we don't bubble events up to every other el with this listener
      e.stopPropagation();

      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;

      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();

      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;

      // set the element's new position:
      el.style.top = el.offsetTop - pos2 + "px";
      el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  function saveRect(el) {
    const rect = el.getBoundingClientRect();
    rects.push(rect);
  }

  // Reposition everything so it looks like the original but in FIXED space
  function setFixedLayout(el, rect) {
    const { top, right, bottom, left, width, height } = rect;

    // Must set this to 0, o/w sizing will be off for elems with padding set
    el.style.padding = "0px";

    // Must set these to 0 o/w dragging will mess up for things with margins (like h1)
    el.style.margin = "0px";

    el.style.top = top + "px";
    el.style.right = right + "px";
    el.style.bottom = bottom + "px";
    el.style.left = left + "px";
    el.style.width = width + "px";
    el.style.height = height + "px";
    el.style.position = "fixed";
  }

  function startRepositioning() {
    // Must save the original rects first before modification
    document.querySelectorAll("body *").forEach(saveRect);

    // This can also be called here and layout will look fine, cannot do it in the forEach along with saveRect above though
    document.querySelectorAll("body *").forEach((el, index) => {
      setFixedLayout(el, rects[index]);
      makeDraggable(el);
    });
  }

  return {
    startRepositioning,
    init: function () {
      const btn = document.createElement("button");
      btn.onclick = startRepositioning;
      btn.innerText = "Start repositioning";
      btn.style.position = "fixed";
      btn.style.top = 0;
      btn.style.left = 0;

      document.querySelector("body").prepend(btn);
    },
  };
})();

Reposition.init();
